import { selectUsers } from './selectors';
import { loadUsers, updateUser } from './usersSlice';
import { RootState } from '../../app/store';
import User from './types/User';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export default function UsersList(): JSX.Element {
	const users = useAppSelector<User[]>(selectUsers);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(loadUsers());
	}, [dispatch]);
	const handleUpdate = (id: number): void => {
		dispatch(updateUser(id));
	};
	return (
		<div>
			<h1>Список Пользователей</h1>
			<ul>
				{users.map((user: User) => (
					<li key={user.id}>
						{user.lastName}
						<button type="button" onClick={() => handleUpdate(user.id)}>
							Редактировать
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
