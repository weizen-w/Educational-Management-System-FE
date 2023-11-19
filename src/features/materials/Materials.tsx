import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectMaterials } from './selectors';
import { useEffect, useState } from 'react';
import { loadMaterials } from './materialsSlice';
import { loadMainGroupsByAuthUser } from '../groups/groupsSlice';
import styles from './Materials.module.css';

export default function Materials(): JSX.Element {
	const materials = useAppSelector(selectMaterials);
	const dispatch = useAppDispatch();
	const [search, setSearch] = useState<string>('');

	const filteredMaterials = materials.filter((m) => m.mdContent.includes(search));

	useEffect(() => {
		dispatch(loadMainGroupsByAuthUser())
			.unwrap()
			.then((group) => {
				dispatch(loadMaterials(group.id));
			});
	}, [dispatch, search]);

	if (materials.length === 0) {
		return (
			<div className="text-center">
				<div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="spinner-grow" style={{ width: '3rem', height: '3rem' }} role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="form-floating ">
				<input
					className="form-control"
					type="search"
					placeholder="Start typing a word..."
					onChange={(e) => setSearch(e.target.value)}
				/>
				<label htmlFor="floatingInputValue">Start typing a word...</label>
			</div>
			<div>
				{filteredMaterials.length !== 0 ? (
					filteredMaterials.map((material) => (
						<Markdown
							className={styles.materialsLesson}
							key={material.order}
							remarkPlugins={[remarkGfm]}
						>
							{material.mdContent}
						</Markdown>
					))
				) : (
					<div style={{ fontSize: '20px', textAlign: 'center', marginTop: '20px' }}>No result</div>
				)}
			</div>
		</>
	);
}
