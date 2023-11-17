import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useCallback, useEffect, useState } from 'react';
import LessonDto from './types/LessonDto';
import Group from '../groups/types/Group';
import { selectLessonError } from './selectors';
import { createLesson, resetLessonError } from './lessonsSlice';
import { selectUsers } from '../users/selectors';
import { loadUsers } from '../users/usersSlice';
import { LessonType } from './types/LessonType';
import { selectModules } from '../modules/selectors';
import { loadModules } from '../modules/modulesSlice';

export default function LessonCreate(): JSX.Element {
	const location = useLocation();
	const state: { group: Group } = location.state;
	const group: Group = state.group;
	const teachers = useAppSelector(selectUsers);
	const modules = useAppSelector(selectModules);
	const error = useAppSelector(selectLessonError);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [newLesson, setNewLesson] = useState<LessonDto>({
		lessonId: 0,
		groupId: group.id,
		lessonTitle: '',
		lessonDescription: '',
		lessonType: '',
		teacherId: 0,
		lessonDate: '',
		startTime: '',
		endTime: '',
		moduleId: 0,
		linkLms: '',
		linkZoom: '',
		archived: false,
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

	const handleCancel = (): void => {
		setNewLesson({
			lessonId: 0,
			groupId: group.id,
			lessonTitle: '',
			lessonDescription: '',
			lessonType: '',
			teacherId: 0,
			lessonDate: '',
			startTime: '',
			endTime: '',
			moduleId: 0,
			linkLms: '',
			linkZoom: '',
			archived: false,
		});
		navigate('/account/groups/lessons', { state: { group } });
	};

	const handleSubmitCreate = useCallback(
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
			if (lessonId !== 0) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					idError: 'Invalid ID',
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
			if (lessonType.length === 0) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					lessonTypeError: 'Lesson type cannot be empty',
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
			if (!/^\d{2}:\d{2}$/.test(startTime)) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					startTimeError: 'The start time does not reflect the format: 10:15:30',
				}));
				hasError = true;
			}
			if (!/^\d{2}:\d{2}$/.test(endTime)) {
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
					createLesson({
						lessonId: 0,
						groupId: group.id,
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
						archived: newLesson.archived,
					})
				);
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
				navigate(-1);
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
		<div>
			<form className="auth-form row g-2" onSubmit={handleSubmitCreate}>
				<div className="col-md-2">
					<input
						type="text"
						className={`form-control ${error ? 'is-invalid' : ''}`}
						name="lessonTitle"
						value={newLesson.lessonTitle}
						placeholder="Lesson title"
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
						value={newLesson.lessonDescription}
						placeholder="Lesson description"
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
						defaultValue=""
						placeholder="Lesson type"
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
						defaultValue=""
						placeholder="Teacher"
						onChange={handleInputChange}
					>
						<option value="" disabled hidden>
							Select teacher...
						</option>
						{teachers
							.slice()
							.filter((user) => user.role === 'TEACHER')
							.sort((a, b) => {
								if ((a.lastName || '') < (b.lastName || '')) {
									return -1;
								}
								if ((a.lastName || '') > (b.lastName || '')) {
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
						placeholder="Lesson date"
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
						placeholder="Lesson start time"
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
						placeholder="Lesson start time"
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
						defaultValue=""
						placeholder="Module"
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
						value={newLesson.linkLms}
						placeholder="Lesson link to LMS"
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
						value={newLesson.linkZoom}
						placeholder="Lesson link to Zoom"
						onChange={handleInputChange}
					/>
					{errorsObj.linkZoomError && (
						<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
							{errorsObj.linkZoomError}
						</div>
					)}
				</div>
				<div className="col-md-2">
					<button type="submit" className="btn btn-success">
						Create
					</button>
					<button className="btn btn-danger" onClick={handleCancel}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
