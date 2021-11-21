/* eslint-disable quote-props */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ja: {
    translation: {
      'app name': 'Amber case',
      'OK': 'OK',
      'Cancel': '中止',
      'Send': '送信',
      'Save': '保存',
      'Update': '更新',
      'Confirmation': '確認',
      'Light mode': 'ライトモード',
      'Dark mode': 'ダークモード',
      'Accept system settings': 'システムの設定に従う',
      'E-mail': 'メールアドレス',
      'Password': 'パスワード',
      'Sign-in': 'ログイン',
      'Sign-out': 'ログアウト',
      'E-mail verification': 'メールアドレスの確認',
      'Settings': '設定',
      'Theme mode': '表示モード',
      'Display name': '表示名',
      'My display name': '表示名の変更',
      'My password': 'パスワードの変更',
      'My E-mail': 'メールアドレスの変更',
      'Accounts': 'アカウントの管理',
      'Policy': 'プライバシー・ポリシー',
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
      'allows to receive emails from the system': '@docomo.ne.jp などの携帯事業者のアドレスの場合は @amber-case.web.app からのメールを受信できるようにしてください。',
      'send email link': '記入したメールアドレス宛にログインのためのリンクを送信しました。',
      'email verification is required': 'メールアドレスの確認が必要です「送信」ボタンを押してください。',
      'send email verification': '記入したメールアドレス宛に確認のためのメールを送信しました。',
      'sign out fo retry': 'ログインを最初からやり直す場合はログアウトしてください。',
      'reload app to complete email verification': '受信したメールのリンクをクリックしても、自動でアプリの表示が切り替わらない場合は「更新」ボタンを押してください。',
      'failed to send email': 'メールを送信できませんでした。',
      'correct your email address': '正しい書式のメールアドレスを記入してください。',
      'correct your password': '8文字以上、大文字・小文字・数字・記号から3種類以上を使ってください。',
      'no login method worked or call admin': 'どのログイン方法でもうまくいかない場合は管理者にご連絡ください。',
      'sign-out confirmation': '本当にログアウトしますか？ 通常の利用方法の場合、ログアウトは不要です。',
      'reauthentication required': '重要な情報の更新のためにメールアドレスまたはパスワードの確認が必要です。',
      'receive email link for reauthentication': '確認のためのリンクをメールで受け取る',
      'send email for reauthentication': 'ログイン用のメールアドレス宛に確認のためのメールを送信しました。',
      'check password for reauthentication': 'パスワードが間違っているか、または、パスワードが設定されていません。',
      'input is required': '入力必須です。',
      'completed saving data': '保存しました。',
      'failed to save data': '保存できませんでした。',
      'do not match the confirmation input': '入力内容が一致しません。',
      'please verify email after change': '変更後に新しいメールアドレスの確認が必要になります。',
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
