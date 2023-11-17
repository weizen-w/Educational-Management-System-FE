import Material from './Material';

export default interface MaterialsState {
	materials: Material[];
	error?: string;
}
