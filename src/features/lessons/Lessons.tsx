import { useLocation, useNavigate } from 'react-router-dom';
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
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(loadLessons(group.id));
	}, [dispatch]);

	return (
		<div>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href="#/account/groups">Groups</a>
					</li>
					<li className="breadcrumb-item">
						<a href="#/account/groups/lessons">Lessons</a>
					</li>
				</ol>
			</nav>
			<h1>Lessons</h1>
			<h4 style={{ textDecoration: 'underline' }}>for group {group.name}</h4>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<button
				className="btn btn-primary"
				onClick={() => navigate('/account/groups/lessons/add', { state: { group } })}
			>
				Create new lesson
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
						.toSorted((a, b) => new Date(a.lessonDate).getTime() - new Date(b.lessonDate).getTime())
						.map((lesson) => (
							<LessonEdit key={lesson.lessonId} lesson={lesson} />
						))}
				</tbody>
			</table>
		</div>
	);
}
