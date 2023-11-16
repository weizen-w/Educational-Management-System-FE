export default interface Comment {
	comment_id: number;
	submission_id: number;
	author_id: number;
	messageText: string;
	messageDate: string;
	archived: boolean;
}
