import ErrorResponse from '../errors/ErrorResponse';
import Credentials from './types/Credentials';
import RegisterData from './types/RegisterData';
import User from './types/User';

export async function user(): Promise<User> {
	const res = await fetch('/api/users/profile');
	if (!res.ok) {
		const { message }: { message: string } = await res.json();
		throw new Error(message);
	}
	return res.json();
}

export async function updateProfile(authUser: User): Promise<User> {
	const res = await fetch(`/api/users/profile`, {
		method: 'PUT',
		body: JSON.stringify(authUser),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (!res.ok) {
		let errTotalMessage = '';
		const errRes: ErrorResponse = await res.json();
		errRes.errors?.map((err) => {
			errTotalMessage += '/' + err.message;
		});
		if (errRes.message) errTotalMessage = errRes.message;
		throw new Error(errTotalMessage);
	}
	return res.json();
}

export async function login(credentials: Credentials): Promise<{ message: string }> {
	const res = await fetch('/api/login', {
		method: 'POST',
		body: `username=${credentials.email}&password=${credentials.password}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
	// реджектим промис если вернулся ошибочный статус
	if (!res.ok) {
		// достаем текст ошибки из ответа
		const { message }: { message: string } = await res.json();
		throw new Error(message);
	}
	return res.json();
}

export async function register(data: RegisterData): Promise<User> {
	const res = await fetch('/api/users/register', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
		},
	});
	interface Error {
		message: string;
		field: string;
		rejectedValue: string;
	}
	if (res.status !== 201) {
		const { errors }: { errors: Error[] } = await res.json();
		errors.forEach((err) => {
			throw new Error(`${err.field} ${err.rejectedValue} ${err.message}`);
		});
	}
	return res.json();
}

export async function corfirmEmail(confirmCode: string): Promise<User> {
	const res = await fetch(`api/users/confirm/${confirmCode}`);
	if (!res.ok) {
		const { message }: { message: string } = await res.json();
		throw new Error(message);
	}
	return res.json();
}

export async function logout(): Promise<void> {
	await fetch('/api/logout', {
		method: 'PUT',
	});
}
