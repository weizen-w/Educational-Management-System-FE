import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourses, selectError } from './selectors';
import { createCourse, loadCourses, resetError, updateCourse } from './coursesSlice';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

export default function Courses(): JSX.Element {
	const courses = useAppSelector(selectCourses);
	const error = useAppSelector(selectError);
	const dispatch = useAppDispatch();
	const [isCreate, setIsCreate] = useState<boolean>(false);
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
				console.error(err);
			}
		},
		[dispatch, formFields]
	);

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
				setIsCreate(false);
			} catch (err) {
				console.error(err);
			}
		},
		[dispatch, formFields]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		dispatch(resetError());
		const { name: key, value } = e.target;
		setFormFields((prevFormFields) => ({
			...prevFormFields,
			[key]: value,
		}));
	};

	useEffect(() => {
		dispatch(loadCourses());
	}, [dispatch]);

	return (
		<>
			<h1>Courses</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			{isCreate ? (
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
								setIsCreate(false);
							}}
						>
							Cancel
						</button>
					</form>
				</div>
			) : (
				<>
					<button className="btn btn-primary" onClick={() => setIsCreate(!isCreate)}>
						Create new course
					</button>
					<ul>
						{courses?.map((course) => (
							<li key={course.id}>
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
										<form className="auth-form" onSubmit={handleSubmitUpdate}>
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
										</form>
									)}
								</div>
							</li>
						))}
					</ul>
				</>
			)}
		</>
	);
}
