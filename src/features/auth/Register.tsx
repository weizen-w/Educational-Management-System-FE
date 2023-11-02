import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, resetRegisterFormError, login } from './authSlice';
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
				setPasswordMismatchError('Пароли не совпадают');
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
				dispatch(login({ email, password }));
				navigate('/');
			}
		},
		[dispatch, email, navigate, password, passwordRepeat]
	);
	const handleNameChange = useCallback(
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

	const handleEmailChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setEmail(event.target.value);
			dispatch(resetRegisterFormError());
		},
		[dispatch]
	);

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<h2>Регистрация</h2>
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
				<label htmlFor="name-input" className="form-label">
					Имя
				</label>
				<input
					type="text"
					className={`form-control ${error ? 'is-invalid' : ''}`}
					id="name-input"
					name="username"
					value={firstName}
					onChange={handleFirstNameChange}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="lastName" className="form-label">
					Фамилия
				</label>
				<input
					type="text"
					className={`form-control ${error ? 'is-invalid' : ''}`}
					id="lastName"
					name="lastName"
					value={lastName}
					onChange={handleLastNameChange}
				/>
			</div>
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
					Пароль
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
					Повторите пароль
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

			<button type="submit" className="btn btn-primary">
				Зарегистрироваться
			</button>
		</form>
	);
}

export default Register;
