import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api';

export const uploadFile = createAsyncThunk('file/uploadFile', async (file: File) =>
	api.addFile(file)
);
