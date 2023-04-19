import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Notification Toast 
import { Toaster } from "react-hot-toast";

// Common Custom Components
import Home from './pages/Home';
import Navbar from './components/common/Navbar';
import Footer from "./components/common/Footer";
import Contact from './components/common/Contact';

// Auth Custom Components
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ResetPassword from "./components/auth/ResetPassword";
import NewPassword from './components/auth/NewPassword';
import BecomePartner from './components/auth/BecomePartner';

// Candidate Custom Components
import CandidateProfile from './components/candidate/CandidateProfile';
import ResumeParse from './components/candidate/ResumeParse';
import CandidateConsole from './components/candidate/CandidateConsole';

// Employer Custom Components
import EmployerProfile from './components/employer/EmployerProfile';
import EmployerExplore from "./components/employer/EmployerExplore";
import AuctionWindow from "./components/employer/AuctionWindow";
import EmployerConsole from './components/employer/EmployerConsole';
import FindCandidateConsole from './components/employer/FindCandidateConsole';
import OfferStage from './components/employer/OfferStage';
import RegisterTeamMember from './components/employer/RegisterTeamMember';

// Common Styles
import "./styles/Common.css";

// API Statuses
export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading"
});

const App = () => {
  const { pathname } = useLocation();

  // modals for desktop, sidebar for mobile

  // states & handlers for login (modal + sidebar)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginSidebar, setShowLoginSidebar] = useState(false);
  const handleLoginModalOpen = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleLoginSidebarOpen = () => setShowLoginSidebar(true);
  const handleLoginSidebarClose = () => setShowLoginSidebar(false);

  // states & handlers for signup (modal + sidebar)
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSignupSidebar, setShowSignupSidebar] = useState(false);
  const handleSignupModalOpen = () => setShowSignupModal(true);
  const handleSignupModalClose = () => setShowSignupModal(false);
  const handleSignupSidebarOpen = () => setShowSignupSidebar(true);
  const handleSignupSidebarClose = () => setShowSignupSidebar(false);

  // states & handlers for reset password (modal + sidebar)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showResetPasswordSidebar, setShowResetPasswordSidebar] = useState(false);
  const handleResetPasswordModalOpen = () => setShowResetPasswordModal(true);
  const handleResetPasswordModalClose = () => setShowResetPasswordModal(false);
  const handleResetPasswordSidebarOpen = () => setShowResetPasswordSidebar(true);
  const handleResetPasswordSidebarClose = () => setShowResetPasswordSidebar(false);

  return (
    <>
      {/* Notification (Toast) */}
      <Toaster />

      {/* Header */}
      {pathname !== "/" ?
        <Navbar
          handleLoginModalOpen={handleLoginModalOpen}
          handleLoginSidebarOpen={handleLoginSidebarOpen}
          handleSignupModalOpen={handleSignupModalOpen}
          handleSignupSidebarOpen={handleSignupSidebarOpen}
        />
        : ""
      }

      {/* Main Content */}
      <main style={{ minHeight: "60vh" }}>
        <Routes>
          {/* Common & Auth Routes */}
          <Route
            path="/"
            element={<Home handleLoginModalOpen={handleLoginModalOpen}
              handleLoginSidebarOpen={handleLoginSidebarOpen}
              handleSignupModalOpen={handleSignupModalOpen}
              handleSignupSidebarOpen={handleSignupSidebarOpen} />}
          />
          <Route path="/become-partner" element={<BecomePartner handleLoginModalOpen={handleLoginModalOpen} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/change-password/:token" element={<NewPassword />} />

          {/* Candidate Specific Routes */}
          <Route path="/candidate-profile" element={<CandidateProfile />} />
          <Route path="/resume-parse" element={<ResumeParse />} />
          <Route path="/candidate-console" element={<CandidateConsole />} />

          {/* Employer Specific Routes */}
          <Route path="/employer-profile" element={<EmployerProfile />} />
          <Route path="/role-based-auctions" element={<EmployerExplore />} />
          <Route path="/auction/:auction_id" element={<AuctionWindow />} />
          <Route path="/find-candidate" element={<FindCandidateConsole />} />
          <Route path="/employer-console" element={<EmployerConsole />} />
          <Route path="/offer-stage/:auction_id" element={<OfferStage />} />
          <Route path="/register-member/:token" element={<RegisterTeamMember />} />

          {/* Redirect to 404 Route or to Home */}
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Login, Signup, ResetPassword Modal */}
      <Login
        showLoginModal={showLoginModal}
        handleLoginModalOpen={handleLoginModalOpen}
        handleLoginModalClose={handleLoginModalClose}
        showLoginSidebar={showLoginSidebar}
        handleLoginSidebarOpen={handleLoginSidebarOpen}
        handleLoginSidebarClose={handleLoginSidebarClose}
        handleSignupModalOpen={handleSignupModalOpen}
        handleSignupModalClose={handleSignupModalClose}
        handleSignupSidebarOpen={handleSignupSidebarOpen}
        handleSignupSidebarClose={handleSignupSidebarClose}
        handleResetPasswordModalOpen={handleResetPasswordModalOpen}
        handleResetPasswordSidebarOpen={handleResetPasswordSidebarOpen}
      />
      <Signup
        showSignupModal={showSignupModal}
        handleSignupModalOpen={handleSignupModalOpen}
        handleSignupModalClose={handleSignupModalClose}
        showSignupSidebar={showSignupSidebar}
        handleSignupSidebarOpen={handleSignupSidebarOpen}
        handleSignupSidebarClose={handleSignupSidebarClose}
        handleLoginModalOpen={handleLoginModalOpen}
        handleLoginModalClose={handleLoginModalClose}
        handleLoginSidebarOpen={handleLoginSidebarOpen}
        handleLoginSidebarClose={handleLoginSidebarClose}
      />
      <ResetPassword
        showResetPasswordModal={showResetPasswordModal}
        showResetPasswordSidebar={showResetPasswordSidebar}
        handleResetPasswordModalClose={handleResetPasswordModalClose}
        handleResetPasswordSidebarClose={handleResetPasswordSidebarClose}
        handleLoginModalOpen={handleLoginModalOpen}
        handleLoginSidebarOpen={handleLoginSidebarOpen}
      />

      {/* Footer */}
      <Footer />
    </>
  )
}

export default App;