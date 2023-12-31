import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetUserError, updateUser } from './usersSlice';
import User from '../auth/types/User';
import { selectUserErrors } from './selectors';

interface Props {
	user: User;
}
export default function UserEdit(props: Props): JSX.Element {
	const { user } = props;
	const error = useAppSelector(selectUserErrors);
	const dispatch = useAppDispatch();
	const [newUser, setNewUser] = useState<User>({
		id: 0,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		password: user.password,
		role: user.role,
		state: user.state,
		photoLink: user.photoLink,
	});
	const [errorsObj, setErrorsObj] = useState({
		idError: '',
		firstNameError: '',
		lastNameError: '',
		emailError: '',
		passwordError: '',
		roleError: '',
		stateError: '',
		photoLinkError: '',
	});

	const handleEditClick = (newId: number): void => {
		setNewUser({ ...newUser, id: newId });
	};

	const handleCancel = (): void => {
		setNewUser({
			id: 0,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			password: user.password,
			role: user.role,
			state: user.state,
			photoLink: user.photoLink,
		});
		handleEditClick(0);
	};

	const handleSubmit = useCallback(
		async (event: React.FormEvent) => {
			event.preventDefault();

			let hasError = false;
			setErrorsObj({
				idError: '',
				firstNameError: '',
				lastNameError: '',
				emailError: '',
				passwordError: '',
				roleError: '',
				stateError: '',
				photoLinkError: '',
			});

			const { id, firstName, lastName, email, role, state } = newUser;
			if (id < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					idError: 'ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (firstName && !firstName.trim()) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					firstNameError: 'The first name cannot be empty or only spaces',
				}));
				hasError = true;
			}
			if (firstName && firstName.length > 50) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					firstNameError: 'The first name cannot be more than 50 characters',
				}));
				hasError = true;
			}
			if (lastName && !lastName.trim()) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					lastNameError: 'The last name cannot be empty or only spaces',
				}));
				hasError = true;
			}
			if (lastName && lastName.length > 50) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					lastNameError: 'The last name cannot be more than 50 characters',
				}));
				hasError = true;
			}
			if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					emailError: 'The email does not reflect the format: email@email.com',
				}));
				hasError = true;
			}
			if (role !== 'ADMIN' && role !== 'TEACHER' && role !== 'STUDENT') {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					roleError: 'Incorrect role',
				}));
				hasError = true;
			}
			if (
				state !== 'NOT_CONFIRMED' &&
				state !== 'CONFIRMED' &&
				state !== 'DELETED' &&
				state !== 'BANNED'
			) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					stateError: 'Incorrect state',
				}));
				hasError = true;
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(
					updateUser({
						id: user.id,
						firstName: newUser.firstName,
						lastName: newUser.lastName,
						email: newUser.email,
						password: newUser.password,
						role: newUser.role,
						state: newUser.state,
						photoLink: newUser.photoLink,
					})
				);
				handleEditClick(0);
				setErrorsObj({
					idError: '',
					firstNameError: '',
					lastNameError: '',
					emailError: '',
					passwordError: '',
					roleError: '',
					stateError: '',
					photoLinkError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, newUser]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		dispatch(resetUserError());
		const { name: key, value } = e.target;
		setNewUser((prevNewUser) => ({
			...prevNewUser,
			[key]: value,
		}));
	};

	return (
		<>
			{newUser.id !== user.id ? (
				<tr>
					<td>{user.firstName}</td>
					<td>{user.lastName}</td>
					<td>{user.email}</td>
					<td>{user.role}</td>
					<td>{user.state}</td>
					<td>{user.photoLink}</td>
					<td className="row" style={{ gap: '3px' }}>
						<button
							type="button"
							className="btn btn-outline-dark"
							onClick={() => handleEditClick(user.id)}
						>
							Edit
						</button>
					</td>
				</tr>
			) : (
				<tr>
					<td colSpan={12}>
						<form className="auth-form row g-1" onSubmit={handleSubmit}>
							<div className="col-md-2">
								<label htmlFor="">First name</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="firstName"
									value={newUser.firstName}
									placeholder={user.firstName}
									onChange={handleInputChange}
								/>
								{errorsObj.firstNameError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.firstNameError}
									</div>
								)}
							</div>
							<div className="col-md-2">
								<label htmlFor="">Last name</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="lastName"
									value={newUser.lastName}
									placeholder={user.lastName}
									onChange={handleInputChange}
								/>
								{errorsObj.lastNameError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.lastNameError}
									</div>
								)}
							</div>
							<div className="col-md-2">
								<label htmlFor="">Email</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="email"
									value={newUser.email}
									placeholder={user.email}
									onChange={handleInputChange}
								/>
								{errorsObj.emailError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.emailError}
									</div>
								)}
							</div>
							<div className="col-md-2">
								<label htmlFor="">Role</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="role"
									value={newUser.role}
									placeholder={user.role}
									onChange={handleInputChange}
								/>
								{errorsObj.roleError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.roleError}
									</div>
								)}
							</div>
							<div className="col-md-2">
								<label htmlFor="">Photo link</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="photoLink"
									value={newUser.photoLink || ''}
									placeholder={user.photoLink}
									onChange={handleInputChange}
								/>
								{errorsObj.photoLinkError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.photoLinkError}
									</div>
								)}
							</div>
							<div className="col-md-2 row g-1">
								<button type="submit" className="btn btn-success">
									Save
								</button>
								<button className="btn btn-danger" onClick={handleCancel}>
									Cancel
								</button>
							</div>
						</form>
					</td>
				</tr>
			)}
		</>
	);
}
