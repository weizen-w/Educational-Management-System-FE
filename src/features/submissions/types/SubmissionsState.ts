import Submission from './Submisson';

export default interface SubmissionsState {
	submissions: Submission[];
	submission: Submission;
	error?: string;
}
