import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, resetRegisterFormError } from './authSlice';
import { selectRegisterFormError } from './selectors';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

function Register(): JSX.Element {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const error = useAppSelector(selectRegisterFormError);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [passwordMismatchError, setPasswordMismatchError] = useState(''); // Локальное состояние для ошибки
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	const handleSubmit = useCallback(
		async (event: React.FormEvent) => {
			event.preventDefault();
			if (password !== passwordRepeat) {
				// Если пароли не совпадают, показать ошибку
				setPasswordMismatchError('Password mismatch');
				return;
			} else {
				setPasswordMismatchError(''); // Сбросить ошибку, если пароли совпадают
			}

			const dispatchResult = await dispatch(
				register({
					email,
					password,
					firstName,
					lastName,
				})
			);
			if (register.fulfilled.match(dispatchResult)) {
				navigate('/auth/login'); // TODO
			}
		},
		[dispatch, email, navigate, password, firstName, lastName]
	);

	const handleEmailChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setEmail(event.target.value);
			dispatch(resetRegisterFormError());
		},
		[dispatch]
	);

	const handlePasswordChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setPassword(event.target.value);
			dispatch(resetRegisterFormError());
		},
		[dispatch]
	);

	const handleFirstNameChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setFirstName(event.target.value);
			dispatch(resetRegisterFormError());
		},
		[dispatch]
	);

	const handleLastNameChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setLastName(event.target.value);
			dispatch(resetRegisterFormError());
		},
		[dispatch]
	);

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<h2>Registration</h2>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			{passwordMismatchError && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{passwordMismatchError}
				</div>
			)}

			<div className="mb-3">
				<label htmlFor="email" className="form-label">
					email
				</label>
				<input
					type="text"
					className={`form-control ${error ? 'is-invalid' : ''}`}
					id="email"
					name="email"
					value={email}
					onChange={handleEmailChange}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="password-input" className="form-label">
					Password
				</label>
				<input
					type="password"
					className={`form-control ${error ? 'is-invalid' : ''}`}
					id="password-input"
					name="password"
					value={password}
					onChange={handlePasswordChange}
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="password-repeat-input" className="form-label">
					Repeat the password
				</label>
				<input
					type="password"
					className={`form-control ${error ? 'is-invalid' : ''}`}
					id="password-repeat-input"
					name="passwordRepeat"
					value={passwordRepeat}
					onChange={(e) => setPasswordRepeat(e.target.value)} // Обновление состояния повторного ввода пароля
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="first-name-input" className="form-label">
					Enter your name
				</label>
				<input
					type="text"
					className={`form-control ${error ? 'is-invalid' : ''}`}
					id="first-name-input"
					name="firstName"
					value={firstName}
					onChange={handleFirstNameChange}
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="last-name-input" className="form-label">
					Enter your surname
				</label>
				<input
					type="text"
					className={`form-control ${error ? 'is-invalid' : ''}`}
					id="last-name-input"
					name="lastName"
					value={lastName}
					onChange={handleLastNameChange}
				/>
			</div>
			<button type="submit" className="btn btn-primary">
				Sign up
			</button>
		</form>
	);
}

export default Register;
