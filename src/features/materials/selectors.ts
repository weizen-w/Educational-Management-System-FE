import { RootState } from '../../app/store';
import Material from './types/Material';

export const selectMaterials = (state: RootState): Material[] => state.materials.materials;
export const selectMaterialsError = (state: RootState): string | undefined => state.materials.error;
