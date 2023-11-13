export default interface User {
	id: number;
	password: string | undefined;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	state: string;
	photoLink: string;
}
