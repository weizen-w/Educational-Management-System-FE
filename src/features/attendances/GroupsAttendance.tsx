import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGroups } from './selectors';
import { loadGroups } from './groupsSlice';
import { useNavigate } from 'react-router-dom';
import { selectCourses } from '../courses/selectors';
import Course from '../courses/types/Course';
import { loadCourses } from '../courses/coursesSlice';

export default function GroupsAttendance(): JSX.Element {
	const navigate = useNavigate();
	const groups = useAppSelector(selectGroups);
	const dispatch = useAppDispatch();
	const courses = useAppSelector(selectCourses);

	const getCourse = (findId: number): Course | undefined => courses.find((c) => c.id === findId);

	useEffect(() => {
		dispatch(loadGroups());
		dispatch(loadCourses());
	}, [dispatch]);

	return (
		<>
			<h1>Groups Attendance</h1>
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Group name</th>
						<th scope="col">Course name</th>
						<th scope="col">In archive</th>
					</tr>
				</thead>
				<tbody>
					{groups?.map((group) => (
						<tr key={group.id}>
							<th scope="row">{group.id}</th>
							<td>{group.name}</td>
							<td>{getCourse(group.courseId)?.name}</td>
							<td>{group.archived.toString()}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
