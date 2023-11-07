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
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Course name</th>
						<th scope="col">In archive</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{courses
						?.sort((a, b) => a.id - b.id)
						.map((course) => (
							<CourseEdit key={course.id} course={course} />
						))}
				</tbody>
			</table>
		</>
	);
}
