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
			<h1>Groups</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<button className="btn btn-primary" onClick={() => navigate('/account/groups/add')}>
				Create new group
			</button>
			<ul>
				{groups?.map((group) => (
					<li key={group.id}>
						<div>
							<GroupEdit group={group} courses={courses} />
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
