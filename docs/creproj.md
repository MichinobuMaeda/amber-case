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
```
