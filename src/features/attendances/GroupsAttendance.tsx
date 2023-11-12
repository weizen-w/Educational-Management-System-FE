import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourses } from '../courses/selectors';
import Course from '../courses/types/Course';
import { loadCourses } from '../courses/coursesSlice';
import { useNavigate } from 'react-router-dom';
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
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a style={{ cursor: 'pointer' }} onClick={() => navigate('/account/attendances')}>
							Groups
						</a>
					</li>
				</ol>
			</nav>
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
									<button
										type="button"
										className="btn btn-outline-success"
										onClick={() =>
											navigate('/account/attendances/students-group', { state: { group } })
										}
									>
										To students
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-arrow-right-short"
											viewBox="0 0 16 16"
										>
											<path
												fillRule="evenodd"
												d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
											/>
										</svg>
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</>
	);
}
