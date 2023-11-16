import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadUsers } from './usersSlice';
import UserEdit from './UserEdit';
import { selectUserErrors, selectUsers } from './selectors';
import User from '../auth/types/User';

export default function UsersList(): JSX.Element {
	const error = useAppSelector(selectUserErrors);
	const users = useAppSelector<User[]>(selectUsers);
	const dispatch = useAppDispatch();
	const [selectedRole, setSelectedRole] = useState<string | 'All'>('All'); // Добавлено состояние для выбора роли

	useEffect(() => {
		dispatch(loadUsers());
	}, [dispatch]);

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
			<h1>Accounts</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<select title="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
				<option value="All">All</option>
				<option value="STUDENT">Student</option>
				<option value="TEACHER">Teacher</option>
				<option value="ADMIN">Admin</option>
			</select>

			<table className="table table-hover align-middle">
				<thead>
					<tr>
						<th scope="col">First name</th>
						<th scope="col">Last name</th>
						<th scope="col">Email</th>
						<th scope="col">Role</th>
						<th scope="col">State</th>
						<th scope="col">Photo</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredUsers
						.sort((a, b) => a.id - b.id)
						.map((user) => (
							<UserEdit key={user.id} user={user} />
						))}
				</tbody>
			</table>
		</div>
	);
}
