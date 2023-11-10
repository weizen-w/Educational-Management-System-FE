import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ModuleEdit from './ModuleEdit';
import { loadModules } from './modulesSlice';
import { selectModules, selectModuleError } from './selectors';
import { useNavigate } from 'react-router-dom';

export default function Modules(): JSX.Element {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const modules = useAppSelector(selectModules);
	const error = useAppSelector(selectModuleError);

	useEffect(() => {
		dispatch(loadModules());
	}, [dispatch]);

	return (
		<>
			<h1>Modules</h1>
			{error && (
				<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
					{error}
				</div>
			)}
			<button className="btn btn-primary" onClick={() => navigate('/account/modules/add')}>
				Create new module
			</button>
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Module name</th>
						<th scope="col">In archive</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
				<tbody>
					{modules
						.slice()
						?.sort((a, b) => a.id - b.id)
						.map((module) => (
							<ModuleEdit key={module.id} module={module} />
						))}
				</tbody>
			</table>
		</>
	);
}
