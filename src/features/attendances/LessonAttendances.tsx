import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAttendanceError, selectAttendances } from './selectors';
import { loadAttendancesByLesson, updateAttendance } from './attendancesSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Attendance from './types/Attendance';
import Lesson from '../lessons/types/Lesson';
import User from '../auth/types/User';
import { selectUsers } from '../users/selectors';
import { loadUsersByMainGroup } from '../users/usersSlice';
import { AttendanceStatus } from './types/AttendanceStatus';

export default function LessonAttendances(): JSX.Element {
	const location = useLocation();
	const state: { lesson: Lesson } = location.state;
	const { lesson } = state;
	const attendances: Attendance[] = useAppSelector(selectAttendances);
	const users: User[] = useAppSelector(selectUsers);
	const error = useAppSelector(selectAttendanceError);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const getUser = (findId: number): User | undefined => users.find((user) => user.id === findId);

	const sortedAttendances = attendances.toSorted((a, b) => {
		const userLastNameA = getUser(a.student_id)?.lastName;
		const userLastNameB = getUser(b.student_id)?.lastName;

		if (!userLastNameA || !userLastNameB) {
			return 0;
		}
		return userLastNameA.localeCompare(userLastNameB);
	});

	const handleChangeStatus = (
		currAttendance: Attendance,
		event: React.ChangeEvent<HTMLSelectElement>
	): void => {
		dispatch(
			updateAttendance({
				...currAttendance,
				status: event.target.value,
			})
		);
	};

	useEffect(() => {
		dispatch(loadAttendancesByLesson(lesson.lessonId));
		dispatch(loadUsersByMainGroup(lesson.group.id));
	}, [dispatch]);

	return (
		<>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href="#/account/lessons">Lessons</a>
					</li>
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => navigate('/account/lessons/attendances', { state: { lesson } })}
						>
							Attendances
						</a>
					</li>
				</ol>
			</nav>
			<h1>Attendances</h1>
			<h4 style={{ textDecoration: 'underline' }}>
				for {lesson.lessonType} / {lesson.lessonDate} / {lesson.lessonTitle}
			</h4>
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
						<th scope="col">Status</th>
					</tr>
				</thead>
				<tbody>
					{sortedAttendances.map((attendance) => (
						<tr key={attendance.attendance_id}>
							<td className="col-md-2">{getUser(attendance.student_id)?.firstName}</td>
							<td className="col-md-2">{getUser(attendance.student_id)?.lastName}</td>
							<td>
								<select
									style={{ maxWidth: '150px' }}
									className="form-select form-select-sm"
									name="submission_state"
									value={attendance.status}
									onChange={(e) => handleChangeStatus(attendance, e)}
								>
									<option value="" disabled hidden>
										Select status...
									</option>
									{Object.keys(AttendanceStatus).map((key) => (
										<option
											key={key}
											value={AttendanceStatus[key as keyof typeof AttendanceStatus]}
										>
											{AttendanceStatus[key as keyof typeof AttendanceStatus]}
										</option>
									))}
								</select>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
