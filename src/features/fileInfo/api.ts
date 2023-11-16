import ErrorResponse from '../errors/ErrorResponse';
import FileInfo from './FileInfo';

export async function addFile(file: File): Promise<FileInfo> {
	const formData = new FormData();
	formData.append('file', file);

	const res = await fetch(`/api/files`, {
		method: 'POST',
		body: formData,
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
