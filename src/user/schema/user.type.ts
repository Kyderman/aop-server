import { gql } from "apollo-server";

const userType = gql`
	type User {
		_id: String
		email: String
		name: String
		photoURL: String
	}
`;

export { userType };
