export default interface User {
	id: number;
	password: string | undefined;
	firstName: string | undefined;
	lastName: string | undefined;
	email: string | undefined;
	role: string | undefined;
	state: string | undefined;
	photoLink: string | undefined;
}
