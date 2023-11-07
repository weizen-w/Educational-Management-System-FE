import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadUsers, updateUser } from './usersSlice';
import User from './types/User';
import UserEditForm from './UserEditForm';
import { selectUsers } from './selectors';

export default function UsersList(): JSX.Element {
	const users = useAppSelector<User[]>(selectUsers);
	const dispatch = useAppDispatch();
	const [selectedRole, setSelectedRole] = useState<string | 'All'>('All'); // Добавлено состояние для выбора роли

	useEffect(() => {
		dispatch(loadUsers());
	}, [dispatch]);

	const handleUpdate = (user: User): void => {
		dispatch(updateUser(user));
	};

	// Метод для фильтрации пользователей по роли
	const filteredUsers = users.filter((user) => {
		if (selectedRole === 'All') {
			return true;
		} else {
			return user.role === selectedRole;
		}
	});

	return (
		<div>
			<h1>Список Пользователей</h1>
			{/* Выпадающий список для фильтрации */}
			<select title="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
				<option value="All">All</option>
				<option value="STUDENT">Student</option>
				<option value="TEACHER">Teacher</option>
				<option value="ADMIN">Admin</option>
			</select>
			<ul>
				{filteredUsers.map((user: User) => (
					<li key={user.id}>
						{user.firstName}
						<UserEditForm user={user} />
						<button type="button" onClick={() => handleUpdate(user)}>
							Редактировать
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
