import { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getUser, updateProfile } from './authSlice';
import { selectUser } from './selectors';
import { selectUserErrors } from '../users/selectors';
import ProfileEdit from './ProfileEdit';
import { uploadFile } from '../fileInfo/filesSlice';

export default function Profile(): JSX.Element {
	const user = useAppSelector(selectUser);
	const error = useAppSelector(selectUserErrors);
	const dispatch = useAppDispatch();
	const [editAvatar, setEditAvatar] = useState<boolean>(false);
	const [file, setFile] = useState<File | null>(null);
	const [fileError, setFileError] = useState<string>('');

	const checkAvatar = (): string => {
		return user?.photoLink
			? user?.photoLink
			: 'https://ems-files.fra1.digitaloceanspaces.com/avatar/default-avatar.png';
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const currFile = event.target.files?.[0] || null;
		setFile(currFile);
	};

	const handleUpload = useCallback(async () => {
		if (!file) {
			setFileError('Error file upload');
			return;
		}

		try {
			const resFile = await dispatch(uploadFile(file));
			if (uploadFile.fulfilled.match(resFile)) {
				await dispatch(
					updateProfile({
						id: user?.id || 0,
						firstName: undefined,
						lastName: undefined,
						email: undefined,
						password: undefined,
						role: undefined,
						state: undefined,
						photoLink: resFile.payload.message,
					})
				);
			}

			setFile(null);
			setEditAvatar(false);
			setFileError('');
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
		}
	}, [dispatch, file, fileError]);

	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	return (
		<>
			<h1>Profile</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<div style={{ display: 'flex' }}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<img
						src={checkAvatar()}
						alt="Avatar"
						style={{ maxWidth: '150px', margin: '10px 35px 10px 35px' }}
					/>
					{editAvatar ? (
						<>
							<input
								type="file"
								className={`form-control ${error ? 'is-invalid' : ''}`}
								onChange={handleFileChange}
							/>
							{fileError && (
								<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
									{fileError}
								</div>
							)}
							<div style={{ padding: '10px' }}>
								<button className="btn btn-success" onClick={handleUpload}>
									Save
								</button>
								<button className="btn btn-danger" onClick={() => setEditAvatar(false)}>
									Cancel
								</button>
							</div>
						</>
					) : (
						<button
							style={{ maxWidth: '80%' }}
							type="button"
							className="btn btn-secondary"
							onClick={() => setEditAvatar(true)}
						>
							Load new foto{' '}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-download"
								viewBox="0 0 16 16"
							>
								<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
								<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
							</svg>
						</button>
					)}
				</div>
				<table className="table table-hover">
					<tbody>
						<ProfileEdit user={user} />
					</tbody>
				</table>
			</div>
		</>
	);
}
