/* eslint-disable import/no-extraneous-dependencies */
import { useCallback, useState } from 'react';
import Course from './types/Course';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetCourseError, updateCourse } from './coursesSlice';
import { selectCourseError } from './selectors';

interface Props {
	course: Course;
}

export default function CourseEdit(props: Props): JSX.Element {
	const { course } = props;
	const error = useAppSelector(selectCourseError);
	const dispatch = useAppDispatch();
	const [newCourse, setNewCourse] = useState<Course>({
		id: 0,
		name: course.name,
		archived: course.archived,
	});
	const [errorsObj, setErrorsObj] = useState({
		idError: '',
		nameError: '',
		archivedError: '',
	});

	const handleEditClick = (newId: number): void => {
		setNewCourse({ ...newCourse, id: newId });
	};

	const handleCancel = (): void => {
		setNewCourse({
			id: 0,
			name: course.name,
			archived: course.archived,
		});
		handleEditClick(0);
	};

	const handleSubmitUpdate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setErrorsObj({
				idError: '',
				nameError: '',
				archivedError: '',
			});

			const { id, name, archived } = newCourse;
			if (id < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					idError: 'ID cannot be 0 or negative',
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
				await dispatch(
					updateCourse({ id: course.id, name: newCourse.name, archived: course.archived })
				);
				handleEditClick(0);
				setErrorsObj({
					idError: '',
					nameError: '',
					archivedError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, newCourse]
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
		<>
			{newCourse.id !== course.id ? (
				<tr>
					<th scope="row">{course.id}</th>
					<td>{course.name}</td>
					<td>{course.archived.toString()}</td>
					<td>
						<button
							type="button"
							className="btn btn-outline-dark"
							onClick={() => handleEditClick(course.id)}
						>
							Edit
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => {
								dispatch(
									updateCourse({
										id: course.id,
										name: course.name,
										archived: !course.archived,
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
					<td colSpan={4}>
						<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
							<div className="col-md-2">
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="name"
									value={newCourse.name}
									placeholder={course.name}
									onChange={handleInputChange}
								/>
								{errorsObj.nameError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.nameError}
									</div>
								)}
							</div>
							<div className="col-md-1">
								<button type="submit" className="btn btn-outline-success">
									Save
								</button>
								<button className="btn btn-outline-danger" onClick={handleCancel}>
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
