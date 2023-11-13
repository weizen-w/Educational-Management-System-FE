import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadUsersByMainGroup } from './usersSlice';
import { selectUserErrors, selectUsers } from './selectors';
import User from '../auth/types/User';
import { useLocation } from 'react-router-dom';
import Group from '../groups/types/Group';

export default function UsersByMainGroup(): JSX.Element {
	const location = useLocation();
	const state: { group: Group } = location.state;
	const group: Group = state.group;
	const error = useAppSelector(selectUserErrors);
	const users = useAppSelector<User[]>(selectUsers);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(loadUsersByMainGroup(group.id));
	}, [dispatch]);

	return (
		<div>
			<h1>Students</h1>
			<h4 style={{ textDecoration: 'underline' }}>for group {group.name}</h4>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<table className="table table-hover align-middle">
				<thead>
					<tr>
						<th scope="col">First name</th>
						<th scope="col">Last name</th>
						<th scope="col">Email</th>
						<th scope="col">Role</th>
						<th scope="col">Photo</th>
					</tr>
				</thead>
				<tbody>
					{users
						.toSorted((a, b) => a.lastName.localeCompare(b.lastName))
						.map((user) => (
							<tr key={user.id}>
								<td>{user.firstName}</td>
								<td>{user.lastName}</td>
								<td>{user.email}</td>
								<td>{user.role}</td>
								<td>{user.photoLink}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
