import Group from './Group';

export default interface GroupsState {
	groups: Group[];
	group: Group;
	error?: string;
}
