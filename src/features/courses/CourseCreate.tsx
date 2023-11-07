import { selectCourseError } from './selectors';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useCallback, useState } from 'react';
import { createCourse, resetCourseError } from './coursesSlice';
import { useNavigate } from 'react-router-dom';

export default function CourseCreate(): JSX.Element {
	const navigate = useNavigate();
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

	const handleSubmitCreate = useCallback(
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
			if (id !== 0) {
				setFormFields((prevFormFields) => ({
					...prevFormFields,
					idError: 'Invalid ID',
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
				await dispatch(createCourse(formFields.name));
				setFormFields(initStateFormFields);
				const inputCreateName = document.getElementById('create-name-input');
				if (inputCreateName instanceof HTMLInputElement) {
					inputCreateName.value = '';
				}
				navigate('/account/courses');
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
			<form className="auth-form" onSubmit={handleSubmitCreate}>
				{formFields.nameError && (
					<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
						{formFields.nameError}
					</div>
				)}
				<div className="col-md-2">
					<input
						type="text"
						className={`form-control ${error ? 'is-invalid' : ''}`}
						id="create-name-input"
						name="name"
						defaultValue={''}
						placeholder="Course name"
						onChange={handleInputChange}
					/>
				</div>
				<button type="submit" className="btn btn-success">
					Create
				</button>
				<button
					className="btn btn-danger"
					onClick={() => {
						setFormFields(initStateFormFields);
						navigate('/account/courses');
					}}
				>
					Cancel
				</button>
			</form>
		</div>
	);
}
