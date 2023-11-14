import './App.css';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { selectAuthChecked, selectUser } from './features/auth/selectors';
import Layout from './components/layouts/Layout';
import UsersList from './features/users/Users';
import Courses from './features/courses/Courses';
import Profile from './features/auth/Profile';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import { useEffect } from 'react';
import { getUser } from './features/auth/authSlice';
import Confirmation from './features/auth/Confirmation';
import CourseCreate from './features/courses/CourseCreate';
import Groups from './features/groups/Groups';
import GroupCreate from './features/groups/GroupCreate';
import Modules from './features/modules/Modules';
import ModuleCreate from './features/modules/ModuleCreate';
import Lessons from './features/lessons/Lessons';
import LessonCreate from './features/lessons/LessonCreate';
import GroupsAttendance from './features/attendances/GroupsAttendance';
import UsersAttendance from './features/attendances/UsersAttendance';
import Attendances from './features/attendances/Attendances';
import Submissions from './features/submissions/Submissions';
import Submission from './features/submissions/SubmissionDetails';
import GroupsTeacher from './features/groups/GroupsTeacher';
import UsersByMainGroup from './features/users/UsersByMainGroup';
import LessonsTeacher from './features/lessons/LessonsTeacher';
import LessonAttendances from './features/attendances/LessonAttendances';
import SubmissionsTeacher from './features/submissions/SubmissionsTeacher';
import SubmissionDetailsTeacher from './features/submissions/SubmissionsDetailsTeacher';

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
						<Route path="/account/profile/users" element={<UsersList />} />
						<Route path="/account/courses" element={<Courses />} />
						<Route path="/account/courses/add" element={<CourseCreate />} />
						<Route path="/account/modules" element={<Modules />} />
						<Route path="/account/modules/add" element={<ModuleCreate />} />
						<Route path="/account/groups" element={<Groups />} />
						<Route path="/account/groups/add" element={<GroupCreate />} />
						<Route path="/account/groups/lessons" element={<Lessons />} />
						<Route path="/account/groups/lessons/add" element={<LessonCreate />} />
						<Route path="/account/attendances" element={<GroupsAttendance />} />
						<Route path="/account/attendances/students-group" element={<UsersAttendance />} />
						<Route
							path="/account/attendances/students-group/attendances-student"
							element={<Attendances />}
						/>
						<Route
							path="/account/attendances/students-group/submissions-student"
							element={<Submissions />}
						/>
						<Route
							path="/account/attendances/students-group/submissions-student/submission-details"
							element={<Submission />}
						/>
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				) : roleUser === 'TEACHER' ? (
					<Route path="/" element={<Layout />}>
						<Route path="/account/profile" element={<Profile />} />
						<Route path="/account/groups" element={<GroupsTeacher />} />
						<Route path="/account/groups/students" element={<UsersByMainGroup />} />
						<Route path="/account/lessons" element={<LessonsTeacher />} />
						<Route path="/account/lessons/attendances" element={<LessonAttendances />} />
						<Route path="/account/lessons/submissions" element={<SubmissionsTeacher />} />
						<Route
							path="/account/lessons/submissions/submission-details"
							element={<SubmissionDetailsTeacher />}
						/>
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
