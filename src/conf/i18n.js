import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ja: {
    translation: {
      'app name': 'Amber case',
      OK: 'OK',
      Cancel: '中止',
      Send: '送信',
      Update: '更新',
      'Light mode': 'ライトモード',
      'Dark mode': 'ダークモード',
      'Accept system settings': 'システムの設定に従う',
      'E-mail': 'メールアドレス',
      password: 'パスワード',
      'Sign-in': 'ログイン',
      'Sign-out': 'ログアウト',
      'E-mail verification': 'メールアドレスの確認',
      Settings: '設定',
      'Theme mode': '表示モード',
      'My display name': '表示名',
      'My password': 'パスワード',
      'My E-mail': 'メールアドレス',
      Accounts: 'アカウントの管理',
      Polycy: 'セキュリティ・ポリシー',
      'Update app': 'アプリを更新してください。',
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
      'email verification is required': 'メールアドレスの確認が必要です「送信」ボタンを押してください。',
      'send email verification': '記入したメールアドレス宛に確認のためのメールを送信しました。',
      'sign out fo retry': 'ログインを最初からやり直す場合はログアウトしてください。',
      'reload app to complete email verification': '受信したメールのリンクをクリックしても、自動でアプリの表示が切り替わらない場合は「更新」ボタンを押してください。',
      'failed to send email': 'メールを送信できませんでした。',
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
