declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_URL: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
      }
    }
    namespace Express {
      interface User {
        _id: string;
      }
    }
}

export {}