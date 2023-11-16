import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUserErrors, selectUsers } from '../users/selectors';
import User from '../auth/types/User';
import { useEffect, useState } from 'react';
import { loadUsersByMainGroup } from '../users/usersSlice';
import Group from '../groups/types/Group';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UsersAttendance(): JSX.Element {
	const location = useLocation();
	const state: { group: Group } = location.state;
	const group: Group = state.group;
	const error = useAppSelector(selectUserErrors);
	const users = useAppSelector<User[]>(selectUsers);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
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
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a style={{ cursor: 'pointer' }} onClick={() => navigate('/account/attendances')}>
							Groups
						</a>
					</li>
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => navigate('/account/attendances/students-group', { state: { group } })}
						>
							Students
						</a>
					</li>
				</ol>
			</nav>
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
								<td className="col-md-3 row g-1">
									<button
										type="button"
										className="btn btn-outline-success"
										onClick={() =>
											navigate('/account/attendances/students-group/attendances-student', {
												state: { user, group },
											})
										}
									>
										To attendances
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-arrow-right-short"
											viewBox="0 0 16 16"
										>
											<path
												fillRule="evenodd"
												d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
											/>
										</svg>
									</button>
									<button
										type="button"
										className="btn btn-outline-success"
										onClick={() =>
											navigate('/account/attendances/students-group/submissions-student', {
												state: { user, group },
											})
										}
									>
										To homeworks
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-arrow-right-short"
											viewBox="0 0 16 16"
										>
											<path
												fillRule="evenodd"
												d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
											/>
										</svg>
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
