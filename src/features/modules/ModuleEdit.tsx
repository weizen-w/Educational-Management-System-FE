import { useState, useCallback } from 'react';
import Module from './types/Module';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectModuleError } from './selectors';
import { resetModuleError, updateModule } from './modulesSlice';

interface Props {
	module: Module;
}

export default function ModuleEdit(props: Props): JSX.Element {
	const { module } = props;
	const error = useAppSelector(selectModuleError);
	const dispatch = useAppDispatch();
	const [newModule, setNewModule] = useState<Module>({
		id: 0,
		name: module.name,
		archived: module.archived,
	});
	const [errorsObj, setErrorsObj] = useState({
		idError: '',
		nameError: '',
		archivedError: '',
	});

	const handleEditClick = (newId: number): void => {
		setNewModule({ ...newModule, id: newId });
	};

	const handleCancel = (): void => {
		setNewModule({
			id: 0,
			name: module.name,
			archived: module.archived,
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

			const { id, name, archived } = newModule;
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
					updateModule({ id: module.id, name: newModule.name, archived: module.archived })
				);
				handleEditClick(0);
				setErrorsObj({
					idError: '',
					nameError: '',
					archivedError: '',
				});
			} catch (err) {
				console.error(err);
			}
		},
		[dispatch, newModule, errorsObj]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		dispatch(resetModuleError());
		const { name: key, value } = e.target;
		setNewModule((prevNewModule) => ({
			...prevNewModule,
			[key]: value,
		}));
	};

	return (
		<>
			{newModule.id !== module.id ? (
				<tr>
					<th scope="row">{module.id}</th>
					<td>{module.name}</td>
					<td>{module.archived.toString()}</td>
					<td>
						<button
							type="button"
							className="btn btn-outline-dark"
							onClick={() => handleEditClick(module.id)}
						>
							Edit
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => {
								dispatch(
									updateModule({
										id: module.id,
										name: module.name,
										archived: !module.archived,
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
									value={newModule.name}
									placeholder={module.name}
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
