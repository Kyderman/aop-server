import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	email: String,
	name: String,
	photoURL: String
});

const User = mongoose.model("users", UserSchema);

export { User };
