import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLessonError, selectLessons } from './selectors';
import { useEffect } from 'react';
import { loadLessons } from './lessonsSlice';
import LessonEdit from './LessonEdit';
import Group from '../groups/types/Group';
import Lesson from './types/Lesson';

export default function Lessons(): JSX.Element {
	const location = useLocation();
	const state: { group: Group } = location.state;
	const group: Group = state.group;
	const lessons: Lesson[] = useAppSelector(selectLessons);
	const error = useAppSelector(selectLessonError);
	const dispatch = useAppDispatch();

	// const sortedLessons = lessons.slice().sort((a, b) => {
	// 	console.log(lessons);
	// 	const dateA = new Date(a.lessonDate).getTime();
	// 	const dateB = new Date(b.lessonDate).getTime();
	// 	return dateA - dateB;
	// });

	useEffect(() => {
		dispatch(loadLessons(group.id));
	}, [dispatch]);

	return (
		<div>
			<h1>Lessons</h1>
			<h4 style={{ textDecoration: 'underline' }}>for group {group.name}</h4>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<button className="btn btn-primary">
				<Link to={'/account/groups/lessons/add'} state={{ group }}>
					Create new lesson
				</Link>
			</button>
			<table className="table table-hover align-middle">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Type</th>
						<th scope="col">Date</th>
						<th scope="col">Start time</th>
						<th scope="col">End time</th>
						<th scope="col">Teacher</th>
						<th scope="col">Module</th>
						<th scope="col">Title</th>
						<th scope="col">Link to LMS</th>
						<th scope="col">Link to Zoom</th>
						<th scope="col">In archive</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{lessons
						.slice()
						.sort((a, b) => a.lessonId - b.lessonId)
						.map((lesson) => (
							<LessonEdit key={lesson.lessonId} lesson={lesson} />
						))}
				</tbody>
			</table>
		</div>
	);
}
