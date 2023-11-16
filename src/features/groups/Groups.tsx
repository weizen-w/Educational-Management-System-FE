import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGroupError, selectGroups } from './selectors';
import { loadGroups } from './groupsSlice';
import GroupEdit from './GroupEdit';
import { loadCourses } from '../courses/coursesSlice';
import { selectCourses } from '../courses/selectors';
import { useNavigate } from 'react-router-dom';

export default function Groups(): JSX.Element {
	const navigate = useNavigate();
	const groups = useAppSelector(selectGroups);
	const courses = useAppSelector(selectCourses);
	const error = useAppSelector(selectGroupError);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(loadGroups());
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
			<h1>Groups</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<button className="btn btn-primary" onClick={() => navigate('/account/groups/add')}>
				Create new group
			</button>
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Group name</th>
						<th scope="col">Course name</th>
						<th scope="col">In archive</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{groups
						.slice()
						.sort((a, b) => a.id - b.id)
						.map((group) => (
							<GroupEdit key={group.id} group={group} courses={courses} />
						))}
				</tbody>
			</table>
		</>
	);
}
