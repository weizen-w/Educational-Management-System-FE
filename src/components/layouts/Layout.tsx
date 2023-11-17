import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import MainPage from '../main/MainPage';
import './Layout.css';

function Main(): JSX.Element {
	const location = useLocation();

	return (
		<>
			<header>header</header>
			<div className="layout-page">
				<div className="layout-left-navbar">
					<Navbar />
				</div>
				<div className="layout-main">
					<div className="layout-main-content">
						{location.pathname === '/' ? <MainPage /> : <Outlet />}
					</div>
				</div>
			</div>
		</>
	);
}

export default Main;
