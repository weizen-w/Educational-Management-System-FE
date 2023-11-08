import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectModuleError } from './selectors';
import { createModule, resetModuleError } from './modulesSlice';
import { useNavigate } from 'react-router-dom';
import Module from './types/Module';

export default function ModuleCreate(): JSX.Element {
	const error = useAppSelector(selectModuleError);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [newModule, setNewModule] = useState<Module>({
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
		setNewModule({
			id: 0,
			name: '',
			archived: false,
		});
		navigate('/account/modules');
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

			const { id, name, archived } = newModule;
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
				await dispatch(createModule(newModule.name));
				setNewModule({
					id: 0,
					name: '',
					archived: false,
				});
				setErrorsObj({
					idError: '',
					nameError: '',
					archivedError: '',
				});
				navigate('/account/modules');
			} catch (err) {
				// eslint-disable-next-line no-console
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
						placeholder="Module name"
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
