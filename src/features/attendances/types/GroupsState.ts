import Group from './Group';

export default interface GroupsState {
	groups: Group[];
	error?: string;
}
