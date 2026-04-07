import {config} from "dotenv";

const nodeEnv = process.env.NODE_ENV || "development";


if (nodeEnv === 'development') {
    config({path: `.env.local`});
}

export const {DB_URL , SERVER_URL , JWT_SECRET , JWT_EXPIRES_IN ,PORT,NODE_ENV,GMAIL_PASS , GMAIL_USER   } = process.env;