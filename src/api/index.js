import ServiceContext from './ServiceContext';

export {
  ServiceContext,
};
export {
  updateApp,
  initializeFirebase,
  handelSendSignInLinkToEmail,
  handleSignInWithPassword,
  handleSendEmailVerification,
  handleReloadAuthUser,
  handelReauthenticateLinkToEmail,
  handleReauthenticateWithPassword,
  handleSignOut,
  setMyEmail,
  setMyPassword,
  setConfProperties,
  setAccountProperties,
  listenFirebase,
  isSignedIn,
} from './firebase';
export * from './ui';
