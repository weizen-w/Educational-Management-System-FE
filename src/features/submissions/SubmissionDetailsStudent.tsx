import { useLocation, useNavigate } from 'react-router-dom';
import Submission from './types/Submisson';
import { useAppSelector } from '../../app/hooks';
import Homework from './Homework';
import Solution from './Solution';
import { selectSubmissionError } from './selectors';
import Comments from '../comments/Comments';
import Lesson from '../lessons/types/Lesson';

interface Event {
	lesson: Lesson;
	start: Date;
	end: Date;
	title: string;
}

export default function SubmissionDetailsStudent(): JSX.Element {
	const location = useLocation();
	const state: { event: Event; submission: Submission } = location.state;
	const { event, submission } = state;
	const error = useAppSelector(selectSubmissionError);
	const navigate = useNavigate();

	return (
		<>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a style={{ cursor: 'pointer' }} onClick={() => navigate('/account/lessons')}>
							My calendar
						</a>
					</li>
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => navigate('/account/lessons/lesson', { state: { event } })}
						>
							Lesson details
						</a>
					</li>
					<li className="breadcrumb-item">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() =>
								navigate('/account/lessons/lesson/submission', { state: { event, submission } })
							}
						>
							My homework
						</a>
					</li>
				</ol>
			</nav>
			<h1>My homework</h1>
			<p>
				<b>{event.lesson.lessonType}</b> from <b>{event.lesson.lessonDate}</b> --{' '}
				<b>{event.lesson.lessonTitle}</b>
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
