import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import usersReduser from '../features/userManagement/usersSlice';
import coursesSlice from '../features/courses/coursesSlice';

export const store = configureStore({
	reducer: {
		auth: authSlice,
		users: usersReduser,
		courses: coursesSlice,
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
