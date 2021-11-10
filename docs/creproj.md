# Creating this project

Install the reriquisites in [Development](dev.md) page.

$ npm -g install firebase-tools

https://console.firebase.google.com/
- Add project: amber-case
    - Configure Google Analytics
        - Create a new account: amber-case
        - Analytics location: Japan
- Project overview
    - Usage and billing
        - Details & settings
            - Modify plan: Blaze
    - Project settings
        - Default GCP resource location: asia-northeast1 ( Tokyo )
        - Public-facing name: Amber case
        - Support email: my address
        - Your apps
            - </> ( Web )
                - App nickname: Amber case
- Authentication
    - Sign-in method
        - Email/Password: Enable
            - Email link (passwordless sign-in): Enable
    - Templates
        - Template language: Japanese
- Firestore database
    - Create database: Start in production mode

```
$ npx create-react-app amber-case --template cra-template-pwa
$ gh repo create amber-case
? Visibility Public
? Would you like to add a .gitignore? No
? Would you like to add a license? Yes
? Choose a license MIT License
? This will add an "origin" git remote to your local repository. Continue? Yes
✓ Created repository MichinobuMaeda/amber-case on GitHub
✓ Added remote git@github.com:MichinobuMaeda/amber-case.git

$ git init
$ git remote add origin git@github.com:MichinobuMaeda/amber-case.git
$ git pull origin main
$ git add .
$ git commit -m "merge initial commit and react project"
$ git push --set-upstream origin main

$ firebase init firestore
? Please select an option: Use an existing project
? Select a default Firebase project for this directory: amber-case (amber-case)
? What file should be used for Firestore Rules? firestore.rules
? What file should be used for Firestore indexes? firestore.indexes.json

$ firebase init storage
? What file should be used for Storage Rules? storage.rules

$ firebase init functions
? What language would you like to use to write Cloud Functions? JavaScript
? Do you want to use ESLint to catch probable bugs and enforce style? Yes
? Do you want to install dependencies with npm now? No

$ yarn --cwd functions install

$ firebase init hosting
? What do you want to use as your public directory? build
? Configure as a single-page app (rewrite all urls to /index.html)? No
? Set up automatic builds and deploys with GitHub? Yes
? For which GitHub repository would you like to set up a GitHub workflow? (format: user/repository) MichinobuMaeda/amber-case
? Set up the workflow to run a build script before every deploy? Yes
? What script should be run before every deploy? npm ci && npm run build
? Set up automatic deployment to your site's live channel when a PR is merged? Yes
? What is the name of the GitHub branch associated with your site's live channel? main
i  Action required: Visit this URL to revoke authorization for the Firebase CLI GitHub OAuth App:
https://github.com/settings/connections/applications/89cf50f02ac6aaed3484

$ firebase init emulators
? Which Firebase emulators do you want to set up? Press Space to select emulators, then Enter to confirm your choices. Authentica
tion Emulator, Functions Emulator, Firestore Emulator, Hosting Emulator, Storage Emulator
? Which port do you want to use for the auth emulator? 9099
? Which port do you want to use for the functions emulator? 5001
? Which port do you want to use for the firestore emulator? 8080
? Which port do you want to use for the hosting emulator? 5000
? Which port do you want to use for the storage emulator? 9199
? Would you like to enable the Emulator UI? Yes
? Which port do you want to use for the Emulator UI (leave empty to use any available port)? 4040
? Would you like to download the emulators now? No

$ git add .
$ git commit -m "firebase init"
$ git push

$ gh secret list
FIREBASE_SERVICE_ACCOUNT_AMBER_CASE  Updated 2021-11-09

$ gh run list
STATUS  NAME              WORKFLOW                             BRANCH  EVENT  ID          ELAPSED  AGE
X       firebase init     Deploy to Firebase Hosting on merge  main    push   1439676149  22s      14h

 --> bug fix and push

$ firebase login:ci

***********

$ gh secret set FIREBASE_TOKEN_AMBER_CASE
? Paste your secret ***********

$ gh secret set INITIAL_EMAIL
? Paste your secret ***********

$ gh secret set INITIAL_PASSWORD
? Paste your secret ***********

$ gh secret set INITIAL_URL
? Paste your secret https://amber-case.web.app/

$ gh secret list
FIREBASE_SERVICE_ACCOUNT_AMBER_CASE  Updated 2021-11-09
FIREBASE_TOKEN_AMBER_CASE            Updated 2021-11-09
INITIAL_EMAIL                        Updated 2021-11-09
INITIAL_PASSWORD                     Updated 2021-11-09
INITIAL_URL                          Updated 2021-11-10
```
