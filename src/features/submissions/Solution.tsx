import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from './editor/EditorToolbar';
import stylesEditor from './editor/Editor.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Submission from './types/Submisson';
import { resetSubmissionError, updateSubmission } from './submissionsSlice';
import styles from './styles/Submission.module.css';
import { selectSubmissions } from './selectors';
import { SubmissionStatus } from './types/SubmissionStatus';
import { selectUser } from '../auth/selectors';

interface Props {
	submission: Submission;
}

export default function Solution(props: Props): JSX.Element {
	const { submission } = props;
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const submissions = useAppSelector(selectSubmissions);
	const [currSubmission, setCurrSubmission] = useState<Submission>(submission);
	const [newSubmission, setNewSubmission] = useState<Submission>({
		submission_id: 0,
		description: submission.description,
		lesson_id: submission.lesson_id,
		student_id: submission.student_id,
		submission_state: submission.submission_state,
		archived: submission.archived,
	});
	const [errorsObj, setErrorsObj] = useState({
		submission_idError: '',
		descriptionError: '',
	});

	const getCurrSubmission = (): void => {
		const findedSubmission = submissions.find((s) => s.submission_id === submission.submission_id);
		if (findedSubmission) {
			setCurrSubmission(findedSubmission);
		}
	};

	const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		setCurrSubmission({
			...currSubmission,
			submission_state: event.target.value,
		});
		dispatch(
			updateSubmission({
				...currSubmission,
				submission_state: event.target.value,
			})
		);
	};

	const handleEditClick = (newId: number): void => {
		setNewSubmission({ ...newSubmission, submission_id: newId });
	};

	const handleCancel = (): void => {
		setNewSubmission({
			submission_id: 0,
			description: currSubmission.description,
			lesson_id: currSubmission.lesson_id,
			student_id: currSubmission.student_id,
			submission_state: currSubmission.submission_state,
			archived: currSubmission.archived,
		});
		handleEditClick(0);
	};

	const handleSubmitUpdate = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setErrorsObj({
				submission_idError: '',
				descriptionError: '',
			});

			// eslint-disable-next-line @typescript-eslint/naming-convention
			const { submission_id, description } = newSubmission;
			if (submission_id < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					submission_idError: 'ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (!description.trim()) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					descriptionError: 'The name cannot be empty or only spaces',
				}));
				hasError = true;
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(
					updateSubmission({
						submission_id: currSubmission.submission_id,
						description: newSubmission.description,
						lesson_id: currSubmission.lesson_id,
						student_id: currSubmission.student_id,
						submission_state: currSubmission.submission_state,
						archived: currSubmission.archived,
					})
				);
				handleEditClick(0);
				setErrorsObj({
					submission_idError: '',
					descriptionError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, newSubmission]
	);

	const handleChangeDescription = (textValue: string): void => {
		dispatch(resetSubmissionError());
		setNewSubmission((prevNewSubmission) => ({
			...prevNewSubmission,
			description: textValue,
		}));
	};

	useEffect(() => {
		getCurrSubmission();
	}, [dispatch]);

	return (
		<div className={styles.solutionBlock}>
			<h2>Solution</h2>
			<h4
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '10px',
					backgroundColor: 'lightskyblue',
					padding: '10px',
				}}
			>
				<span>Status: </span>
				<select
					style={{ maxWidth: '150px' }}
					className="form-select form-select-sm"
					name="submission_state"
					value={currSubmission.submission_state}
					onChange={handleChangeStatus}
				>
					<option value="" disabled hidden>
						Select state...
					</option>
					{Object.keys(SubmissionStatus).map((key) => (
						<option key={key} value={SubmissionStatus[key as keyof typeof SubmissionStatus]}>
							{SubmissionStatus[key as keyof typeof SubmissionStatus]}
						</option>
					))}
				</select>
			</h4>

			{newSubmission.description.length === 0 ? (
				<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
					<div className={stylesEditor.textEditor}>
						{errorsObj.descriptionError && (
							<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
								{errorsObj.descriptionError}
							</div>
						)}
						<EditorToolbar />
						<ReactQuill
							theme="snow"
							value={newSubmission.description}
							onChange={handleChangeDescription}
							placeholder={'Enter text or link to solution here...'}
							modules={modules}
							formats={formats}
						/>
					</div>
					<div className="col-md-2 row g-1">
						<button type="submit" className="btn btn-success">
							Send
						</button>
					</div>
				</form>
			) : (
				<>
					{newSubmission.submission_id !== currSubmission.submission_id ? (
						<div className={stylesEditor.textEditor}>
							<EditorToolbar />
							<ReactQuill
								readOnly
								theme="snow"
								value={newSubmission.description}
								modules={modules}
								formats={formats}
							/>
							{(user?.role === 'STUDENT' || user?.role === 'ADMIN') && (
								<button
									type="button"
									className="btn btn-outline-dark col-md-1 m-2"
									onClick={() => handleEditClick(currSubmission.submission_id)}
								>
									Edit
								</button>
							)}
						</div>
					) : (
						<form className="auth-form row g-1" onSubmit={handleSubmitUpdate}>
							<div className={stylesEditor.textEditor}>
								{errorsObj.descriptionError && (
									<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
										{errorsObj.descriptionError}
									</div>
								)}
								<EditorToolbar />
								<ReactQuill
									theme="snow"
									value={newSubmission.description}
									onChange={handleChangeDescription}
									placeholder={newSubmission.description}
									modules={modules}
									formats={formats}
								/>
							</div>
							<div className="col-md-2 m-2">
								<button type="submit" className="btn btn-success">
									Save
								</button>
								<button className="btn btn-danger" onClick={handleCancel}>
									Cancel
								</button>
							</div>
						</form>
					)}
				</>
			)}
		</div>
	);
}
