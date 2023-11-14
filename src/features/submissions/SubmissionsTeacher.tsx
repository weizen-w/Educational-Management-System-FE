import { useLocation, useNavigate } from 'react-router-dom';
import User from '../auth/types/User';
import Submission from './types/Submisson';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectSubmissionError, selectSubmissions } from './selectors';
import { useEffect } from 'react';
import { loadSubmissionsByLesson } from './submissionsSlice';
import Lesson from '../lessons/types/Lesson';
import { selectUsers } from '../users/selectors';
import { loadUsersByMainGroup } from '../users/usersSlice';

export default function SubmissionsTeacher(): JSX.Element {
	const location = useLocation();
	const state: { lesson: Lesson } = location.state;
	const { lesson } = state;
	const submissions: Submission[] = useAppSelector(selectSubmissions);
	const users: User[] = useAppSelector(selectUsers);
	const error = useAppSelector(selectSubmissionError);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const getUser = (findId: number): User | undefined => users.find((user) => user.id === findId);

	useEffect(() => {
		dispatch(loadSubmissionsByLesson(lesson.lessonId));
		dispatch(loadUsersByMainGroup(lesson.group.id));
	}, [dispatch]);

	return (
		<>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href="#/account/lessons">Lessons</a>
					</li>
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => navigate('/account/lessons/submissions', { state: { lesson } })}
						>
							Submissions
						</a>
					</li>
				</ol>
			</nav>
			<h1>Submissions</h1>
			<h4 style={{ textDecoration: 'underline' }}>
				for {lesson.lessonType} / {lesson.lessonDate} / {lesson.lessonTitle}
			</h4>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">First name</th>
						<th scope="col">Last name</th>
						<th scope="col">Status</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{submissions.map((submission) => (
						<tr key={submission.submission_id}>
							<td>{getUser(submission.student_id)?.firstName}</td>
							<td>{getUser(submission.student_id)?.lastName}</td>
							<td>{submission.submission_state}</td>
							<td>
								<button
									type="button"
									className="btn btn-outline-dark"
									onClick={() =>
										navigate('/account/lessons/submissions/submission-details', {
											state: { submission, lesson },
										})
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
