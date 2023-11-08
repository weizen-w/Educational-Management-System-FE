
import ErrorResponse from '../errors/ErrorResponse';
import Module from './types/Module';

export async function getAllModules(): Promise<Module[]> {
	const result = await fetch(`/api/modules/`);
	return result.json();
}

export async function updateModule(id: number, module: Module): Promise<Module> {
	const result = await fetch(`/api/modules/${id}`, {
		method: 'PUT',
		body: JSON.stringify(module),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!result.ok) {
		let errTotalMessage = '';
		const errRes: ErrorResponse = await result.json();
		errRes.errors?.map((err) => {
			errTotalMessage += '/' + err.message;
		});
		if (errRes.message) errTotalMessage = errRes.message;
		throw new Error(errTotalMessage);
	}
	return result.json();
}

export async function createModule(name: string): Promise<Module> {
	const result = await fetch(`/api/modules`, {
		method: 'POST',
		body: JSON.stringify({ name }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (!result.ok) {
		let errTotalMessage = '';
		const errRes: ErrorResponse = await result.json();
		errRes.errors?.map((err) => {
			errTotalMessage += '/' + err.message;
		});
		if (errRes.message) errTotalMessage = errRes.message;
		throw new Error(errTotalMessage);
	}
	return result.json();
}
