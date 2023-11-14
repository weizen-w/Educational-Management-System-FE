import { useLocation, useNavigate } from 'react-router-dom';
import Submission from './types/Submisson';
import { useAppSelector } from '../../app/hooks';
import Lesson from '../lessons/types/Lesson';
import Homework from './Homework';
import Solution from './Solution';
import { selectSubmissionError } from './selectors';
import Comments from '../comments/Comments';

export default function SubmissionDetailsTeacher(): JSX.Element {
	const location = useLocation();
	const state: { submission: Submission; lesson: Lesson } = location.state;
	const { submission, lesson } = state;
	const error = useAppSelector(selectSubmissionError);
	const navigate = useNavigate();

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
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() =>
								navigate('/account/lessons/submissions/submission-details', {
									state: { submission, lesson },
								})
							}
						>
							SubmissionDetails
						</a>
					</li>
				</ol>
			</nav>
			<h1>Submission</h1>
			<p>
				<b>{lesson.lessonType}</b> from <b>{lesson.lessonDate}</b> -- <b>{lesson.lessonTitle}</b>
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
