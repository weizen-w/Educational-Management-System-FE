import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAttendanceError } from './selectors';
import Attendance from './types/Attendance';
import Lesson from '../lessons/types/Lesson';
import { selectLessons } from '../lessons/selectors';
import { loadLessons } from '../lessons/lessonsSlice';
import Group from '../groups/types/Group';
import { resetAttendanceError, updateAttendance } from './attendancesSlice';
import { AttendanceStatus } from './types/AttendanceStatus';

interface Props {
	attendance: Attendance;
	group: Group;
}

export default function AttendanceEdit(props: Props): JSX.Element {
	const { attendance, group } = props;
	const lessons = useAppSelector(selectLessons);
	const error = useAppSelector(selectAttendanceError);
	const dispatch = useAppDispatch();
	const [newAttendance, setNewAttendance] = useState<Attendance>({
		attendance_id: 0,
		student_id: attendance.student_id,
		lesson_id: attendance.lesson_id,
		attendanceDate: attendance.attendanceDate,
		status: attendance.status,
		archived: attendance.archived,
	});
	const [errorsObj, setErrorsObj] = useState({
		attendance_idError: '',
		student_idError: '',
		lesson_idError: '',
		attendanceDateError: '',
		statusError: '',
		archivedError: '',
	});

	const getLesson = (findId: number): Lesson | undefined =>
		lessons.find((lesson) => lesson.lessonId === findId);

	const handleEditClick = (newId: number): void => {
		setNewAttendance({ ...newAttendance, attendance_id: newId });
	};

	const handleCancel = (): void => {
		setNewAttendance({
			attendance_id: 0,
			student_id: attendance.student_id,
			lesson_id: attendance.lesson_id,
			attendanceDate: attendance.attendanceDate,
			status: attendance.status,
			archived: attendance.archived,
		});
		handleEditClick(0);
	};

	const handleSubmitUpdate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setErrorsObj({
				attendance_idError: '',
				student_idError: '',
				lesson_idError: '',
				attendanceDateError: '',
				statusError: '',
				archivedError: '',
			});

			// eslint-disable-next-line @typescript-eslint/naming-convention
			const { attendance_id, student_id, lesson_id, attendanceDate, status, archived } =
				newAttendance;
			if (attendance_id < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					attendance_idError: 'ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (student_id < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					student_idError: 'ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (lesson_id < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					lesson_idError: 'ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (!/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate)) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					attendanceDateError: 'The date does not reflect the format: 2020-12-31',
				}));
				hasError = true;
			}
			if (status !== 'PRESENT' && status !== 'ABSENT' && status !== 'PENDING') {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					statusError: 'Incorrect status',
				}));
				hasError = true;
			}
			if (typeof archived !== 'boolean') {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					archivedError: 'The archive field can only be a boolean',
				}));
				hasError = true;
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(
					updateAttendance({
						attendance_id: attendance.attendance_id,
						student_id: attendance.student_id,
						lesson_id: attendance.lesson_id,
						attendanceDate: attendance.attendanceDate,
						status: newAttendance.status,
						archived: attendance.archived,
					})
				);
				handleEditClick(0);
				setErrorsObj({
					attendance_idError: '',
					student_idError: '',
					lesson_idError: '',
					attendanceDateError: '',
					statusError: '',
					archivedError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, newAttendance]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		dispatch(resetAttendanceError());
		const { name: key, value } = e.target;
		setNewAttendance((prevNewAttendance) => ({
			...prevNewAttendance,
			[key]: value,
		}));
	};

	useEffect(() => {
		dispatch(loadLessons(group.id));
	}, [dispatch]);

	return (
		<>
			{newAttendance.attendance_id !== attendance.attendance_id ? (
				<tr>
					<th scope="row">{attendance.attendance_id}</th>
					<td>
						{getLesson(attendance.lesson_id)?.lessonType} /{' '}
						{getLesson(attendance.lesson_id)?.lessonTitle} /{' '}
						{getLesson(attendance.lesson_id)?.module.name}
					</td>
					<td>{getLesson(attendance.lesson_id)?.lessonDate}</td>
					<td>{attendance.status}</td>
					<td>{attendance.archived.toString()}</td>
					<td>
						<button
							type="button"
							className="btn btn-outline-dark"
							onClick={() => handleEditClick(attendance.attendance_id)}
						>
							Edit
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => {
								dispatch(
									updateAttendance({
										attendance_id: attendance.attendance_id,
										student_id: attendance.student_id,
										lesson_id: attendance.lesson_id,
										attendanceDate: attendance.attendanceDate,
										status: attendance.status,
										archived: !attendance.archived,
									})
								);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-archive"
								viewBox="0 0 16 16"
							>
								<path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
							</svg>
							Archiv
						</button>
					</td>
				</tr>
			) : (
				<tr>
					<td colSpan={3}>
						<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
							<div className="col-md-2">
								<select
									className={`form-select ${error ? 'is-invalid' : ''}`}
									name="status"
									value={newAttendance.status}
									onChange={handleInputChange}
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
								{errorsObj.statusError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.statusError}
									</div>
								)}
							</div>
							<div className="col-md-1">
								<button type="submit" className="btn btn-success">
									Save
								</button>
								<button className="btn btn-danger" onClick={handleCancel}>
									Cancel
								</button>
							</div>
						</form>
					</td>
				</tr>
			)}
		</>
	);
}
