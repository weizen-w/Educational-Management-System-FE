import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAttendanceError, selectAttendances } from './selectors';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Lesson from '../lessons/types/Lesson';
import { getLesson } from '../lessons/api';
import { useDispatch } from 'react-redux';
import { loadAttendancesByAuthUser } from './attendancesSlice';

interface Event {
	lesson: Lesson;
	start: Date;
	end: Date;
	title: string;
}

export default function CalendarStudentAttendances(): JSX.Element {
	const attendances = useAppSelector(selectAttendances);
	const [events, setEvents] = useState<Event[]>([]);
	const error = useAppSelector(selectAttendanceError);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	const localizer = momentLocalizer(moment);

	const fillEventsListFromAttendances = async (): Promise<void> => {
		try {
			const eventsList: Event[] = [];
			for (const attendance of attendances) {
				const lesson: Lesson = await getLesson(attendance.lesson_id);
				if (lesson) {
					eventsList.push({
						lesson,
						start: new Date(lesson.lessonDate + 'T' + lesson.startTime),
						end: new Date(lesson.lessonDate + 'T' + lesson.endTime),
						title: attendance.status,
					});
				}
			}
			setEvents(eventsList);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Error fetching data:', err);
		}
	};

	useEffect(() => {
		loadAttendancesByAuthUser();
		fillEventsListFromAttendances();
	}, [attendances]);

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
						className="nav-link"
						style={{ cursor: 'pointer' }}
						onClick={() => navigate('/account/lessons')}
					>
						Lessons
					</a>
				</li>
				<li className="nav-item">
					<a
						className="nav-link active"
						style={{ cursor: 'pointer' }}
						onClick={() => navigate('/account/attendances')}
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
				/>
			</div>
		</>
	);
}
