export default interface LessonDto {
	id: number;
	groupId: number;
	lessonTitle: string;
	lessonDescription: string;
	lessonType: string;
	teacherId: number;
	lessonDate: string;
	startTime: string;
	endTime: string;
	moduleId: number;
	linkLms: string;
	linkZoom: string;
	archived: boolean;
}
