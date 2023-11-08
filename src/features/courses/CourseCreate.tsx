import { selectCourseError } from './selectors';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useCallback, useState } from 'react';
import { createCourse, resetCourseError } from './coursesSlice';
import { useNavigate } from 'react-router-dom';
import Course from './types/Course';

export default function CourseCreate(): JSX.Element {
	const error = useAppSelector(selectCourseError);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [newCourse, setNewCourse] = useState<Course>({
		id: 0,
		name: '',
		archived: false,
	});
	const [errorsObj, setErrorsObj] = useState({
		idError: '',
		nameError: '',
		archivedError: '',
	});

	const handleCancel = (): void => {
		setNewCourse({
			id: 0,
			name: '',
			archived: false,
		});
		navigate('/account/courses');
	};

	const handleSubmitCreate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setErrorsObj({
				idError: '',
				nameError: '',
				archivedError: '',
			});

			const { id, name, archived } = newCourse;
			if (id !== 0) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					idError: 'Invalid ID',
				}));
				hasError = true;
			}
			if (!name.trim()) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					nameError: 'The name cannot be empty or only spaces',
				}));
				hasError = true;
			}
			if (name.length > 200) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					nameError: 'The name cannot be more than 200 characters',
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
				await dispatch(createCourse(newCourse.name));
				setNewCourse({
					id: 0,
					name: '',
					archived: false,
				});
				setErrorsObj({
					idError: '',
					nameError: '',
					archivedError: '',
				});
				navigate('/account/courses');
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, newCourse, errorsObj]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		dispatch(resetCourseError());
		const { name: key, value } = e.target;
		setNewCourse((prevNewCourse) => ({
			...prevNewCourse,
			[key]: value,
		}));
	};

	return (
		<div>
			<form className="auth-form row g-1" onSubmit={handleSubmitCreate}>
				{errorsObj.nameError && (
					<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
						{errorsObj.nameError}
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
