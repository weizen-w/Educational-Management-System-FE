import Credentials from './Credentials';

export default interface RegisterData extends Credentials {
	password: string;
	firstName: string;
	lastName: string;
	email: string;
}
