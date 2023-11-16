import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLessonError, selectLessons } from './selectors';
import { useEffect } from 'react';
import { loadLessonsByTeacher } from './lessonsSlice';
import Lesson from './types/Lesson';
import LessonEditTeacher from './LessonEditTeacher';

export default function LessonsTeacher(): JSX.Element {
	const lessons: Lesson[] = useAppSelector(selectLessons);
	const error = useAppSelector(selectLessonError);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(loadLessonsByTeacher());
	}, [dispatch]);

	return (
		<div>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href="#/account/lessons">Lessons</a>
					</li>
				</ol>
			</nav>
			<h1>My lessons</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<table className="table table-hover align-middle">
				<thead>
					<tr>
						<th scope="col">Type</th>
						<th scope="col">Date</th>
						<th scope="col">Start time</th>
						<th scope="col">End time</th>
						<th scope="col">Teacher</th>
						<th scope="col">Module</th>
						<th scope="col">Title</th>
						<th scope="col">Link to LMS</th>
						<th scope="col">Link to Zoom</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{lessons
						.toSorted((a, b) => new Date(a.lessonDate).getTime() - new Date(b.lessonDate).getTime())
						.map((lesson) => (
							<LessonEditTeacher key={lesson.lessonId} lesson={lesson} />
						))}
				</tbody>
			</table>
		</div>
	);
}
