import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
// import React, { useState } from "react";

function NavBar() {
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <header className="bg-blue-900/85 backdrop-blur-md py-2 pb-4 font-array sticky top-0 w-full z-10">
        <div className="max-w-full mx-auto px-4 md:px-8">
          <nav className="flex items-center justify-between gap-2 md:gap-5">
            {/* Left Section: Logo and Brand Name */}
            <div className="flex items-end gap-2 md:gap-5">
              <Link to="/home">
                <h1 className="text-[#e8f0e5] font-medium text-3xl md:text-5xl">
                  LangStar
                </h1>
              </Link>
              <div className="text-[#e8f0e5] font-small text-md md:text-xl">
                  English or Spanish?
                </div>
            </div>

            {/* Right Section: Navigation and Profile */}
            <div className="flex items-center gap-3 md:gap-8">
              {/* Navigation Links */}
              <Link to="/pixey">
                <div className="flex font-jersey items-center">
                  <div className="text-[#e8f0e5] font-medium cursor-pointer transition-colors duration-300 hover:text-[#99cceb] text-lg md:text-2xl">
                    Pixey
                  </div>
                </div>
              </Link>
              <Link to="/aboutUs">
                <div className="flex font-jersey items-center">
                  <div className="text-[#e8f0e5] font-medium cursor-pointer transition-colors duration-300 hover:text-[#99cceb] text-lg md:text-2xl">
                    About Us
                  </div>
                </div>
              </Link>

              {/* Profile Section */}
              <div onClick={handleLogout} className="flex items-center">
                <button className="text-white font-jersey border border-white px-3 py-1 md:px-4 md:py-1 rounded-full transition duration-300 hover:bg-[#960909] hover:text-white text-base md:text-lg">
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default NavBar;
