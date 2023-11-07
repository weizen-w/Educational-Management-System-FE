import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectError, selectGroups } from './selectors';
import { loadGroups } from './groupsSlice';
import { selectCourses } from '../courses/selectors';
import Course from '../courses/types/Course';
import { loadCourses } from '../courses/coursesSlice';

export default function Groups(): JSX.Element {
	const groups = useAppSelector(selectGroups);
	const courses = useAppSelector(selectCourses);
	const error = useAppSelector(selectError);
	const dispatch = useAppDispatch();

	const getCourse = (findId: number): Course | undefined => courses.find((c) => c.id === findId);

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
			<ul>
				{groups?.map((group) => (
					<li key={group.id}>
						<div>
							<b>Name: </b>
							{group.name};<b> Course: </b>
							{getCourse(group.courseId)?.name};<b> is archived: </b>
							{group.archived.toString()}
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
