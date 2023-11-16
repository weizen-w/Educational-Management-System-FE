import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { loadCourses } from '../courses/coursesSlice';
import { selectCourses } from '../courses/selectors';
import Course from '../courses/types/Course';
import { loadGroupsByAuthUser } from './groupsSlice';
import { selectGroups, selectGroupError } from './selectors';

export default function GroupsTeacher(): JSX.Element {
	const navigate = useNavigate();
	const groups = useAppSelector(selectGroups);
	const courses = useAppSelector(selectCourses);
	const error = useAppSelector(selectGroupError);
	const dispatch = useAppDispatch();

	const getCourse = (findId: number): Course | undefined => courses.find((c) => c.id === findId);

	useEffect(() => {
		dispatch(loadGroupsByAuthUser());
		dispatch(loadCourses());
	}, [dispatch]);

	return (
		<>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href="#/account/groups">Groups</a>
					</li>
				</ol>
			</nav>
			<h1>My study groups</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">Group name</th>
						<th scope="col">Course name</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{groups
						.toSorted((a, b) => a.id - b.id)
						.map((group) => (
							<tr key={group.id}>
								<td>{group.name}</td>
								<td>{getCourse(group.courseId)?.name}</td>
								<td>
									<button
										type="button"
										className="btn btn-outline-success"
										style={{ marginLeft: '10px' }}
										onClick={() => navigate('/account/groups/students', { state: { group } })}
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
