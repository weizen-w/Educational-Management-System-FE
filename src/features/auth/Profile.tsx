import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getUser } from './authSlice';
import { selectUser } from './selectors';

export default function Profile(): JSX.Element {
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	return (
		<>
			<div>Profile</div>
			<div>
				<p>First name: {user?.firstName}</p>
				<p>Last name: {user?.lastName}</p>
				<p>Email: {user?.email}</p>
				<p>Password: {user?.password}</p>
				<p>Role: {user?.role}</p>
				<p>State: {user?.state}</p>
				<p>Photo link: {user?.photoLink}</p>
			</div>
		</>
	);
}
