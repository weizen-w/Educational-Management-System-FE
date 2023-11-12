import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAttendanceError, selectAttendances } from './selectors';
import { loadAttendancesByUser } from './attendancesSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import User from '../auth/types/User';
import Group from '../groups/types/Group';
import AttendanceEdit from './AttendanceEdit';
import Attendance from './types/Attendance';
import Lesson from '../lessons/types/Lesson';
import { selectLessons } from '../lessons/selectors';

export default function Attendances(): JSX.Element {
	const location = useLocation();
	const state: { user: User; group: Group } = location.state;
	const { user, group } = state;
	const attendances: Attendance[] = useAppSelector(selectAttendances);
	const lessons: Lesson[] = useAppSelector(selectLessons);
	const error = useAppSelector(selectAttendanceError);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const getLesson = (findId: number): Lesson | undefined =>
		lessons.find((lesson) => lesson.lessonId === findId);

	const sortedAttendances = attendances.toSorted((a, b) => {
		const dateA = getLesson(a.lesson_id)?.lessonDate;
		const dateB = getLesson(b.lesson_id)?.lessonDate;

		if (!dateA || !dateB) {
			return 0;
		}
		return new Date(dateA).getTime() - new Date(dateB).getTime();
	});

	useEffect(() => {
		dispatch(loadAttendancesByUser(user.id));
	}, [dispatch]);

	return (
		<>
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
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() =>
								navigate('/account/attendances/students-group/attendances-student', {
									state: { user, group },
								})
							}
						>
							Attendances
						</a>
					</li>
				</ol>
			</nav>
			<h1>Attendances</h1>
			<h4 style={{ textDecoration: 'underline' }}>
				for {user.firstName} {user.lastName}
			</h4>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Date</th>
						<th scope="col">Lesson</th>
						<th scope="col">Status</th>
						<th scope="col">In archive</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{sortedAttendances.map((attendance) => (
						<AttendanceEdit key={attendance.attendance_id} attendance={attendance} group={group} />
					))}
				</tbody>
			</table>
		</>
	);
}
