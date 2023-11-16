import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAttendanceError } from '../attendances/selectors';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Lesson from './types/Lesson';
import { loadMainGroupsByAuthUser } from '../groups/groupsSlice';
import { selectLessons } from './selectors';
import { loadLessons } from './lessonsSlice';

interface Event {
	lesson: Lesson;
	start: Date;
	end: Date;
	title: string;
}

export default function CalendarStudentLessons(): JSX.Element {
	const lessons: Lesson[] = useAppSelector(selectLessons);
	const [events, setEvents] = useState<Event[]>([]);
	const error = useAppSelector(selectAttendanceError);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	const localizer = momentLocalizer(moment);

	const fillEventsListFromAttendances = (): void => {
		try {
			const eventsList: Event[] = [];
			for (const lesson of lessons) {
				eventsList.push({
					lesson,
					start: new Date(lesson.lessonDate + 'T' + lesson.startTime),
					end: new Date(lesson.lessonDate + 'T' + lesson.endTime),
					title: lesson.lessonType + ' / ' + lesson.lessonTitle,
				});
			}
			setEvents(eventsList);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Error fetching data:', err);
		}
	};

	useEffect(() => {
		dispatch(loadMainGroupsByAuthUser())
			.unwrap()
			.then((resGroup) => dispatch(loadLessons(resGroup.id)));
	}, [dispatch]);

	useEffect(() => {
		fillEventsListFromAttendances();
	}, [lessons]);

	if (events.length === 0) {
		return (
			<div className="text-center">
				<div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="spinner-grow" style={{ width: '3rem', height: '3rem' }} role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<>
			<ul className="nav nav-tabs">
				<li className="nav-item">
					<a
						className="nav-link active"
						style={{ cursor: 'pointer' }}
						onClick={() => navigate('/account/lessons')}
					>
						Lessons
					</a>
				</li>
				<li className="nav-item">
					<a
						className="nav-link"
						style={{ cursor: 'pointer' }}
						onClick={() => navigate('/account/attendances', { state: { lessons } })}
					>
						Attendances
					</a>
				</li>
			</ul>
			<h1>Lessons</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<div>
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor="start"
					endAccessor="end"
					style={{ height: 500 }}
					onSelectEvent={(event) => navigate('/account/lessons/lesson', { state: { event } })}
				/>
			</div>
		</>
	);
}
