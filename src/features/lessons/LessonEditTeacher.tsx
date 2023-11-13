import { useCallback, useState } from 'react';
import Lesson from './types/Lesson';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLessonError } from './selectors';
import { resetLessonError, updateLesson } from './lessonsSlice';
import LessonDto from './types/LessonDto';
import { useNavigate } from 'react-router-dom';

interface Props {
	lesson: Lesson;
}

export default function LessonEditTeacher(props: Props): JSX.Element {
	const { lesson } = props;
	const error = useAppSelector(selectLessonError);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [newLesson, setNewLesson] = useState<LessonDto>({
		lessonId: 0,
		groupId: lesson.group.id,
		lessonTitle: lesson.lessonTitle,
		lessonDescription: lesson.lessonDescription,
		lessonType: lesson.lessonType,
		teacherId: lesson.teacher.id,
		lessonDate: lesson.lessonDate,
		startTime: lesson.startTime,
		endTime: lesson.endTime,
		moduleId: lesson.module.id,
		linkLms: lesson.linkLms,
		linkZoom: lesson.linkZoom,
		archived: lesson.archived,
	});
	const [errorsObj, setErrorsObj] = useState({
		idError: '',
		groupIdError: '',
		lessonTitleError: '',
		lessonDescriptionError: '',
		lessonTypeError: '',
		teacherIdError: '',
		lessonDateError: '',
		startTimeError: '',
		endTimeError: '',
		moduleIdError: '',
		linkLmsError: '',
		linkZoomError: '',
		archivedError: '',
	});

	const handleEditClick = (newId: number): void => {
		setNewLesson({ ...newLesson, lessonId: newId });
	};

	const handleCancel = (): void => {
		setNewLesson({
			lessonId: 0,
			groupId: lesson.group.id,
			lessonTitle: lesson.lessonTitle,
			lessonDescription: lesson.lessonDescription,
			lessonType: lesson.lessonType,
			teacherId: lesson.teacher.id,
			lessonDate: lesson.lessonDate,
			startTime: lesson.startTime,
			endTime: lesson.endTime,
			moduleId: lesson.module.id,
			linkLms: lesson.linkLms,
			linkZoom: lesson.linkZoom,
			archived: lesson.archived,
		});
		handleEditClick(0);
	};

	const handleSubmitUpdate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setErrorsObj({
				idError: '',
				groupIdError: '',
				lessonTitleError: '',
				lessonDescriptionError: '',
				lessonTypeError: '',
				teacherIdError: '',
				lessonDateError: '',
				startTimeError: '',
				endTimeError: '',
				moduleIdError: '',
				linkLmsError: '',
				linkZoomError: '',
				archivedError: '',
			});

			const {
				lessonId,
				groupId,
				lessonTitle,
				lessonType,
				teacherId,
				lessonDate,
				startTime,
				endTime,
				moduleId,
				archived,
			} = newLesson;
			if (lessonId < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					idError: 'ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (groupId < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					groupIdError: 'Group ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (!lessonTitle.trim()) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					lessonTitleError: 'The lesson title cannot be empty or only spaces',
				}));
				hasError = true;
			}
			if (lessonTitle.length > 50) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					lessonTitleError: 'The lesson title cannot be more than 50 characters',
				}));
				hasError = true;
			}
			if (lessonType.length > 20) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					lessonTypeError: 'Lesson type cannot be more than 20 characters',
				}));
				hasError = true;
			}
			if (teacherId < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					teacherIdError: 'Teacher ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (!/^\d{4}-\d{2}-\d{2}$/.test(lessonDate)) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					lessonDateError: 'The date does not reflect the format: 2020-12-31',
				}));
				hasError = true;
			}
			if (!/^\d{2}:\d{2}:\d{2}$/.test(startTime)) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					startTimeError: 'The start time does not reflect the format: 10:15:30',
				}));
				hasError = true;
			}
			if (!/^\d{2}:\d{2}:\d{2}$/.test(endTime)) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					endTimeError: 'The end time does not reflect the format: 10:15:30',
				}));
				hasError = true;
			}
			if (moduleId < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					moduleIdError: 'Module ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (typeof archived !== 'boolean') {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					archivedError: 'The archive field can only be a boolean',
				}));
				hasError = true;
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(
					updateLesson({
						lessonId: lesson.lessonId,
						groupId: lesson.group.id,
						lessonTitle: newLesson.lessonTitle,
						lessonDescription: newLesson.lessonDescription,
						lessonType: lesson.lessonType,
						teacherId: lesson.teacher.id,
						lessonDate: lesson.lessonDate,
						startTime: lesson.startTime,
						endTime: lesson.endTime,
						moduleId: lesson.module.id,
						linkLms: newLesson.linkLms,
						linkZoom: newLesson.linkZoom,
						archived: lesson.archived,
					})
				);
				handleEditClick(0);
				setErrorsObj({
					idError: '',
					groupIdError: '',
					lessonTitleError: '',
					lessonDescriptionError: '',
					lessonTypeError: '',
					teacherIdError: '',
					lessonDateError: '',
					startTimeError: '',
					endTimeError: '',
					moduleIdError: '',
					linkLmsError: '',
					linkZoomError: '',
					archivedError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, newLesson]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		dispatch(resetLessonError());
		const { name: key, value } = e.target;
		setNewLesson((prevNewLesson) => ({
			...prevNewLesson,
			[key]: value,
		}));
	};

	return (
		<>
			{newLesson.lessonId !== lesson.lessonId ? (
				<tr>
					<td>{lesson.lessonType}</td>
					<td>{lesson.lessonDate}</td>
					<td>{lesson.startTime}</td>
					<td>{lesson.endTime}</td>
					<td>
						{lesson.teacher.firstName} {lesson.teacher.lastName}
					</td>
					<td>{lesson.module.name}</td>
					<td>{lesson.lessonTitle}</td>
					<td>
						<a href={lesson.linkLms} target="_blank" rel="noreferrer">
							Link to LMS
						</a>
					</td>
					<td>
						<a href={lesson.linkZoom} target="_blank" rel="noreferrer">
							Link to Zoom
						</a>
					</td>
					<td className="row" style={{ gap: '3px' }}>
						<button
							type="button"
							className="btn btn-outline-dark"
							onClick={() => handleEditClick(lesson.lessonId)}
						>
							Edit
						</button>
						<button
							type="button"
							className="btn btn-outline-success"
							onClick={() => navigate('/account/lessons/attendances', { state: { lesson } })}
						>
							To attendances
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-arrow-right-short"
								viewBox="0 0 16 16"
							>
								<path
									fillRule="evenodd"
									d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
								/>
							</svg>
						</button>
					</td>
				</tr>
			) : (
				<tr>
					<td colSpan={12}>
						<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
							<div className="col-md-3">
								<label>Lesson title</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="lessonTitle"
									value={newLesson.lessonTitle}
									placeholder={lesson.lessonTitle}
									onChange={handleInputChange}
								/>
								{errorsObj.lessonTitleError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.lessonTitleError}
									</div>
								)}
							</div>
							<div className="col-md-9">
								<label>Lesson description</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="lessonDescription"
									value={newLesson.lessonDescription || ''}
									placeholder={lesson.lessonDescription}
									onChange={handleInputChange}
								/>
								{errorsObj.lessonDescriptionError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.lessonDescriptionError}
									</div>
								)}
							</div>
							<div className="col-md-6">
								<label>Link to LMS</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="linkLms"
									value={newLesson.linkLms || ''}
									placeholder={lesson.linkLms}
									onChange={handleInputChange}
								/>
								{errorsObj.linkLmsError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.linkLmsError}
									</div>
								)}
							</div>
							<div className="col-md-6">
								<label>Link to Zoom</label>
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="linkZoom"
									value={newLesson.linkZoom || ''}
									placeholder={lesson.linkZoom}
									onChange={handleInputChange}
								/>
								{errorsObj.linkZoomError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.linkZoomError}
									</div>
								)}
							</div>
							<div className="col-md-1 row g-1">
								<button type="submit" className="btn btn-success">
									Save
								</button>
								<button className="btn btn-danger" onClick={handleCancel}>
									Cancel
								</button>
							</div>
						</form>
					</td>
				</tr>
			)}
		</>
	);
}
