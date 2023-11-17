//
export default interface ErrorResponse {
	errors?: [{ field: string; rejectedValue: string; message: string }];
	message?: string;
}
