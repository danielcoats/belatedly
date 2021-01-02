/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly PUBLIC_URL: string;
      readonly REACT_APP_MICROSOFT_APP_ID: string;
    }
  }
