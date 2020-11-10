import dotenv from "dotenv";
import fs from "fs";
import logger from "./logger";

if (fs.existsSync(".env")) {
	logger.log("info", "Using .env file to supply config environment variables");
	dotenv.config({ path: ".env" });
} else {
	logger.emerg("NO ENV DEFINED");
}

export const MONGO_PORT = process.env.MONGO_PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const DB_NAME = process.env.DB_NAME;
export const CLIENT_ID = process.env.CLIENT_ID;
export const FIREBASE_SERVICE_ACCOUNT_KEY =
	process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
export const FIREBASE_AUTH_DB = process.env.FIREBASE_AUTH_DB;
