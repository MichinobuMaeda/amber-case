import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired } from '../conf';
import AppContext from '../api/AppContext';
import { Priv } from '../api/authorization';
import { setAccountProperties } from '../api/accounts';
import Guard from '../components/Guard';
import Section from '../components/Section';
import TextEdit from '../components/TextEdit';
import ThemeModePanel from '../panels/ThemeModePanel';
import SignOutPanel from '../panels/SignOutPanel';
import ReauthenticationPanel from '../panels/ReauthenticationPanel';
import MyEmailPanel from '../panels/MyEmailPanel';
import MyPasswordPanel from '../panels/MyPasswordPanel';

const PreferencesPage = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  return (
    <>
      <Section data-testid="preferences-page">
        <ThemeModePanel />
      </Section>
      <Guard require={Priv.USER}>
        <Section>
          <TextEdit
            data-testid="myDisplayName"
            value={context.me!.name}
            label={t('Display name')}
            validate={(v) => !validateReuired(v) && t('input is required')}
            onSave={(v) => setAccountProperties(context, context.me!.id!, { name: v })}
          />
        </Section>
        {context.reauthenticationTimeout === 0 ? (
          <Section title={`${t('My password')} / ${t('My E-mail')}`}>
            <ReauthenticationPanel />
          </Section>
        ) : (
          <>
            <Section title={t('My password')}>
              <MyPasswordPanel />
            </Section>
            <Section title={t('My E-mail')}>
              <MyEmailPanel />
            </Section>
          </>
        )}
        <Section title={t('Sign-out')}>
          <SignOutPanel />
        </Section>
      </Guard>
    </>
  );
};

export default PreferencesPage;
