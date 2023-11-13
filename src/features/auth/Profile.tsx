import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getUser } from './authSlice';
import { selectUser } from './selectors';
import ProfileEdit from './ProfileEdit';
import { selectUserErrors } from '../users/selectors';

export default function Profile(): JSX.Element {
	const user = useAppSelector(selectUser);
	const error = useAppSelector(selectUserErrors);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	return (
		<>
			<h1>Profile</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">First name</th>
						<th scope="col">Last name</th>
						<th scope="col">Email: </th>
						<th scope="col">Photo link: </th>
					</tr>
				</thead>
				<tbody>
					<ProfileEdit user={user} />
				</tbody>
			</table>
		</>
	);
}
