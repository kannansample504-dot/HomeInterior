import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/how-it-works', label: 'How It Works' },
];

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-headline text-xl font-black text-on-surface">
          Home Interior
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-primary font-bold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-xl">person</span>
                <span className="text-sm font-semibold text-on-surface">{user?.name}</span>
                <span className="material-symbols-outlined text-sm text-secondary">expand_more</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-ambient py-2 z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-primary font-semibold text-sm">Login</Link>
              <Link
                to="/estimate"
                className="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary shadow-lg shadow-blue-500/10 transition-all"
              >
                Get Free Estimate
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="material-symbols-outlined text-on-surface text-2xl">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-surface-container-low px-4 py-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-2 text-sm font-medium text-on-surface"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block py-2 text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2 text-sm font-medium text-error">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/estimate" className="block mt-2 bg-primary-container text-on-primary px-6 py-2.5 rounded-xl font-semibold text-sm text-center" onClick={() => setMobileOpen(false)}>Get Free Estimate</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
