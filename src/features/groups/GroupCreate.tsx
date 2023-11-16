import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGroupError } from './selectors';
import { useState, useCallback, useEffect } from 'react';
import { createGroup, resetGroupError } from './groupsSlice';
import Group from './types/Group';
import { selectCourses } from '../courses/selectors';
import { loadCourses } from '../courses/coursesSlice';

export default function GroupCreate(): JSX.Element {
	const courses = useAppSelector(selectCourses);
	const error = useAppSelector(selectGroupError);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [newGroup, setNewGroup] = useState<Group>({
		id: 0,
		name: '',
		courseId: 0,
		archived: false,
	});
	const [errorsObj, setErrorsObj] = useState({
		idError: '',
		nameError: '',
		courseIdError: '',
		archivedError: '',
	});

	const handleCancel = (): void => {
		setNewGroup({
			id: 0,
			name: '',
			courseId: 0,
			archived: false,
		});
		navigate('/account/groups');
	};

	const handleSubmitCreate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setErrorsObj({
				idError: '',
				nameError: '',
				courseIdError: '',
				archivedError: '',
			});

			const { id, name, courseId, archived } = newGroup;
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
			if (name.length > 50) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					nameError: 'The name cannot be more than 50 characters',
				}));
				hasError = true;
			}
			if (courseId < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					courseIdError: 'Course ID cannot be 0 or negative',
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
				await dispatch(createGroup(newGroup));
				setNewGroup({
					id: 0,
					name: '',
					courseId: 0,
					archived: false,
				});
				setErrorsObj({
					idError: '',
					nameError: '',
					courseIdError: '',
					archivedError: '',
				});
				navigate('/account/groups');
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, newGroup, errorsObj]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		dispatch(resetGroupError());
		const { name: key, value } = e.target;
		setNewGroup((prevNewGroup) => ({
			...prevNewGroup,
			[key]: value,
		}));
	};

	useEffect(() => {
		dispatch(loadCourses());
	}, [dispatch]);

	return (
		<div>
			<form className="auth-form row g-2" onSubmit={handleSubmitCreate}>
				{errorsObj.nameError && (
					<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
						{errorsObj.nameError}
					</div>
				)}
				<div className="col-md-2">
					<input
						type="text"
						className={`form-control ${error ? 'is-invalid' : ''}`}
						name="name"
						value={newGroup.name}
						placeholder="Course name"
						onChange={handleInputChange}
					/>
				</div>
				<div className="col-md-2">
					<select
						className={`form-select ${error ? 'is-invalid' : ''}`}
						name="courseId"
						defaultValue=""
						placeholder="Course"
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
					{errorsObj.courseIdError && (
						<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
							{errorsObj.courseIdError}
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
