import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from './editor/EditorToolbar';
import stylesEditor from './editor/Editor.module.css';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { createSubmissionByLesson, resetSubmissionError } from './submissionsSlice';
import styles from './styles/Submission.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Lesson from '../lessons/types/Lesson';
import Homework from './Homework';

interface Event {
	lesson: Lesson;
	start: Date;
	end: Date;
	title: string;
}

export default function SubmissionCreate(): JSX.Element {
	const location = useLocation();
	const state: { event: Event; lesson: Lesson } = location.state;
	const lesson: Lesson = state.lesson;
	const event: Event = state.event;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [description, setDescription] = useState<string>('');
	const [errorsObj, setErrorsObj] = useState({
		descriptionError: '',
	});

	const handleSubmitCreate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setErrorsObj({
				descriptionError: '',
			});

			if (!description.trim()) {
				setErrorsObj({
					descriptionError: 'The description cannot be empty or only spaces',
				});
				hasError = true;
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(createSubmissionByLesson({ lessonId: lesson.lessonId, description }))
					.unwrap()
					.then((submission) =>
						navigate('/account/lessons/lesson/submission', { state: { event, submission } })
					);
				setErrorsObj({
					descriptionError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, description]
	);

	const handleChangeDescription = (textValue: string): void => {
		dispatch(resetSubmissionError());
		setDescription(textValue);
	};

	return (
		<div className={styles.solutionBlock}>
			<h2>Create solution</h2>
			<Homework />
			<form className="auth-form row g-1" onSubmit={handleSubmitCreate}>
				<div className={stylesEditor.textEditor}>
					{errorsObj.descriptionError && (
						<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
							{errorsObj.descriptionError}
						</div>
					)}
					<EditorToolbar />
					<ReactQuill
						theme="snow"
						value={description}
						onChange={handleChangeDescription}
						placeholder={'Enter text or link to solution here...'}
						modules={modules}
						formats={formats}
					/>
				</div>
				<div className="col-md-2 row g-1">
					<button type="submit" className="btn btn-primary">
						Send
					</button>
					<button type="submit" className="btn btn-danger" onClick={() => navigate(-1)}>
						Back
					</button>
				</div>
			</form>
		</div>
	);
}
