import { User } from "./user.model";
import { admin } from "../firebase";

const userController = {
	users: (root: any, args: any) => User.find({}),

	findOrCreateUser: async (token: string) => {
		if (!token) {
			return { authorized: false };
		}

		const firebaseUser = await userController.verifyAuthToken(token);

		const user = await userController.checkIfUserExists(firebaseUser.email);
		if (user) {
			return user;
		} else {
			return userController.saveUser(firebaseUser);
		}
	},
	checkIfUserExists: (email: string) => {
		return User.findOne({ email }).exec();
	},
	saveUser: (firebaseUser: any) => {
		const { email, name, picture: photoURL } = firebaseUser;
		const user = { email, name, photoURL };
		const newUser = new User(user);
		return newUser.save();
	},
	verifyAuthToken: async (token: string) => {
		return admin.auth().verifyIdToken(token);
	}
};

export { userController };
