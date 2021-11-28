import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { validateReuired } from '../conf';
import { AppContext, setAccountProperties } from '../api';
import Guard from '../components/Guard';
import MyEmailPanel from '../components/MyEmailPanel';
import MyPasswordPanel from '../components/MyPasswordPanel';
import ReauthenticationPanel from '../components/ReauthenticationPanel';
import SignOutPanel from '../components/SignOutPanel';
import ThemeModePanel from '../components/ThemeModePanel';
import Section from '../components/Section';
import TextEdit from '../components/TextEdit';

const PreferencesPage = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  return (
    <Guard require="loaded" redirect data-testid="preferences-page">
      <Section>
        <ThemeModePanel />
      </Section>
      <Guard require="user">
        <Section>
          <TextEdit
            data-testid="myDisplayName"
            value={context.me.name}
            label={t('Display name')}
            validate={(v) => [
              !validateReuired(v) && t('input is required'),
            ]}
            onSave={(v) => setAccountProperties(context, context.me.id, { name: v })}
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
    </Guard>
  );
};

export default PreferencesPage;
