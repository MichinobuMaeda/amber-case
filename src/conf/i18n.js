import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ja: {
    translation: {
      'app name': 'Amber case',
      OK: 'OK',
      Cancel: '中止',
      Send: '送信',
      'E-mail': 'メールアドレス',
      password: 'パスワード',
      'Sign-in': 'ログイン',
      'Sign-out': 'ログアウト',
      Settings: '設定',
      Polycy: 'セキュリティ・ポリシー',
      'failed to sign in': 'ログインできませんでした。',
      'check your email address': 'メールアドレスを確認してください。',
      'check your email and password': 'メールアドレスとパスワードを確認してください。',
      'unregistered account': '登録されていないアカウントです。',
      'loading config': 'システムの情報を取得しています。',
      'failed to load config': 'システムの情報が取得できませんでした。',
      'check connection': 'ネットワークの接続を確認してください。',
      'retry failed or call admin': 'やりなおしてもうまくいかない場合は管理者に連絡してください。',
      'select login method': 'ログイン方法を選択してください。',
      'sign in with email link': 'メールでログインの案内を受け取る',
      'email address and password': 'メールアドレスとパスワード',
      'receive email link': 'ログインのためのリンクをメールで受け取ります。',
      'allows to receive emails from the system': '@docomo.ne.jp などの携帯事業者のアドレスの場合は @amber-case.web.app からのメールを受信できるようにしてください。',
      'send email link': '記入したメールアドレス宛にログインのためのリンクを送信しました。',
      'failed to send email': 'メール送信の処理がきませんでした。',
      'correct your email address': '正しい書式のメールアドレスを記入してください。',
      'inputnis required': '入力必須です。',
      'no login method worked or call admin': 'どのログイン方法でもうまくいかない場合は管理者にご連絡ください。',
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
