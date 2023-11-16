import { useLocation, useNavigate } from 'react-router-dom';
import Submission from './types/Submisson';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Lesson from '../lessons/types/Lesson';
import { selectLessons } from '../lessons/selectors';
import { useEffect } from 'react';
import Homework from './Homework';
import { loadLessons } from '../lessons/lessonsSlice';
import Group from '../groups/types/Group';
import Solution from './Solution';
import { selectSubmissionError } from './selectors';
import User from '../auth/types/User';
import Comments from '../comments/Comments';

export default function SubmissionDetails(): JSX.Element {
	const location = useLocation();
	const state: { submission: Submission; group: Group; user: User } = location.state;
	const { submission, group, user } = state;
	const error = useAppSelector(selectSubmissionError);
	const lessons: Lesson[] = useAppSelector(selectLessons);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const getLesson = (findId: number): Lesson | undefined =>
		lessons.find((l) => l.lessonId === findId);

	useEffect(() => {
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
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() =>
								navigate(
									'/account/attendances/students-group/submissions-student/submission-details',
									{
										state: { submission, group, user },
									}
								)
							}
						>
							SubmissionDetails
						</a>
					</li>
				</ol>
			</nav>
			<h1>Submission</h1>
			<p>
				<b>{getLesson(submission.lesson_id)?.lessonType}</b> from{' '}
				<b>{getLesson(submission.lesson_id)?.lessonDate}</b> --{' '}
				<b>{getLesson(submission.lesson_id)?.lessonTitle}</b>
			</p>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<Homework />
			<Solution submission={submission} />
			<Comments submission={submission} />
		</>
	);
}
