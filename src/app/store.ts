import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import usersReduser from '../features/users/usersSlice';
import coursesSlice from '../features/courses/coursesSlice';
import groupsSlice from '../features/groups/groupsSlice';
import modulesSlice from '../features/modules/modulesSlice';
import lessonsSlice from '../features/lessons/lessonsSlice';
import attendancesSlice from '../features/attendances/attendancesSlice';
import submissionsSlice from '../features/submissions/submissionsSlice';
import commentsSlice from '../features/comments/commentsSlice';
import materialsSlice from '../features/materials/materialsSlice';

export const store = configureStore({
	reducer: {
		auth: authSlice,
		users: usersReduser,
		courses: coursesSlice,
		groups: groupsSlice,
		moduls: modulesSlice,
		lessons: lessonsSlice,
		attendances: attendancesSlice,
		submissions: submissionsSlice,
		comments: commentsSlice,
		materials: materialsSlice,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
