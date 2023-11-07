/* eslint-disable import/no-extraneous-dependencies */
import Group from './types/Group';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGroupError } from './selectors';
import { useCallback, useState } from 'react';
import { resetGroupError, updateGroup } from './groupsSlice';
import Course from '../courses/types/Course';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

interface Props {
	group: Group;
	courses: Course[];
}

export default function GroupEdit(props: Props): JSX.Element {
	const { group, courses } = props;
	const error = useAppSelector(selectGroupError);
	const dispatch = useAppDispatch();
	const initStateFormFields = {
		id: 0,
		name: group.name,
		courseId: group.courseId,
		archived: group.archived,
		idError: '',
		nameError: '',
		courseIdError: '',
		archivedError: '',
	};
	const [formFields, setFormFields] = useState(initStateFormFields);

	const getCourse = (findId: number): Course | undefined => courses.find((c) => c.id === findId);

	const handleEditClick = (newId: number): void => {
		setFormFields({ ...formFields, id: newId });
	};

	const handleCancel = (): void => {
		setFormFields(initStateFormFields);
		handleEditClick(0);
	};

	const handleSubmitUpdate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setFormFields((prevFormFields) => ({
				...prevFormFields,
				idError: '',
				nameError: '',
				courseIdError: '',
				archivedError: '',
			}));

			const { id, name, courseId, archived } = formFields;
			if (id < 1) {
				setFormFields((prevFormFields) => ({
					...prevFormFields,
					idError: 'ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (!name.trim()) {
				setFormFields((prevFormFields) => ({
					...prevFormFields,
					nameError: 'The name cannot be empty or only spaces',
				}));
				hasError = true;
			}
			if (name.length > 50) {
				setFormFields((prevFormFields) => ({
					...prevFormFields,
					nameError: 'The name cannot be more than 50 characters',
				}));
				hasError = true;
			}
			if (courseId < 1) {
				setFormFields((prevFormFields) => ({
					...prevFormFields,
					courseIdError: 'Course ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (typeof archived !== 'boolean') {
				setFormFields((prevFormFields) => ({
					...prevFormFields,
					archivedError: 'The archive field can only be a boolean',
				}));
				hasError = true;
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(
					updateGroup({
						id: group.id,
						name: formFields.name,
						courseId: formFields.courseId,
						archived: group.archived,
					})
				);
				setFormFields(initStateFormFields);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, formFields]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		dispatch(resetGroupError());
		const { name: key, value } = e.target;
		setFormFields((prevFormFields) => ({
			...prevFormFields,
			[key]: value,
		}));
	};

	return (
		<div>
			{formFields.id !== group.id ? (
				<>
					<div>
						<b>Name: </b>
						{group.name};<b> Course: </b>
						{getCourse(group.courseId)?.name};<b> is archived: </b>
						{group.archived.toString()}
						<EditIcon onClick={() => handleEditClick(group.id)} />
						<ArchiveIcon
							onClick={() => {
								dispatch(
									updateGroup({
										id: group.id,
										name: group.name,
										courseId: group.courseId,
										archived: !group.archived,
									})
								);
							}}
						/>
					</div>
				</>
			) : (
				<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
					<div className="col-md-2">
						<input
							type="text"
							className={`form-control ${error ? 'is-invalid' : ''}`}
							name="name"
							value={formFields.name}
							placeholder={group.name}
							onChange={handleInputChange}
						/>
						{formFields.nameError && (
							<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
								{formFields.nameError}
							</div>
						)}
					</div>
					<div className="col-md-2">
						<select
							className={`form-select ${error ? 'is-invalid' : ''}`}
							name="courseId"
							value={formFields.courseId}
							onChange={handleInputChange}
						>
							<option value="" disabled hidden>
								Select course...
							</option>
							{courses.map((course) => (
								<option key={course.id} value={course.id}>
									{course.name}
								</option>
							))}
						</select>
						{formFields.courseIdError && (
							<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
								{formFields.courseIdError}
							</div>
						)}
					</div>
					<div className="col-md-1">
						<button type="submit" className="btn btn-success">
							Save
						</button>
						<button className="btn btn-danger" onClick={handleCancel}>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
