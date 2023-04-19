import React, { useState, useEffect } from "react";
import "../../styles/Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Media & Icons
import { BiMenu, BiBell, BiRevision } from "react-icons/bi";
import { FaFacebook, FaTwitter, FaLinkedin, FaPinterest } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";

// Helpers
import { isAuthenticated } from "../../helpers/Auth";
import { STATUSES } from "../../App";
import Loader from "./Loader";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAllNotifications, logoutUser } from "../../store/authSlice";

const Navbar = ({
  isBanner,
  handleLoginModalOpen,
  handleLoginSidebarOpen,
  handleSignupModalOpen,
  handleSignupSidebarOpen,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { status, notifications } = useSelector((state) => state.auth);

  // states
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [userNotifications, setUserNotifications] = useState([]);

  // fetch all user notifications
  useEffect(() => {
    // first time, fetch notifications immediately then after interval
    const getNotifications = (callback) => {
      callback();
      return setInterval(callback, 100000);
    };

    const myInterval = getNotifications(() => {
      if (isAuthenticated()?.userType === "E") dispatch(fetchNotifications());
    });

    return () => {
      clearInterval(myInterval);
    };
  }, [dispatch]);

  // load notifications once get from store
  useEffect(() => {
    setUserNotifications([...notifications]);
  }, [notifications]);

  // handle open & close notification offcanvas
  const handleNotificationOpen = () => setShowNotificationModal(true);
  const handleNotificationClose = () => setShowNotificationModal(false);

  // get date-time in formatted way
  const getDateFormatted = (dt) => {
    try {
      const date = new Date(dt);
      return date?.toLocaleString();
    } catch (err) {
      console.log(err);
      return "";
    }
  };

  // navbar profile-name methods
  const getFirstChar = (name) => name.substr(0, 1);
  const getFirstStr = (name) => name.split(" ")[0];

  // handle logout option
  const HandleLogout = () => {
    dispatch(
      logoutUser(() => {
        navigate("/");
      })
    );
  };

  return (
    <>
      {/* Navbar Desktop Topbar */}
      <nav
        className="navbar navbar-expand-md px-lg-5 px-3"
        style={{ background: isBanner ? "transparent" : "#0f643b" }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
            aria-controls="mobileSidebar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <BiMenu className="navbar__toggler__icon" />
          </button>
          <Link to="/" className="navbar-brand text-lg-start text-center">
            Know Your Worth.
          </Link>
          <Link to="#" className="mobile__join__btn" onClick={handleSignupSidebarOpen}>
            Join
          </Link>

          <div className="collapse navbar-collapse">
            {/* User Specific NavLinks (if Employer, elif Candidate, else LoggedOut) */}
            {isAuthenticated()?.userType === "E" ? (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to="/role-based-auctions"
                    className={`nav-link ${pathname === "/role-based-auctions" ? "active" : ""}`}
                  >
                    Explore
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/find-candidate" className={`nav-link ${pathname === "/find-candidate" ? "active" : ""}`}>
                    Find Candidate
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/employer-console"
                    className={`nav-link ${pathname === "/employer-console" ? "active" : ""}`}
                  >
                    Console
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <div className="_">
                    <Link
                      className={`nav-link dropdown-toggle d-flex align-items-center`}
                      to="#"
                      id="navbarDropdownEmployer"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="profile__icon__box">
                        <div className="navbar__profile__icon">
                          <span className={`${pathname === "/employer-profile" ? "text-white" : ""}`}>
                            {getFirstChar(isAuthenticated().first_name)}
                          </span>
                        </div>
                      </div>
                      <span className={`${pathname === "/employer-profile" ? "text-white" : ""}`}>
                        Hi {getFirstStr(isAuthenticated().first_name)}
                      </span>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdownEmployer">
                      <li>
                        <Link className="dropdown-item" to="/employer-profile">
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item" onClick={HandleLogout}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="nav-item">
                  <Link
                    to="#"
                    className="notification__icon position-relative"
                    onClick={() => {
                      if (showNotificationModal) handleNotificationClose();
                      else handleNotificationOpen();
                    }}
                  >
                    <BiBell className="icon" />
                    <span className="position-absolute top-0 start-100 translate-middle rounded-circle badge">
                      {userNotifications?.length || 0}
                    </span>
                  </Link>
                </li>
              </ul>
            ) : isAuthenticated()?.userType === "C" ? (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {isAuthenticated().screening_stages !== "Email Verified" && (
                  <li className="nav-item">
                    <Link
                      to="/candidate-console"
                      className={`nav-link ${pathname === "/candidate-console" ? "active" : ""}`}
                    >
                      My Console
                    </Link>
                  </li>
                )}

                <li className="nav-item dropdown">
                  <div className="_">
                    <Link
                      className={`nav-link dropdown-toggle d-flex align-items-center`}
                      to="#"
                      id="navbarDropdownCandidate"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="profile__icon__box">
                        <div className="navbar__profile__icon">
                          <span className={`${pathname === "/employer-profile" ? "text-white" : ""}`}>
                            {getFirstChar(isAuthenticated().first_name)}
                          </span>
                        </div>
                      </div>
                      <span className={`${pathname === "/candidate-profile" ? "text-white" : ""}`}>
                        Hi {isAuthenticated().first_name}
                      </span>
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdownCandidate">
                      {isAuthenticated().screening_stages !== "Email Verified" && (
                        <>
                          <li>
                            <Link className="dropdown-item" to={"/candidate-profile"}>
                              My Profile
                            </Link>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                        </>
                      )}

                      <li>
                        <Link to="#" className="dropdown-item" onClick={HandleLogout}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                {/* <li className="nav-item">
                  <Link
                    to="#"
                    className="notification__icon position-relative"
                    onClick={() => {
                      if (showNotificationModal) handleNotificationClose();
                      else handleNotificationOpen();
                    }}
                  >
                    <BiBell className="icon" />
                    <span className="position-absolute top-0 start-100 translate-middle rounded-circle badge">
                      {userNotifications?.length || 0}
                    </span>
                  </Link>
                </li> */}
              </ul>
            ) : (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className={`nav-link ${pathname === "/" ? "active" : ""}`} to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${pathname === "/become-partner" ? "active" : ""}`} to="/become-partner">
                    Become Partner
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#" onClick={handleLoginModalOpen}>
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-4 ms-3 navbar__join__btn" to="#" onClick={handleSignupModalOpen}>
                    Join
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Navbar Mobile Sidebar */}
      <div
        className="offcanvas offcanvas-start pt-2"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <button type="button" className="btn" onClick={handleSignupSidebarOpen}>
            Join Kyw.
          </button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-group">
            <li className="list-group-item" onClick={handleLoginSidebarOpen} data-bs-dismiss="offcanvas">
              Sign In
            </li>
            <li className={`list-group-item`} data-bs-dismiss="offcanvas">
              Explore
            </li>
            <li className="list-group-item" data-bs-dismiss="offcanvas">
              Become Partner
            </li>
          </ul>

          <div className="sidebar__social__media mt-sm-4 mt-3">
            <div className="pt-1">
              <a href="/#">
                <FaTwitter />
              </a>
              <a href="/#">
                <FaLinkedin />
              </a>
              <a href="/#">
                <FaFacebook />
              </a>
              <a href="/#">
                <FaPinterest />
              </a>
              <a href="/#">
                <BsInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Sidebar Offcanvas */}
      <div
        className="notification__box"
        style={{ display: showNotificationModal ? "block" : "none" }}
        onMouseOver={handleNotificationOpen}
        onMouseOut={handleNotificationClose}
      >
        <div className="notification__header">
          <div className="d-flex align-items-center gap-3">
            <h6>Recent Notification</h6>
            <Link
              to="#"
              onClick={() => {
                dispatch(markAllNotifications());
              }}
              className="mark__all__read__link"
            >
              Mark all as read
            </Link>
          </div>
          <BiRevision
            title="Refresh"
            className="refresh"
            onClick={() => {
              dispatch(fetchNotifications());
            }}
          />
        </div>
        <div className="notification__body" style={{ maxHeight: "60vh" }}>
          {status !== STATUSES.LOADING ? (
            <div>
              {userNotifications?.length > 0 ? (
                <>
                  {[...userNotifications].map((item, idx) => {
                    return (
                      <div
                        className="notification__item"
                        style={{ background: "#f6f6f6" }}
                        key={`notification_${idx + 1}`}
                      >
                        <span className="info">{item?.message}</span>
                        <span className="time">{getDateFormatted(item?.created_date)}</span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="notification__item no_notifications">
                  <p className="info text-center pt-3">No notifications here...</p>
                </div>
              )}
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
