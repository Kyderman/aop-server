import { ApolloServer, PubSub } from "apollo-server";
import mongoose from "mongoose";
import { GraphQLSchema } from "graphql";
import { mergeSchemas } from "graphql-tools";

import dotenv from "dotenv";
import {
	CLIENT_ID,
	DB_NAME,
	MONGO_PORT,
	MONGO_URL
} from "./common/util/secrets";
import { userController } from "./user/user.controller";
import schemas from "./schema";
import resolvers from "./resolvers";

export const pubsub = new PubSub();

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// help to debug mongoose
mongoose.set("debug", true);

mongoose.connect(`mongodb://${MONGO_URL}:${MONGO_PORT}/${DB_NAME}`);

const schema: GraphQLSchema = mergeSchemas({
	schemas,
	resolvers
});

// GraphQL
const server = new ApolloServer({
	schema,
	context: async ({ req }: any) => {
		if (!req || !req.headers) {
			return;
		}

		const token = req.headers.authorization.split("Bearer ")[1] || "";
		const checkToken = await userController.findOrCreateUser(token);
		if (!checkToken.hasOwnProperty("authorized")) {
			return { user: checkToken, authorized: true };
		}
		return checkToken;
	},
	tracing: true,
	subscriptions: {
		onConnect: async (connectionParams: { authToken: string }, webSocket) => {
			const { authToken } = connectionParams;

			if (authToken) {
				const token = authToken.split("Bearer ")[1] || "";
				try {
					const checkToken = await userController.findOrCreateUser(token);
					if (!checkToken.hasOwnProperty("authorized")) {
						return { user: checkToken, authorized: true };
					}
					return checkToken;
				} catch (err) {
					throw new Error("Missing auth token!");
				}
			} else {
				throw new Error("Missing auth token!");
			}
		}
	}
});

server.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`🚀 Server ready at ${url}`);
	console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
