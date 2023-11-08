import { RootState } from '../../app/store';
import Module from './types/Module';

export const selectModules = (state: RootState): Module[] => state.moduls.modules;
export const selectModuleError = (state: RootState): string | undefined => state.moduls.error;
