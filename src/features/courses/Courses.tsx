/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourses } from './selectors';
import { loadCourses, updateCourse } from './coursesSlice';
import Course from './types/Course';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

export default function Courses(): JSX.Element {
	const courses = useAppSelector(selectCourses);
	const dispatch = useAppDispatch();
	const [courseState, setCourseState] = useState<Course>({
		id: 0,
		name: '',
		archived: false,
	});
	const [editCourseId, setEditCourseId] = useState<number>(0);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, courseId: number): void => {
		const { name, value } = e.target;
		setCourseState((prevState) => ({
			...prevState,
			id: courseId,
			[name]: value,
		}));
	};

	const handleEditClick = (id: number): void => {
		setEditCourseId(id);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		dispatch(updateCourse(courseState));
		setEditCourseId(0);
	};

	useEffect(() => {
		dispatch(loadCourses());
	}, [dispatch]);

	return (
		<>
			<div>Courses</div>
			<ul>
				{courses?.map((course) => (
					<li key={course.id}>
						<div>
							{editCourseId !== course.id ? (
								<>
									<span>
										<b>Title: </b>
										{course.name}
									</span>
									<span>
										<b>, is archived: </b>
										{course.archived.toString()}
									</span>
									<EditIcon onClick={() => handleEditClick(course.id)} />
									<ArchiveIcon
										onClick={() => {
											dispatch(
												updateCourse({
													id: course.id,
													name: course.name,
													archived: !course.archived,
												})
											);
										}}
									/>
								</>
							) : (
								<form onSubmit={handleSubmit}>
									<input
										type="text"
										onChange={(e) => handleInputChange(e, course.id)}
										defaultValue={course.name}
										name="name"
										placeholder="Course name"
									/>
									<button type="submit">Save</button>
								</form>
							)}
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
