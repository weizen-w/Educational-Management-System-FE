import Submission from './Submisson';

export default interface SubmissionsState {
	submissions: Submission[];
	error?: string;
}
