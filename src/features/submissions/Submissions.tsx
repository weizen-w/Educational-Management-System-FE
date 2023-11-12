import { useLocation, useNavigate } from 'react-router-dom';
import User from '../auth/types/User';
import Group from '../groups/types/Group';
import Submission from './types/Submisson';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectSubmissionError, selectSubmissions } from './selectors';
import { useEffect } from 'react';
import { loadSubmissionsByUser } from './submissionsSlice';
import { selectLessons } from '../lessons/selectors';
import Lesson from '../lessons/types/Lesson';
import { loadLessons } from '../lessons/lessonsSlice';

export default function Submissions(): JSX.Element {
	const location = useLocation();
	const state: { user: User; group: Group } = location.state;
	const { user, group } = state;
	const submissions: Submission[] = useAppSelector(selectSubmissions);
	const lessons: Lesson[] = useAppSelector(selectLessons);
	const error = useAppSelector(selectSubmissionError);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const getLesson = (findId: number): Lesson | undefined =>
		lessons.find((lesson) => lesson.lessonId === findId);

	const sortedSubmissions = submissions.toSorted((a, b) => {
		const dateA = getLesson(a.lesson_id)?.lessonDate;
		const dateB = getLesson(b.lesson_id)?.lessonDate;

		if (!dateA || !dateB) {
			return 0;
		}

		return new Date(dateA).getTime() - new Date(dateB).getTime();
	});

	useEffect(() => {
		dispatch(loadSubmissionsByUser(user.id));
		dispatch(loadLessons(group.id));
	}, [dispatch]);

	return (
		<>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a style={{ cursor: 'pointer' }} onClick={() => navigate('/account/attendances')}>
							Groups
						</a>
					</li>
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => navigate('/account/attendances/students-group', { state: { group } })}
						>
							Students
						</a>
					</li>
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() =>
								navigate('/account/attendances/students-group/submissions-student', {
									state: { user, group },
								})
							}
						>
							Submissions
						</a>
					</li>
				</ol>
			</nav>
			<h1>Submissions</h1>
			<h4 style={{ textDecoration: 'underline' }}>
				for {user.firstName} {user.lastName}
			</h4>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Date</th>
						<th scope="col">Lesson</th>
						<th scope="col">State</th>
						<th scope="col">In archive</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{sortedSubmissions.map((submission) => (
						<tr key={submission.submission_id}>
							<th scope="row">{submission.submission_id}</th>
							<td>{getLesson(submission.lesson_id)?.lessonDate}</td>
							<td>
								{getLesson(submission.lesson_id)?.lessonType} /{' '}
								{getLesson(submission.lesson_id)?.lessonTitle} /{' '}
								{getLesson(submission.lesson_id)?.module.name}
							</td>
							<td>{submission.submission_state}</td>
							<td>{submission.archived.toString()}</td>
							<td>
								<button
									type="button"
									className="btn btn-outline-dark"
									onClick={() =>
										navigate(
											'/account/attendances/students-group/submissions-student/submission-details',
											{ state: { submission, group } }
										)
									}
								>
									More details
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
