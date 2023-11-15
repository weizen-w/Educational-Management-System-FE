import { useLocation, useNavigate } from 'react-router-dom';
import Lesson from './types/Lesson';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLessonError } from './selectors';
import { selectUser } from '../auth/selectors';
import Submission from '../submissions/types/Submisson';
import { selectSubmissions } from '../submissions/selectors';
import { useEffect, useState } from 'react';
import { loadSubmissionsByLesson } from '../submissions/submissionsSlice';

interface Event {
	lesson: Lesson;
	start: Date;
	end: Date;
	title: string;
}

export default function LessonStudent(): JSX.Element {
	const location = useLocation();
	const state: { event: Event } = location.state;
	const event: Event = state.event;
	const lesson: Lesson = event.lesson;
	const user = useAppSelector(selectUser);
	const submissions = useAppSelector(selectSubmissions);
	const [submission, setSubmission] = useState<Submission | undefined>(undefined);
	const error = useAppSelector(selectLessonError);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const getSubmission = (): Submission | undefined =>
		submissions.find((s) => s.student_id === user?.id);

	useEffect(() => {
		dispatch(loadSubmissionsByLesson(lesson.lessonId));
	}, [dispatch]);

	useEffect(() => {
		setSubmission(getSubmission());
	}, [submissions]);

	return (
		<div>
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
				</ol>
			</nav>
			<h1>Lesson details</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<table className="table table-hover align-middle">
				<tbody>
					<tr>
						<th scope="row">Type</th>
						<td>{lesson.lessonType}</td>
						<th scope="row">Module</th>
						<td>{lesson.module.name}</td>
					</tr>
					<tr>
						<th scope="row">Title</th>
						<td colSpan={5}>{lesson.lessonTitle}</td>
					</tr>
					<tr>
						<th className="col-md-1" scope="row">
							Date
						</th>
						<td className="col-md-1">{lesson.lessonDate}</td>
						<th className="col-md-1" scope="row">
							Start time
						</th>
						<td className="col-md-1">{lesson.startTime}</td>
						<th className="col-md-1" scope="row">
							End time
						</th>
						<td className="col-md-1">{lesson.endTime}</td>
						<td></td>
					</tr>
					<tr>
						<th scope="row">Teacher</th>
						<td>
							{lesson.teacher.firstName} {lesson.teacher.lastName}
						</td>
					</tr>
					<tr>
						<th scope="row">Link to LMS</th>
						<td>
							<a href={lesson.linkLms} target="_blank" rel="noreferrer">
								Link to LMS
							</a>
						</td>
					</tr>
					<tr>
						<th scope="row">Link to Zoom</th>
						<td>
							<a href={lesson.linkZoom} target="_blank" rel="noreferrer">
								Link to Zoom
							</a>
						</td>
					</tr>
				</tbody>
			</table>
			<div>
				{!submission ? (
					<button
						type="button"
						className="btn btn-outline-success"
						onClick={() =>
							navigate('/account/lessons/lesson/add-submission', { state: { event, lesson } })
						}
					>
						Send your homework
					</button>
				) : (
					<button
						type="button"
						className="btn btn-outline-info"
						onClick={() =>
							navigate('/account/lessons/lesson/submission', { state: { event, submission } })
						}
					>
						View details homework
					</button>
				)}
			</div>
		</div>
	);
}
