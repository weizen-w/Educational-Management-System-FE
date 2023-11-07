import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { selectAuthChecked, selectUser } from './features/auth/selectors';
import Layout from './components/layouts/Layout';
import UsersList from './features/userManagement/UsersList';
import Courses from './features/courses/Courses';
import Profile from './features/auth/Profile';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import { useEffect } from 'react';
import { getUser } from './features/auth/authSlice';
import Confirmation from './features/auth/Confirmation';
import CourseCreate from './features/courses/CourseCreate';
import Groups from './features/groups/Groups';
import GroupCreate from './features/groups/GroupCreate';

function App(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const authChecked = useAppSelector(selectAuthChecked);
	const roleUser = user?.role;

	useEffect(() => {
		dispatch(getUser());
	}, []);

	return (
		<HashRouter>
			<Routes>
				{!authChecked && (
					<Route path="/" element={<Layout />}>
						<Route path="/auth/login" element={<Login />} />
						<Route path="/auth/register" element={<Register />} />
						<Route path="/confirm/:confirmCode" element={<Confirmation />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				)}
				{roleUser === 'ADMIN' ? (
					<Route path="/" element={<Layout />}>
						<Route path="/account/profile" element={<Profile />} />
						<Route path="/account/users" element={<UsersList />} />
						<Route path="/account/courses" element={<Courses />} />
						<Route path="/account/courses/add" element={<CourseCreate />} />
						<Route path="/account/groups" element={<Groups />} />
						<Route path="/account/groups/add" element={<GroupCreate />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				) : roleUser === 'TEACHER' ? (
					<Route path="/" element={<Layout />}>
						<Route path="/account/profile" element={<Profile />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				) : roleUser === 'STUDENT' ? (
					<Route path="/" element={<Layout />}>
						<Route path="/account/profile" element={<Profile />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				) : (
					<Route path="/" element={<Layout />}>
						<Route path="/auth/login" element={<Login />} />
						<Route path="/auth/register" element={<Register />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				)}
			</Routes>
		</HashRouter>
	);
}

export default App;
