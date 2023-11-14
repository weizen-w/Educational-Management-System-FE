import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AttendancesState from './types/AttendancesState';
import * as api from './api';
import Attendance from './types/Attendance';

const initialState: AttendancesState = {
	attendances: [],
	error: undefined,
};

export const loadAttendancesByUser = createAsyncThunk(
	'attendances/loadAttendancesByUser',
	async (userId: number) => api.getAllByUser(userId)
);

export const loadAttendancesByAuthUser = createAsyncThunk(
	'attendances/loadAttendancesByAuthUser',
	() => api.getAllByAuthUser()
);

export const loadAttendancesByLesson = createAsyncThunk(
	'attendances/loadAttendancesByLesson',
	async (lessonId: number) => api.getAllByLesson(lessonId)
);

export const updateAttendance = createAsyncThunk(
	'attendances/updateAttendance',
	async (attendance: Attendance) => api.updateAttendance(attendance.attendance_id, attendance)
);

const attendancesSlice = createSlice({
	name: 'attendances',
	initialState,
	reducers: {
		resetAttendanceError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadAttendancesByUser.fulfilled, (state, action) => {
				state.attendances = action.payload;
			})
			.addCase(loadAttendancesByUser.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(loadAttendancesByAuthUser.fulfilled, (state, action) => {
				state.attendances = action.payload;
			})
			.addCase(loadAttendancesByAuthUser.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(loadAttendancesByLesson.fulfilled, (state, action) => {
				state.attendances = action.payload;
			})
			.addCase(loadAttendancesByLesson.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateAttendance.fulfilled, (state, action) => {
				state.attendances = state.attendances.map((attendance) =>
					attendance.attendance_id === action.payload.attendance_id ? action.payload : attendance
				);
			})
			.addCase(updateAttendance.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetAttendanceError: resetAttendanceError } = attendancesSlice.actions;

export default attendancesSlice.reducer;
