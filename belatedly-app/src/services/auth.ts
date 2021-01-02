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

/**
 * Handles authentication with Azure AD
 */
export class Auth {
  private myMSALObj: PublicClientApplication;
  private account: AccountInfo;
  private loginRequest: PopupRequest;
  private profileRequest: PopupRequest;
  private silentProfileRequest: SilentRequest;

  constructor() {
    this.myMSALObj = new PublicClientApplication(MSAL_CONFIG);
    this.account = EMPTY_ACCOUNT_INFO;

    this.loginRequest = {
      scopes: [],
    };

    this.profileRequest = {
      scopes: ['User.Read'],
    };

    this.silentProfileRequest = {
      scopes: ['openid', 'profile', 'User.Read'],
      account: EMPTY_ACCOUNT_INFO,
      forceRefresh: false,
    };
  }

  private getAccount(): AccountInfo {
    const currentAccounts = this.myMSALObj.getAllAccounts();
    if (currentAccounts === null) {
      console.log('No accounts detected');
      return EMPTY_ACCOUNT_INFO;
    }

    return currentAccounts[0];
  }

  private handlePopupResponse(response: AuthenticationResult | null) {
    if (response !== null) {
      this.account = response.account ?? EMPTY_ACCOUNT_INFO;
    } else {
      this.account = this.getAccount();
    }
  }

  login(): void {
    this.myMSALObj
      .loginPopup(this.loginRequest)
      .then((resp: AuthenticationResult) => {
        this.handlePopupResponse(resp);
      })
      .catch(console.error);
  }

  /**
   * Logs out of current account.
   */
  logout(): void {
    const logOutRequest: EndSessionRequest = {
      account: this.account,
    };

    this.myMSALObj.logout(logOutRequest);
  }

  /**
   * Gets the token to read user profile data from MS Graph silently, or falls back to interactive popup.
   */
  async getProfileTokenPopup(): Promise<string> {
    this.silentProfileRequest.account = this.account;
    return this.getTokenPopup(this.silentProfileRequest, this.profileRequest);
  }

  /**
   * Gets a token silently, or falls back to interactive popup.
   */
  private async getTokenPopup(
    silentRequest: SilentRequest,
    interactiveRequest: PopupRequest,
  ): Promise<string> {
    try {
      const response: AuthenticationResult = await this.myMSALObj.acquireTokenSilent(
        silentRequest,
      );
      return response.accessToken;
    } catch (e) {
      console.log('Silent token acquisition failed');
      if (e instanceof InteractionRequiredAuthError) {
        console.log('Acquiring token using redirect');
        return this.myMSALObj
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
  }
}
