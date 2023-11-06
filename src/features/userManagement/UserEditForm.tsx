import React, { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { updateUser } from './usersSlice';
import User from './types/User';

interface Props {
	user: User;
}
export default function UserEditForm(props: Props): JSX.Element {
	const { user } = props;
	const [firstName, setFirstName] = useState(user.firstName);
	const [password, setPassword] = useState(user.password);
	const [lastName, setLastName] = useState(user.lastName);
	const [email, setEmail] = useState(user.email);
	const [role, setRole] = useState(user.role);
	const [state, setState] = useState(user.state);
	const [photoLink, setPhotoLink] = useState(user.photoLink);
	const dispatch = useAppDispatch();
	const handleSubmit = useCallback(
		(event: React.FormEvent) => {
			event.preventDefault();

			dispatch(
				updateUser({
					email,
					password,
					firstName,
					lastName,
					role,
					photoLink,
					state,
					id: user.id,
				})
			);
		},
		[dispatch, email, password, firstName, lastName]
	);

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="First Name"
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
			/>

			<input
				type="text"
				placeholder="Last Name"
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
			/>

			<input
				type="text"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				type="text"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<input
				type="text"
				placeholder="Role"
				value={role}
				onChange={(e) => setRole(e.target.value)}
			/>

			<input
				type="text"
				placeholder="State"
				value={state}
				onChange={(e) => setState(e.target.value)}
			/>

			<input
				type="text"
				placeholder="Photo Link"
				value={photoLink}
				onChange={(e) => setPhotoLink(e.target.value)}
			/>

			<button type="submit">Edit</button>
		</form>
	);
}
