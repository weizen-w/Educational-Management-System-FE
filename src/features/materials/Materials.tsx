import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectMaterials } from './selectors';
import { useEffect } from 'react';
import { loadMaterials } from './materialsSlice';
import { loadMainGroupsByAuthUser } from '../groups/groupsSlice';

export default function Materials(): JSX.Element {
	const materials = useAppSelector(selectMaterials);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(loadMainGroupsByAuthUser())
			.unwrap()
			.then((group) => {
				dispatch(loadMaterials(group.id));
			});
	}, [dispatch]);

	return (
		<div>
			{materials.map((material) => (
				<Markdown key={material.order} remarkPlugins={[remarkGfm]}>
					{material.mdContent}
				</Markdown>
			))}
		</div>
	);
}
