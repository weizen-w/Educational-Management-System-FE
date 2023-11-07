import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { selectUsers } from './selectors';
import { loadUsers } from './usersSlice';
import User from './types/User';
import UserEditForm from './UserEditForm';

export default function UsersList(): JSX.Element {
	const users = useAppSelector<User[]>(selectUsers);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(loadUsers());
	}, [dispatch]);

	return (
		<div>
			<h1>Список Пользователей</h1>
			<ul>
				{users?.map((user: User) => (
					<li key={user.id}>
						{user.firstName}
						<UserEditForm user={user} />
					</li>
				))}
			</ul>
		</div>
	);
}
