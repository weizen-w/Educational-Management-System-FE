/* eslint-disable import/no-extraneous-dependencies */
import Group from './types/Group';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGroupError } from './selectors';
import { useCallback, useState } from 'react';
import { resetGroupError, updateGroup } from './groupsSlice';
import Course from '../courses/types/Course';
import { NavLink, useNavigate } from 'react-router-dom';

interface Props {
	group: Group;
	courses: Course[];
}

export default function GroupEdit(props: Props): JSX.Element {
	const { group, courses } = props;
	const navigate = useNavigate();
	const error = useAppSelector(selectGroupError);
	const dispatch = useAppDispatch();
	const [newGroup, setNewGroup] = useState<Group>({
		id: 0,
		name: group.name,
		courseId: group.courseId,
		archived: group.archived,
	});
	const [errorsObj, setErrorsObj] = useState({
		idError: '',
		nameError: '',
		courseIdError: '',
		archivedError: '',
	});

	const getCourse = (findId: number): Course | undefined => courses.find((c) => c.id === findId);

	const handleEditClick = (newId: number): void => {
		setNewGroup({ ...newGroup, id: newId });
	};

	const handleCancel = (): void => {
		setNewGroup({
			id: 0,
			name: group.name,
			courseId: group.courseId,
			archived: group.archived,
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
				courseIdError: '',
				archivedError: '',
			});

			const { id, name, courseId, archived } = newGroup;
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
				await dispatch(
					updateGroup({
						id: group.id,
						name: newGroup.name,
						courseId: newGroup.courseId,
						archived: group.archived,
					})
				);
				handleEditClick(0);
				setErrorsObj({
					idError: '',
					nameError: '',
					courseIdError: '',
					archivedError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, newGroup]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		dispatch(resetGroupError());
		const { name: key, value } = e.target;
		setNewGroup((prevNewGroup) => ({
			...prevNewGroup,
			[key]: value,
		}));
	};

	return (
		<>
			{newGroup.id !== group.id ? (
				<tr>
					<th scope="row">{group.id}</th>
					<td onClick={() => navigate('/account/groups/lessons')} style={{ cursor: 'pointer' }}>
						{group.name}
					</td>
					<td>{getCourse(group.courseId)?.name}</td>
					<td>{group.archived.toString()}</td>
					<td>
						<button
							type="button"
							className="btn btn-outline-dark"
							onClick={() => handleEditClick(group.id)}
						>
							Edit
						</button>
						<button
							type="button"
							className="btn btn-secondary"
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
					<td colSpan={5}>
						<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
							<div className="col-md-2">
								<input
									type="text"
									className={`form-control ${error ? 'is-invalid' : ''}`}
									name="name"
									value={newGroup.name}
									placeholder={group.name}
									onChange={handleInputChange}
								/>
								{errorsObj.nameError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.nameError}
									</div>
								)}
							</div>
							<div className="col-md-2">
								<select
									className={`form-select ${error ? 'is-invalid' : ''}`}
									name="courseId"
									value={newGroup.courseId}
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
							<div className="col-md-1">
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
