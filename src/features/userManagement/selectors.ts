import { RootState } from '../../app/store';
import User from './types/User';

export const selectUsers = (state: RootState): User[] => state.users.users;
export const selectError = (state: RootState): string | undefined => state.users.error;
