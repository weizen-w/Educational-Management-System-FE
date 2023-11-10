import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourses } from '../courses/selectors';
import Course from '../courses/types/Course';
import { loadCourses } from '../courses/coursesSlice';
import { Link, useNavigate } from 'react-router-dom';
import { loadGroups } from '../groups/groupsSlice';
import { selectGroups } from '../groups/selectors';

export default function GroupsAttendance(): JSX.Element {
	const groups = useAppSelector(selectGroups);
	const courses = useAppSelector(selectCourses);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

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
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{groups
						.slice()
						.sort((a, b) => {
							if (a.name < b.name) {
								return -1;
							}
							if (a.name > b.name) {
								return 1;
							}
							return 0;
						})
						.map((group) => (
							<tr key={group.id}>
								<th scope="row">{group.id}</th>
								<td>{group.name}</td>
								<td>{getCourse(group.courseId)?.name}</td>
								<td>
									<button type="button" className="btn btn-outline-primary">
										<Link to={'/account/attendances/students-group'} state={{ group }}>
											Students
										</Link>
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</>
	);
}
