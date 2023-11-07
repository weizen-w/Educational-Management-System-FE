/* eslint-disable import/no-extraneous-dependencies */
import { useCallback, useState } from 'react';
import Course from './types/Course';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetCourseError, updateCourse } from './coursesSlice';
import { selectCourseError } from './selectors';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

interface Props {
	course: Course;
}

export default function CourseEdit(props: Props): JSX.Element {
	const { course } = props;
	const error = useAppSelector(selectCourseError);
	const dispatch = useAppDispatch();
	const initStateFormFields = {
		id: 0,
		name: '',
		archived: false,
		idError: '',
		nameError: '',
		archivedError: '',
	};
	const [formFields, setFormFields] = useState(initStateFormFields);

	const handleEditClick = (newId: number): void => {
		setFormFields({ ...formFields, id: newId });
	};

	const handleSubmitUpdate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setFormFields((prevFormFields) => ({
				...prevFormFields,
				idError: '',
				nameError: '',
				archivedError: '',
			}));

			const { id, name, archived } = formFields;
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
			if (name.length > 200) {
				setFormFields((prevFormFields) => ({
					...prevFormFields,
					nameError: 'The name cannot be more than 200 characters',
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
					updateCourse({ id: formFields.id, name: formFields.name, archived: formFields.archived })
				);
				setFormFields(initStateFormFields);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, formFields]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		dispatch(resetCourseError());
		const { name: key, value } = e.target;
		setFormFields((prevFormFields) => ({
			...prevFormFields,
			[key]: value,
		}));
	};

	return (
		<div>
			{formFields.id !== course.id ? (
				<>
					<span>
						<b>Name: </b>
						{course.name}
					</span>
					<span>
						<b>, is archived: </b>
						{course.archived.toString()}
					</span>
					<EditIcon onClick={() => handleEditClick(course.id)} />
					<ArchiveIcon
						onClick={() => {
							dispatch(
								updateCourse({
									id: course.id,
									name: course.name,
									archived: !course.archived,
								})
							);
						}}
					/>
				</>
			) : (
				<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
					<div className="col-md-2">
						<input
							type="text"
							className={`form-control ${error ? 'is-invalid' : ''}`}
							name="name"
							defaultValue={course.name}
							placeholder={course.name}
							onChange={handleInputChange}
						/>
						{formFields.nameError && (
							<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
								{formFields.nameError}
							</div>
						)}
					</div>
					<div className="col-md-1">
						<button type="submit" className="btn btn-success">
							Save
						</button>
						<button
							className="btn btn-danger"
							onClick={() => {
								setFormFields(initStateFormFields);
								handleEditClick(0);
							}}
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
