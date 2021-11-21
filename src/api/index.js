import ServiceContext from './ServiceContext';

export {
  ServiceContext,
};
export {
  updateApp,
  initializeFirebase,
  listenFirebase,
  handelSendSignInLinkToEmail,
  handleSignInWithPassword,
  handleSendEmailVerification,
  handleReloadAuthUser,
  handelReauthenticateLinkToEmail,
  handleReauthenticateWithPassword,
  handleSignOut,
  setAccountProperties,
  setMyEmail,
  setMyPassword,
  isSignedIn,
} from './firebase';
export * from './ui';
