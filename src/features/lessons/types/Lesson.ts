export default interface Lesson {
	id: number;
	groupId: number;
	lessonTitle: string;
	lessonDescription: string;
	lessonType: string;
	teacher: {
		id: number;
		password: string;
		firstName: string;
		lastName: string;
		email: string;
		role: string;
		state: string;
		photoLink: string;
	};
	lessonDate: string;
	startTime: string;
	endTime: string;
	module: {
		id: number;
		name: string;
		archived: boolean;
	};
	linkLms: string;
	linkZoom: string;
	archived: boolean;
}