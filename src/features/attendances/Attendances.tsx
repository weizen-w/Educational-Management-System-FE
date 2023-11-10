import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAttendanceError, selectAttendances } from './selectors';
import { loadAttendancesByUser } from './attendancesSlice';
import { useLocation } from 'react-router-dom';
import User from '../auth/types/User';
import Group from '../groups/types/Group';
import AttendanceEdit from './AttendanceEdit';

export default function Attendances(): JSX.Element {
	const location = useLocation();
	const state: { user: User; group: Group } = location.state;
	const { user, group } = state;
	const attendances = useAppSelector(selectAttendances);
	const error = useAppSelector(selectAttendanceError);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(loadAttendancesByUser(user.id));
	}, [dispatch]);

	return (
		<>
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
						<th scope="col">Lesson</th>
						<th scope="col">Date</th>
						<th scope="col">Status</th>
						<th scope="col">In archive</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{attendances
						.toSorted((a, b) => {
							if (a.attendanceDate < b.attendanceDate) {
								return -1;
							}
							if (a.attendanceDate > b.attendanceDate) {
								return 1;
							}
							return 0;
						})
						.map((attendance) => (
							<AttendanceEdit
								key={attendance.attendance_id}
								attendance={attendance}
								group={group}
							/>
						))}
				</tbody>
			</table>
		</>
	);
}
