# Project "Educational Management System"

## Project Description

Welcome to the "Educational Management System," an innovative platform designed and developed to transform the educational process. Our goal is to provide modern solutions for efficient management of the educational process, attendance tracking, homework management, and scheduling for both students and educators.

### Key Features

#### 1. Lecture Management
Effortlessly organize lectures with detailed information including:
- **Title**: Informative titles for lectures.
- **Description**: Detailed contextual descriptions.
- **Date and Time**: Precise scheduling for an efficient learning environment.

#### 2. Attendance Tracking
Thorough monitoring of student attendance during lectures, providing:
- Tools for evaluating student engagement.
- Effective tracking of their progress.

#### 3. Homework Management
A system for viewing, submitting, and grading homework, comprising:
- **Assignment Review**: Detailed descriptions, requirements, and materials.
- **Submission**: A feature allowing students to submit their solutions for assessment.
- **Grading**: Tools for educators to review and grade completed assignments.

#### 4. Scheduling
Organizing lecture schedules for students and educators, offering:
- Clear overviews of lecture timetables.
- Enhanced planning and management of the educational process.

### Project Advantages

Our project aims not only to manage data but also to create an environment that fosters harmonious interaction between students, educators, and administrators. We aim to provide optimal conditions for effective learning and the creation of a superior educational experience.

Join the "Educational Management System" and help us shape the future of education through this cutting-edge **Educational Management System**.


## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner
- `lint`: - starts the check
- `lint:fix`: - corrects

When you press ctrl/cmd + s - automatic formatting occurs.
If you don't have the Prettier extension installed, install it.

## Proxy
In file `vite.config.ts` a proxy is registered - this is the address to which requests will be sent during development.
```
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
			},
		},
```
