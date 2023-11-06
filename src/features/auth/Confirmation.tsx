import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { corfirmEmail } from './authSlice';
import { useSelector } from 'react-redux';
import { selectUser } from './selectors';

export default function Confirmation(): JSX.Element {
	const dispatch = useAppDispatch();
	const { confirmCode } = useParams<{ confirmCode: string }>();
	const [status, setStatus] = useState<string>('');
	const user = useSelector(selectUser);

	useEffect(() => {
		const checkStatus = async (): Promise<void> => {
			if (confirmCode) {
				const dispatchResult = await dispatch(corfirmEmail(confirmCode));
				if (corfirmEmail.fulfilled.match(dispatchResult)) {
					setStatus('CONFIRMED');
				}
				if (corfirmEmail.rejected.match(dispatchResult)) {
					setStatus('ERROR');
				}
			}
		};
		checkStatus();
	}, [dispatch]);

	return (
		<>
			<h1>Confirmation</h1>
			<div>
				{user?.firstName} {user?.lastName}
			</div>
			<div>EMAIL: {user?.email}</div>
			<div>STATUS: {status}</div>
			<NavLink className="btn btn-primary" to="/auth/login">
				Sign in
			</NavLink>
		</>
	);
}
