import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/">✈️ Travel Itinerary Planner</Link>
          </h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/itineraries/new" className="nav-link btn-primary">New Itinerary</Link>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2024 Travel Itinerary Planner. Built with React, TypeScript & Vite.</p>
      </footer>
    </div>
  );
};

export default Layout;
