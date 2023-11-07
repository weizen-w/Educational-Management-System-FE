import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourses, selectCourseError } from './selectors';
import { loadCourses } from './coursesSlice';
import CourseEdit from './CourseEdit';
import { useNavigate } from 'react-router-dom';

export default function Courses(): JSX.Element {
	const navigate = useNavigate();
	const courses = useAppSelector(selectCourses);
	const error = useAppSelector(selectCourseError);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(loadCourses());
	}, [dispatch]);

	return (
		<>
			<h1>Courses</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<button className="btn btn-primary" onClick={() => navigate('/account/courses/add')}>
				Create new course
			</button>
			<ul>
				{courses?.map((course) => (
					<li key={course.id}>
						<div>
							<CourseEdit course={course} />
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
