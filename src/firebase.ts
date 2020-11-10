import {
	FIREBASE_SERVICE_ACCOUNT_KEY,
	FIREBASE_AUTH_DB
} from "./common/util/secrets";

import * as firebaseAdmin from "firebase-admin";

const admin = firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(
		JSON.parse(String(new Buffer(FIREBASE_SERVICE_ACCOUNT_KEY, "base64")))
	),
	databaseURL: FIREBASE_AUTH_DB
});

export { admin };
