import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourses } from './selectors';
import { loadCourses } from './coursesSlice';

export default function Courses(): JSX.Element {
	const courses = useAppSelector(selectCourses);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(loadCourses());
	}, [dispatch]);

	return (
		<>
			<div>Courses</div>
			<ul>
				{courses?.map((course) => (
					<li key={course.id}>{course.name}</li>
				))}
			</ul>
		</>
	);
}
