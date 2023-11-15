import { RootState } from '../../app/store';
import Submission from './types/Submisson';

export const selectSubmissions = (state: RootState): Submission[] => state.submissions.submissions;
export const selectSubmission = (state: RootState): Submission => state.submissions.submission;
export const selectSubmissionError = (state: RootState): string | undefined =>
	state.submissions.error;
