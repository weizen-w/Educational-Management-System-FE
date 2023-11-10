import { useCallback, useEffect, useState } from 'react';
import Lesson from './types/Lesson';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLessonError } from './selectors';
import { resetLessonError, updateLesson } from './lessonsSlice';
import LessonDto from './types/LessonDto';
import { selectUsers } from '../users/selectors';
import { LessonType } from './types/LessonType';
import { loadUsers } from '../users/usersSlice';
import { selectModules } from '../modules/selectors';
import { loadModules } from '../modules/modulesSlice';

interface Props {
	lesson: Lesson;
}

export default function LessonEdit(props: Props): JSX.Element {
	const { lesson } = props;
	const teachers = useAppSelector(selectUsers);
	const modules = useAppSelector(selectModules);
	const error = useAppSelector(selectLessonError);
	const dispatch = useAppDispatch();
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
						lessonType: newLesson.lessonType,
						teacherId: newLesson.teacherId,
						lessonDate: newLesson.lessonDate,
						startTime: newLesson.startTime,
						endTime: newLesson.endTime,
						moduleId: newLesson.moduleId,
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

	useEffect(() => {
		dispatch(loadUsers());
		dispatch(loadModules());
	}, [dispatch]);

	return (
		<>
			{newLesson.lessonId !== lesson.lessonId ? (
				<tr>
					<th scope="row">{lesson.lessonId}</th>
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
					<td>{lesson.archived.toString()}</td>
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
							className="btn btn-secondary"
							onClick={() => {
								dispatch(
									updateLesson({
										lessonId: lesson.lessonId,
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
										archived: !lesson.archived,
									})
								);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-archive"
								viewBox="0 0 16 16"
							>
								<path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
							</svg>
							Archiv
						</button>
					</td>
				</tr>
			) : (
				<tr>
					<td colSpan={12}>
						<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
							<div className="col-md-2">
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
							<div className="col-md-12">
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
							<div className="col-md-2">
								<select
									className={`form-select ${error ? 'is-invalid' : ''}`}
									name="lessonType"
									value={newLesson.lessonType}
									onChange={handleInputChange}
								>
									<option value="" disabled hidden>
										Select lesson type...
									</option>
									{Object.keys(LessonType).map((key) => (
										<option key={key} value={LessonType[key as keyof typeof LessonType]}>
											{LessonType[key as keyof typeof LessonType]}
										</option>
									))}
								</select>
								{errorsObj.lessonTypeError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.lessonTypeError}
									</div>
								)}
							</div>
							<div className="col-md-4">
								<select
									className={`form-select ${error ? 'is-invalid' : ''}`}
									name="teacherId"
									value={newLesson.teacherId}
									onChange={handleInputChange}
								>
									<option value="" disabled hidden>
										Select teacher...
									</option>
									{teachers
										.slice()
										.filter((user) => user.role === 'TEACHER')
										.sort((a, b) => {
											if (a.lastName < b.lastName) {
												return -1;
											}
											if (a.lastName > b.lastName) {
												return 1;
											}
											return 0;
										})
										.map((teacher) => (
											<option key={teacher.id} value={teacher.id}>
												{teacher.firstName} {teacher.lastName}
											</option>
										))}
								</select>
								{errorsObj.teacherIdError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.teacherIdError}
									</div>
								)}
							</div>
							<div className="col-md-4">
								<input
									type="date"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="lessonDate"
									value={newLesson.lessonDate}
									placeholder={lesson.lessonDate}
									onChange={handleInputChange}
								/>
								{errorsObj.lessonDateError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.lessonDateError}
									</div>
								)}
							</div>
							<div className="col-md-4">
								<input
									type="time"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="startTime"
									value={newLesson.startTime}
									placeholder={lesson.startTime}
									onChange={handleInputChange}
								/>
								{errorsObj.startTimeError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.startTimeError}
									</div>
								)}
							</div>
							<div className="col-md-4">
								<input
									type="time"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="endTime"
									value={newLesson.endTime}
									placeholder={lesson.endTime}
									onChange={handleInputChange}
								/>
								{errorsObj.endTimeError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.endTimeError}
									</div>
								)}
							</div>
							<div className="col-md-2">
								<select
									className={`form-select ${error ? 'is-invalid' : ''}`}
									name="moduleId"
									value={newLesson.moduleId}
									onChange={handleInputChange}
								>
									<option value="" disabled hidden>
										Select module...
									</option>
									{modules
										.slice()
										.sort((a, b) => a.id - b.id)
										.map((module) => (
											<option key={module.id} value={module.id}>
												{module.name}
											</option>
										))}
								</select>
								{errorsObj.moduleIdError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.moduleIdError}
									</div>
								)}
							</div>
							<div className="col-md-12">
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
							<div className="col-md-12">
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
