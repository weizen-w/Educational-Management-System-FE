import Credentials from './Credentials';

export default interface RegisterData extends Credentials {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}
