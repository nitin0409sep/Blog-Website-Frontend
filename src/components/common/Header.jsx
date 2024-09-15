import React from "react";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContextProvider";
import { deleteUserData } from "../utils/customhooks/useLocalstorage";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, setUser, role } = useUserContext();
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    // Change the state in Contexts
    setUser(false);

    // Clear Local Storage
    deleteUserData();

    // Navigate to Login Once Person Logout's
    navigate("/auth/login");
  };

  return (
    <>
      <nav className="w-full flex gap-14 items-center justify-center p-5 text-2xl bg-[#313131] fixed z-10 border-b">
        {/* Public */}
        <NavLink
          to="/public"
          style={({ isActive }) => {
            return {
              color: isActive ? "white" : "",
            };
          }}
          className="font-medium 
            text-blue-400 font-serif cursor-pointer
                      hover:scale-100 hover:text-white transform transition-all duration-300 ease-in-out hover:rounded-t-none"
        >
          Public
        </NavLink>

        <NavLink
          to="/auth/login"
          style={({ isActive }) => ({
            color: isActive ? "white" : "",
            display: user ? "none" : "block",
          })}
          className="font-medium 
          text-blue-400 font-serif cursor-pointer
                    hover:scale-100 hover:text-white transform transition-all duration-300 ease-in-out hover:rounded-t-none"
        >
          Login
        </NavLink>

        <NavLink
          to="/auth/register"
          style={({ isActive }) => {
            return {
              color: isActive ? "white" : "",
              display: user ? "none" : "block",
            };
          }}
          className="font-medium 
          text-blue-400 font-serif cursor-pointer
                    hover:scale-100 hover:text-white transform transition-all duration-300 ease-in-out hover:rounded-t-none"
        >
          Register
        </NavLink>

        {/* User */}
        {role === "user" && user && (
          <NavLink
            to="/addPost"
            style={({ isActive }) => {
              return {
                color: isActive ? "white" : "",
                display: !user ? "none" : "block",
              };
            }}
            className="font-medium 
          text-blue-400 font-serif cursor-pointer
                    hover:scale-100 hover:text-white transform transition-all duration-300 ease-in-out hover:rounded-t-none"
          >
            Add Post
          </NavLink>
        )}

        {role === "user" && user && (
          <NavLink
            to="/viewPosts"
            style={({ isActive }) => {
              return {
                color: isActive ? "white" : "",
                display: !user ? "none" : "block",
              };
            }}
            className="font-medium 
            text-blue-400 font-serif cursor-pointer
                      hover:scale-100 hover:text-white transform transition-all duration-300 ease-in-out hover:rounded-t-none"
          >
            View Posts
          </NavLink>
        )}

        {/* Admin */}
        {user && role === "admin" && (
          <NavLink
            to="/createUser"
            style={({ isActive }) => {
              return {
                color: isActive ? "white" : "",
                display: !user ? "none" : "block",
              };
            }}
            className="font-medium 
            text-blue-400 font-serif cursor-pointer
                      hover:scale-100 hover:text-white transform transition-all duration-300 ease-in-out hover:rounded-t-none"
          >
            Create User
          </NavLink>
        )}
        {user && role === "admin" && (
          <NavLink
            to="/userList"
            style={({ isActive }) => {
              return {
                color: isActive ? "white" : "",
                display: !user ? "none" : "block",
              };
            }}
            className="font-medium 
          text-blue-400 font-serif cursor-pointer
                    hover:scale-100 hover:text-white transform transition-all duration-300 ease-in-out hover:rounded-t-none"
          >
            View Users
          </NavLink>
        )}
        {user && (
          <div
            className="font-medium 
          text-blue-400 font-serif cursor-pointer
                    hover:scale-100 hover:text-white transform transition-all duration-300 ease-in-out hover:rounded-t-none"
            onClick={handleLogout}
          >
            Logout
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
