import { RootState } from '../../app/store';
import User from '../auth/types/User';

export const selectUsers = (state: RootState): User[] => state.users.users;
export const selectUserErrors = (state: RootState): string | undefined => state.users.error;
