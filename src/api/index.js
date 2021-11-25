import AppContext from './AppContext';

export {
  AppContext,
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
  setGroupProperties,
  setAccountProperties,
  listenFirebase,
  isSignedIn,
  acceptAny,
  acceptUser,
  acceptAdmin,
} from './firebase';
export * from './ui';
