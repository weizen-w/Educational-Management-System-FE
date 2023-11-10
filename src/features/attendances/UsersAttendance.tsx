import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUserErrors, selectUsers } from '../users/selectors';
import User from '../auth/types/User';
import { useEffect, useState } from 'react';
import { loadUsersByMainGroup } from '../users/usersSlice';
import Group from '../groups/types/Group';
import { Link, useLocation } from 'react-router-dom';

export default function UsersAttendance(): JSX.Element {
	const location = useLocation();
	const state: { group: Group } = location.state;
	const group: Group = state.group;
	const error = useAppSelector(selectUserErrors);
	const users = useAppSelector<User[]>(selectUsers);
	const dispatch = useAppDispatch();
	const [selectedRole, setSelectedRole] = useState<string | 'All'>('STUDENT');

	const filteredUsers = users.filter((user) => {
		if (selectedRole === 'All') {
			return true;
		} else {
			return user.role === selectedRole;
		}
	});

	useEffect(() => {
		dispatch(loadUsersByMainGroup(group.id));
	}, [dispatch]);

	return (
		<div>
			<h1>Students&Teacher</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<select title="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
				<option value="All">All</option>
				<option value="STUDENT">Student</option>
				<option value="TEACHER">Teacher</option>
			</select>

			<table className="table table-hover align-middle">
				<thead>
					<tr>
						<th scope="col">First name</th>
						<th scope="col">Last name</th>
						<th scope="col">Email</th>
						<th scope="col">Role</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredUsers
						.sort((a, b) => a.id - b.id)
						.map((user) => (
							<tr key={user.id}>
								<td>{user.firstName}</td>
								<td>{user.lastName}</td>
								<td>{user.email}</td>
								<td>{user.role}</td>
								<td>
									<button type="button" className="btn btn-outline-primary">
										<Link
											to={'/account/attendances/students-group/attendances-student'}
											state={{ user, group }}
										>
											Attendances
										</Link>
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
