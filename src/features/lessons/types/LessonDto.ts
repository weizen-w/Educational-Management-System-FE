export default interface LessonDto {
	lessonId: number;
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
