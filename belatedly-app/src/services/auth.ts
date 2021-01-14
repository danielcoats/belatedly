import {
  PublicClientApplication,
  SilentRequest,
  AuthenticationResult,
  Configuration,
  AccountInfo,
  InteractionRequiredAuthError,
  PopupRequest,
  EndSessionRequest,
} from '@azure/msal-browser';

const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: 'c312d846-60f8-4243-83db-589684367b9d',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const EMPTY_ACCOUNT_INFO: AccountInfo = {
  homeAccountId: '',
  environment: '',
  tenantId: '',
  username: '',
  localAccountId: '',
};

const loginRequest: PopupRequest = {
  scopes: ['Calendars.ReadWrite', 'MailboxSettings.Read'],
};

const profileRequest: PopupRequest = {
  scopes: ['User.Read', 'Calendars.ReadWrite', 'MailboxSettings.Read'],
};

const silentProfileRequest: SilentRequest = {
  scopes: ['openid', 'profile', 'User.Read', 'Calendars.ReadWrite', 'MailboxSettings.Read'],
  account: EMPTY_ACCOUNT_INFO,
  forceRefresh: false,
};

const msalApplication = new PublicClientApplication(MSAL_CONFIG);

class AccountNotFoundError extends Error {}

export const login = async (): Promise<void> => {
  try {
    await msalApplication.ssoSilent({
      loginHint: getAccount().username,
    });
  } catch (err) {
    if (
      err instanceof InteractionRequiredAuthError ||
      err instanceof AccountNotFoundError
    ) {
      await msalApplication.loginPopup(loginRequest);
    } else {
      throw err;
    }
  }
};

export const logout = (): void => {
  const logOutRequest: EndSessionRequest = { account: getAccount() };
  msalApplication.logout(logOutRequest);
};

const getAccount = (): AccountInfo => {
  const accounts = msalApplication.getAllAccounts();
  if (accounts.length === 0) throw new AccountNotFoundError('No account found');
  return accounts[0];
};

export const getProfileTokenPopup = async (): Promise<string> => {
  return getTokenPopup(
    { ...silentProfileRequest, account: getAccount() },
    profileRequest,
  );
};

const getTokenPopup = async (
  silentRequest: SilentRequest,
  interactiveRequest: PopupRequest,
): Promise<string> => {
  try {
    const response: AuthenticationResult = await msalApplication.acquireTokenSilent(
      silentRequest,
    );
    return response.accessToken;
  } catch (e) {
    console.log('Silent token acquisition failed');
    if (e instanceof InteractionRequiredAuthError) {
      console.log('Acquiring token using redirect');
      return msalApplication
        .acquireTokenPopup(interactiveRequest)
        .then((resp) => {
          return resp.accessToken;
        })
        .catch((err) => {
          console.error(err);
          return '';
        });
    } else {
      console.error(e);
      return '';
    }
  }
};
