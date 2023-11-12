import { RootState } from '../../app/store';
import Submission from './types/Submisson';

export const selectSubmissions = (state: RootState): Submission[] => state.submissions.submissions;
export const selectSubmissionError = (state: RootState): string | undefined =>
	state.submissions.error;
