import { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

interface AadAuthConfig {
  appId: string;
  redirectUri: string;
  scopes: string[];
}

const config: AadAuthConfig = {
  appId: process.env.REACT_APP_MICROSOFT_APP_ID,
  redirectUri: 'http://localhost:3000',
  scopes: ['user.read'],
};

interface AadAuthResult {
  isAuthenticated: boolean;
}

export function useAadAuth(): AadAuthResult {
  const [application] = useState<PublicClientApplication>(
    initializeApplication,
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  function initializeApplication() {
    return new PublicClientApplication({
      auth: {
        clientId: config.appId,
        redirectUri: config.redirectUri,
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true,
      },
    });
  }

  useEffect(() => {
    async function getAccessToken(): Promise<string> {
      try {
        const accounts = application.getAllAccounts();

        if (accounts.length <= 0) throw new Error('login_required');
        var silentResult = await application.acquireTokenSilent({
          scopes: config.scopes,
          account: accounts[0],
        });

        return silentResult.accessToken;
      } catch (err) {
        if (isInteractionRequired(err)) {
          var interactiveResult = await application.acquireTokenPopup({
            scopes: config.scopes,
          });

          return interactiveResult.accessToken;
        } else {
          throw err;
        }
      }
    }

    const accounts = application.getAllAccounts();

    if (accounts && accounts.length > 0) {
      const token = getAccessToken();
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [application]);

  return {
    isAuthenticated,
  };
}

function isInteractionRequired(error: Error): boolean {
  if (!error.message || error.message.length <= 0) {
    return false;
  }

  return (
    error.message.indexOf('consent_required') > -1 ||
    error.message.indexOf('interaction_required') > -1 ||
    error.message.indexOf('login_required') > -1 ||
    error.message.indexOf('no_account_in_silent_request') > -1
  );
}
