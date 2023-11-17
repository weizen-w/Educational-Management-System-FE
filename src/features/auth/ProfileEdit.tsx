import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import User from '../auth/types/User';
import { resetUserError } from '../users/usersSlice';
import { selectUserErrors } from '../users/selectors';
import { updateProfile } from './authSlice';

interface Props {
	user: User | undefined;
}
export default function ProfileEdit(props: Props): JSX.Element {
	const { user } = props;
	const error = useAppSelector(selectUserErrors);
	const dispatch = useAppDispatch();
	const [newUser, setNewUser] = useState({
		id: 0,
		firstName: user?.firstName,
		lastName: user?.lastName,
		email: user?.email,
	});
	const [password, setPassword] = useState<string | undefined>(undefined);
	const [errorsObj, setErrorsObj] = useState({
		idError: '',
		firstNameError: '',
		lastNameError: '',
		emailError: '',
		passwordError: '',
	});

	const handleEditClick = (newId: number): void => {
		setNewUser({ ...newUser, id: newId });
	};

	const handleCancel = (): void => {
		setNewUser({
			id: 0,
			firstName: '',
			lastName: '',
			email: '',
		});
		setPassword(undefined);
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
			});

			const { id, firstName, lastName, email } = newUser;
			if (id && id < 1) {
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
			if (hasError) {
				return;
			}
			if (password) {
				if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/.test(password)) {
					setErrorsObj((prevErrorsObj) => ({
						...prevErrorsObj,
						passwordError:
							'The password must contain at least 8 characters, including one number, one uppercase and one lowercase letter.',
					}));
					hasError = true;
				}
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(
					updateProfile({
						id: user?.id || 0,
						firstName: newUser.firstName,
						lastName: newUser.lastName,
						email: newUser.email,
						password,
						role: undefined,
						state: undefined,
						photoLink: undefined,
					})
				);
				handleEditClick(0);
				setErrorsObj({
					idError: '',
					firstNameError: '',
					lastNameError: '',
					emailError: '',
					passwordError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, newUser, password]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		dispatch(resetUserError());
		const { name: key, value } = e.target;
		if (key === 'password') {
			setPassword(value);
		} else {
			setNewUser((prevNewUser) => ({
				...prevNewUser,
				[key]: value,
			}));
		}
	};
	return (
		<>
			{newUser.id !== user?.id ? (
				<>
					<tr>
						<td colSpan={3}>
							<button
								type="button"
								className="btn btn-outline-dark"
								onClick={() => handleEditClick(user?.id || 0)}
							>
								Edit data
							</button>
						</td>
					</tr>
					<tr>
						<th className="col-md-1">Name</th>
						<td>
							{user?.firstName} {user?.lastName}
						</td>
					</tr>
					<tr>
						<th className="col-md-1">Email</th>
						<td>{user?.email}</td>
					</tr>
				</>
			) : (
				<>
					<tr>
						<td>
							<form
								className="auth-form row g-1"
								onSubmit={handleSubmit}
								style={{ display: 'flex', flexDirection: 'column' }}
							>
								<div className="col-md-3">
									<label htmlFor="">First name</label>
									<input
										type="text"
										className={`form-control ${error ? 'is-invalid' : ''}`}
										name="firstName"
										value={newUser.firstName}
										placeholder={user?.firstName}
										onChange={handleInputChange}
									/>
									{errorsObj.firstNameError && (
										<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
											{errorsObj.firstNameError}
										</div>
									)}
									<label htmlFor="">Last name</label>
									<input
										type="text"
										className={`form-control ${error ? 'is-invalid' : ''}`}
										name="lastName"
										value={newUser.lastName}
										placeholder={user?.lastName}
										onChange={handleInputChange}
									/>
									{errorsObj.lastNameError && (
										<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
											{errorsObj.lastNameError}
										</div>
									)}
								</div>
								<div className="col-md-3">
									<label htmlFor="">Email</label>
									<input
										type="text"
										className={`form-control ${error ? 'is-invalid' : ''}`}
										name="email"
										value={newUser.email}
										placeholder={user?.email}
										onChange={handleInputChange}
									/>
									{errorsObj.emailError && (
										<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
											{errorsObj.emailError}
										</div>
									)}
								</div>
								<div className="col-md-3">
									<label htmlFor="">Password</label>
									<input
										type="text"
										className={`form-control ${error ? 'is-invalid' : ''}`}
										name="password"
										value={password}
										placeholder={'input new password'}
										onChange={handleInputChange}
									/>
									{errorsObj.passwordError && (
										<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
											{errorsObj.passwordError}
										</div>
									)}
								</div>
								<div>
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
				</>
			)}
		</>
	);
}
