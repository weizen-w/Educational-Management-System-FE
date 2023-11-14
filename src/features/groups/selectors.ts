import { RootState } from '../../app/store';
import Group from './types/Group';

export const selectGroups = (state: RootState): Group[] => state.groups.groups;
export const selectGroup = (state: RootState): Group => state.groups.group;
export const selectGroupError = (state: RootState): string | undefined => state.groups.error;
