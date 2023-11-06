import User from './User';

export default interface UsersState {
	users: User[];
	error?: string;
}
