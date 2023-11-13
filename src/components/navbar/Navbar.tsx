import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { selectAuthChecked, selectUser } from '../../features/auth/selectors';

function Navbar(): JSX.Element {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);
	const authChecked = useAppSelector(selectAuthChecked);

	const handleLogout = useCallback(
		async (event: React.MouseEvent) => {
			event.preventDefault();
			const dispatchResult = await dispatch(logout());
			if (logout.fulfilled.match(dispatchResult)) {
				navigate('/');
			}
		},
		[dispatch, navigate]
	);
	return (
		<nav>
			{!authChecked ? (
				<>
					<NavLink to="/auth/login">Sign in</NavLink>
					<NavLink to="/auth/register">Registration</NavLink>
				</>
			) : (
				<>
					{user?.role === 'ADMIN' && (
						<>
							<NavLink to="/account/profile">Personal information</NavLink>
							<NavLink to="/account/users">Users management</NavLink>
							<NavLink to="/account/courses">Courses management</NavLink>
							<NavLink to="/account/modules">Moduls management</NavLink>
							<NavLink to="/account/groups">Groups and Lessons management</NavLink>
							<NavLink to="/account/attendances">Attendances and Homeworks management</NavLink>
						</>
					)}

					{user?.role === 'TEACHER' && (
						<>
							<NavLink to="/account/profile">Personal information</NavLink>
							<NavLink to="/account/groups">My study groups</NavLink>
							<NavLink to="/account/lessons">Schedule, student attendances</NavLink>
						</>
					)}
					{user?.role === 'STUDENT' && (
						<>
							<NavLink to="/account/profile">Personal information</NavLink>
						</>
					)}
					<NavLink to="/" onClick={handleLogout}>
						Sign out
					</NavLink>
				</>
			)}
		</nav>
	);
}

export default Navbar;
