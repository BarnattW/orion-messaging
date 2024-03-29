declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_URI: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        FACEBOOK_CLIENT_ID: string;
        FACEBOOK_CLIENT_SECRET: string;
        GITHUB_CLIENT_ID: string;
        GITHUB_CLIENT_SECRET: string;
        JWT_KEY: string;
        COOKIE_SECRET: string;
      }
    }
    namespace Express {
      interface User {
        _id: string;
        userId: string;
      }
    }
}

export {}