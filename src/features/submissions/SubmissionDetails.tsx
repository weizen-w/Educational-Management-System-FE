import { useLocation } from 'react-router-dom';
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

export default function SubmissionDetails(): JSX.Element {
	const location = useLocation();
	const state: { submission: Submission; group: Group } = location.state;
	const { submission, group } = state;
	const error = useAppSelector(selectSubmissionError);
	const lessons: Lesson[] = useAppSelector(selectLessons);
	const dispatch = useAppDispatch();

	const getLesson = (findId: number): Lesson | undefined =>
		lessons.find((l) => l.lessonId === findId);

	useEffect(() => {
		dispatch(loadLessons(group.id));
	}, [dispatch]);

	return (
		<>
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
		</>
	);
}
