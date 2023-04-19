import React, { useState, useEffect, useRef } from "react";
import "../../styles/AuctionWindow.css";
import "../../styles/EmployerConsole.css";
import "../../styles/EmployerProfile.css";

// React-Bootstrap Components
import { Modal, Button } from "react-bootstrap";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { addEmployerTeamMember, fetchAllTeamMembers, updateTeamMember } from "../../store/authSlice";
import { STATUSES } from "../../App";

// Helper Components
import { ScaleLoader } from "react-spinners";
import Loader from "../common/Loader";
import { validateEmail } from "../../helpers/Utility";
import { getLocalStorage } from "../../helpers/LocalStorage";

// Media & Icons
import { BiPlusCircle, BiX } from "react-icons/bi";
import ApiseroLogo from "../../media/icons/APISERO-logo.svg";

const EmployerProfile = () => {
  const dispatch = useDispatch();
  const { status, employer_team_members } = useSelector((state) => state.auth);
  const employerInfo = getLocalStorage("user");

  // all team-members
  const [allTeamMembers, setAllTeamMembers] = useState([]);

  // team-member add modal
  const memberRef = useRef(null);
  const memberInputRef = useRef(null);

  const [teamMemberModalOpen, setTeamMemberModalOpen] = useState(false);
  const [memberEmailInput, setMemberEmailInput] = useState("");
  const [memberEmails, setMemberEmails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // fetch all team members
  useEffect(() => {
    dispatch(fetchAllTeamMembers());
  }, [dispatch]);

  useEffect(() => {
    setAllTeamMembers([...employer_team_members]);
  }, [employer_team_members]);

  // handle activate/deactivate team member
  const HandleTeamMember = (member_id, member_status) => {
    dispatch(updateTeamMember(member_id, member_status));
  };

  // handle add member input for multiple emails
  const HandleMemberEmailInput = (e) => {
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      // if already exist
      if (memberEmails.includes(memberEmailInput)) {
        setErrorMessage("Email Already Added!");
        memberRef.current.style.border = "2px solid tomato";
      } else if (validateEmail(memberEmailInput)) {
        const emails = [...memberEmails, memberEmailInput];
        setMemberEmails(emails);
        setMemberEmailInput("");
        setErrorMessage("");
        memberRef.current.style.border = "2px solid #0f643b";
      } else {
        setErrorMessage("Invalid Email!");
        memberRef.current.style.border = "2px solid tomato";
      }
    }
    memberInputRef.current.focus();
  };

  // fun to delete any email from input field
  const HandleMemberEmailDelete = (e) => {
    if (e.target !== e.currentTarget) return;
    const id = e.currentTarget.id;
    const emails = memberEmails.filter((email) => {
      return email !== id;
    });
    setMemberEmails(emails);
  };

  // handle submit to add team member for specific employer
  const HandleAddTeamMemberSubmit = () => {
    if (memberEmails?.length < 1) {
      memberRef.current.style.border = "2px solid tomato";
      setErrorMessage("No Emails to Add!");
      return false;
    } else {
      dispatch(addEmployerTeamMember(memberEmails));
      if (status === STATUSES.IDLE) {
        setTimeout(() => {
          setTeamMemberModalOpen(false);
        }, 2500);
      }
      return true;
    }
  };

  return (
    <div className="employer__profile__box mt-4 px-lg-5">
      <div className="container-fluid mb-5 pt-1 px-xl-5 px-sm-4 px-3">
        {/* Employer Member Info */}
        <div className="row section__bg p-sm-4 py-4 px-3 auction__candidate__info" id={employerInfo?.member_id}>
          <div className="col-md-3 col-sm-12 ">
            <div className="employer__logo mb-lg-0 mb-4">
              <img src={ApiseroLogo} alt="Company_Logo" />
            </div>
          </div>
          <div className="col-md-4 col-sm-6 d-sm-flex justify-sm-content-center">
            <div className="employer__content mt-sm-0 mt-4">
              <h3>
                {employerInfo?.first_name} {employerInfo?.last_name}
              </h3>
              <div className="employer__info">
                <p>{employerInfo?.email}</p>
                <p>+91 {employerInfo?.mobile_phone}</p>
                <p className="status__success">
                  Role: <span>{employerInfo?.role}</span>
                </p>
                <p className="status__success">
                  Status: <span>{employerInfo?.status}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-5 col-sm-6 d-sm-flex justify-sm-content-center">
            <div className="employer__content mt-sm-0 mt-4">
              <h3>{employerInfo?.account?.name}</h3>
              <div className="employer__info">
                <p>{employerInfo?.account?.type}</p>
                <p>
                  Company Size: <span>{employerInfo?.account?.number_of_employees}</span>
                </p>
                <p>
                  Members Added: <span>{employerInfo?.account?.employer_team_count}</span>
                </p>
                <p className="employer__website">
                  Website:{" "}
                  <span onClick={() => window.open(`${employerInfo?.account?.website}`)}>
                    {employerInfo?.account?.website}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="container-fluid candidate__profile__box section__bg">
          <div className="row px-sm-4 pt-4 px-3 mt-4">
            <div className="col-6">
              <h5 className="team__member__section__heading">Team Member</h5>
            </div>
            <div className="col-6">
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  name="edit_add_btn"
                  className="btn text-success"
                  onClick={() => {
                    setTeamMemberModalOpen(true);
                    setErrorMessage("");
                    setTimeout(() => {
                      memberInputRef.current.focus();
                    }, 500);
                  }}
                >
                  <BiPlusCircle />
                  <span>
                    Add<span className="d-sm-inline-block d-none">Team Member</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          {status !== STATUSES.LOADING ? (
            <div className="pt-2 pb-4 px-lg-5 px-sm-4 px-3">
              {[...allTeamMembers].map((member, idx) => {
                return (
                  <div
                    className="row mt-3 pt-3 pb-sm-1 pb-2 px-md-5 px-sm-4 px-2 rounded-3"
                    style={{ background: "#DEDDDD" }}
                    key={member?.member_id}
                  >
                    <div className="col-md-3 col-sm-6 col-6 mt-md-0 mt-2">
                      <label htmlFor={`team_member_${idx}`} className="candidate__info__label">
                        Name
                      </label>
                      <p className="candidate__info__value">
                        {member?.first_name} {member?.last_name}
                      </p>
                    </div>
                    <div className="col-md-4 col-sm-6 col-6 mt-sm-0 mt-2">
                      <label htmlFor={`team_member_${idx}`} className="candidate__info__label">
                        Email
                      </label>
                      <p className="candidate__info__value">{member?.email}</p>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6 mt-sm-0 mt-2">
                      <label htmlFor={`team_member_${idx}`} className="candidate__info__label">
                        Phone
                      </label>
                      <p className="candidate__info__value">{member?.mobile_phone}</p>
                    </div>
                    <div className="col-md-2 col-sm-6 col-6 mt-sm-0 mt-2">
                      <label htmlFor={`team_member_${idx}`} className="candidate__info__label">
                        Activate / Deactivate
                      </label>
                      <div className="candidate__info__value">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            style={{
                              width: "2.8em",
                              cursor: employerInfo?.role === "Admin" ? "pointer" : "not-allowed",
                            }}
                            type="checkbox"
                            role="switch"
                            id={`switch_${member?.first_name}_${idx}`}
                            checked={member?.status === "Active" ? true : false}
                            onChange={() =>
                              HandleTeamMember(member?.member_id, member?.status === "Active" ? false : true)
                            }
                            disabled={employerInfo?.role === "Admin" ? false : true}
                            title={
                              employerInfo?.role === "Admin"
                                ? "Activate/Deactivate Team Member Account!"
                                : "Only Admin have the access!"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>

      {/* Modal for Adding New Team Member */}
      <Modal show={teamMemberModalOpen} onHide={() => setTeamMemberModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Employer's Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="mt-3 px-3" onSubmit={(e) => e.preventDefault()}>
            <p className="mb-2 pb-1 small ms-1">Type email and press enter to add more than 1.</p>
            <div className="row px-3">
              <label className="input__chip__label" ref={memberRef}>
                {[...memberEmails].map((email, idx) => {
                  return (
                    <span className="chip" key={`${email}_${idx}`}>
                      <span style={{ textTransform: "initial" }}>{email}</span>
                      <button type="button">
                        <BiX className="icon" id={email} onClick={HandleMemberEmailDelete} />
                      </button>
                    </span>
                  );
                })}
                <input
                  ref={memberInputRef}
                  type="text"
                  style={{ textTransform: "initial", background: "transparent !important" }}
                  id="member_emails"
                  name="member_emails"
                  placeholder="Type to add multiple emails ..."
                  value={memberEmailInput}
                  onChange={(e) => {
                    setMemberEmailInput(e.target.value);
                    if (e.target.value === "") {
                      setErrorMessage("");
                      memberRef.current.style.border = "2px solid #0f643b";
                    }
                  }}
                  onKeyDown={HandleMemberEmailInput}
                />
              </label>
            </div>
            <p className="error__message">{errorMessage}</p>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            onClick={HandleAddTeamMemberSubmit}
            className="btn btn-success px-4 shadow-none d-flex justify-content-center align-items-center mx-auto"
          >
            {status !== STATUSES.LOADING ? "Add Members" : <ScaleLoader height={20} color="#fff" />}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployerProfile;
