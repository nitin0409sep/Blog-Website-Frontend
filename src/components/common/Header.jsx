import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContextProvider";
import { deleteUserData } from "../utils/customhooks/useLocalstorage";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, setUser, role } = useUserContext();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setUser(false);
    deleteUserData();
    navigate("/auth/login");
    setMobileOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
      isActive
        ? "text-white bg-white/10"
        : "text-slate-300 hover:text-white hover:bg-white/5"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
      isActive
        ? "text-white bg-indigo-500/20 border border-indigo-500/30"
        : "text-slate-300 hover:text-white hover:bg-white/5"
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/public"
            className="flex items-center gap-2 group"
            onClick={closeMobile}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
              BlogSpace
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/public" className={linkClass}>
              Explore
            </NavLink>

            {!user && (
              <>
                <NavLink to="/auth/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/auth/register" className={linkClass}>
                  Register
                </NavLink>
              </>
            )}

            {role === "user" && user && (
              <>
                <NavLink to="/user/add-post" className={linkClass}>
                  New Post
                </NavLink>
                <NavLink to="/user/view-posts" className={linkClass}>
                  My Posts
                </NavLink>
              </>
            )}

            {user && role === "admin" && (
              <>
                <NavLink to="/admin/create-user" className={linkClass}>
                  Create User
                </NavLink>
                <NavLink to="/admin/user-list" className={linkClass}>
                  Users
                </NavLink>
              </>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 border-t border-white/10 bg-slate-900/90 backdrop-blur-xl">
          <NavLink to="/public" className={mobileLinkClass} onClick={closeMobile}>
            Explore
          </NavLink>

          {!user && (
            <>
              <NavLink to="/auth/login" className={mobileLinkClass} onClick={closeMobile}>
                Login
              </NavLink>
              <NavLink to="/auth/register" className={mobileLinkClass} onClick={closeMobile}>
                Register
              </NavLink>
            </>
          )}

          {role === "user" && user && (
            <>
              <NavLink to="/user/add-post" className={mobileLinkClass} onClick={closeMobile}>
                New Post
              </NavLink>
              <NavLink to="/user/view-posts" className={mobileLinkClass} onClick={closeMobile}>
                My Posts
              </NavLink>
            </>
          )}

          {user && role === "admin" && (
            <>
              <NavLink to="/admin/create-user" className={mobileLinkClass} onClick={closeMobile}>
                Create User
              </NavLink>
              <NavLink to="/admin/user-list" className={mobileLinkClass} onClick={closeMobile}>
                Users
              </NavLink>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
