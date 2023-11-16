import User from '../../auth/types/User';

export default interface UsersState {
	users: User[];
	error?: string;
}
