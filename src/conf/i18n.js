import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ja: {
    translation: {
      'app name': 'Amber case',
      'Sign-in': 'ログイン',
      Settings: '設定',
      Polycy: 'セキュリティ・ポリシー',
      'failed to sign in': 'ログインできませんでした。',
      'check your email address': 'メールアドレスを確認してください。',
      'unregistered account': '登録されていないアカウントです。',
      'loading config': 'システムの情報を取得しています。',
      'failed to load config': 'システムの情報が取得できませんでした。',
      'check connection': 'ネットワークの接続を確認してください。',
      'retry or call admin': 'やりなおしてもうまくいかない場合は管理者に連絡してください。',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja',
    interpolation: { escapeValue: false },
  });

export default i18n;
