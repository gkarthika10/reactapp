import React, { useState, useEffect } from "react";
import "../../styles/AuctionWindow.css";
import { useParams } from "react-router-dom";

// Helpers
import { isAuthenticated } from "../../helpers/Auth";
import { getUserAlias } from "../../helpers/Utility";
import { STATUSES } from "../../App";
import { getLocalStorage } from "../../helpers/LocalStorage";

// React-Bootstrap Components
import { Modal, Button } from "react-bootstrap";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchInterviewOfferCandidate, offerDecisionByEmployer } from "../../store/auctionSlice";

// Media & Icons
import { BiRefresh } from "react-icons/bi";
import CandidateProfileImg from "../../media/avatars/Candidate2.png";

// Helpers
import Loader from "../common/Loader";
import { toastWarning } from "../../helpers/Notification";

// Components
import { SkillsItem } from "../candidate/resume-parse/SkillsCertification";

const OfferStage = () => {
  const dispatch = useDispatch();
  const { email } = getLocalStorage("user");
  const { status, data: auction_data } = useSelector((state) => state.auction.interview_offer_candidate);

  const { auction_id } = useParams();
  const [auctionInfo, setAuctionInfo] = useState({});
  const [auctionBiddings, setAuctionBiddings] = useState([]);

  const [offerDecisionModal, setOfferDecisionModal] = useState(false);
  const [offerDecisionInfo, setOfferDecisionInfo] = useState({});
  const [rejectCandidateReason, setRejectCandidateReason] = useState("");

  // fetch specific auction details
  useEffect(() => {
    dispatch(fetchInterviewOfferCandidate(auction_id));
  }, [dispatch, auction_id]);

  // store auction details in states
  useEffect(() => {
    if (auction_data) {
      setAuctionInfo(auction_data);

      // shuffling bid items by priotising Interview bid_stage
      const interview_stage = [];
      const other_stage = [];
      auction_data?.bid_details?.forEach((auc) => {
        if (auc?.bid_stage === "Interview") interview_stage.push(auc);
        else other_stage.push(auc);
      });

      setAuctionBiddings([...interview_stage, ...other_stage]);
    }
  }, [auction_data]);

  // fetch latest bidder name from auctionBiddings
  const getLatestBidInfo = (auc_bids) => {
    if (auc_bids?.length > 0) return auc_bids[0]?.employer_team?.account?.name;
    return "";
  };

  // format 'last modified bid time'
  const getFormatBidTime = (time) => {
    return new Date(time).toLocaleString();
  };

  // handle refresh window request
  const HandleRefreshRequest = () => {
    dispatch(fetchInterviewOfferCandidate(auction_id));
  };

  // get Skill Chips JSX
  const getSkills = (skills_str) => {
    try {
      const skills = JSON.parse(skills_str);

      return (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {skills?.length > 0 &&
            [...skills].map((skill, idx) => {
              return <SkillsItem key={`skill_${idx + 1}`} skill={skill} isReview={true} />;
            })}
        </div>
      );
    } catch (err) {
      console.log(err);
      return "";
    }
  };

  // Give Offer / Reject Offer Button Extra Styles
  const btn_styles = { fontSize: "0.85rem", transform: "translateY(5px)" };

  // Handle Open & Close Modal for Offer Decision
  const handleModalOpen = () => setOfferDecisionModal(true);
  const handleModalClose = () => setOfferDecisionModal(false);

  // Handle Roll / Reject Offer by Employer
  const HandleRollRejectOffer = (reject_reason = "") => {
    const { auc_id, bid_id, offer_rolled } = offerDecisionInfo;
    if (!auc_id || !bid_id || offer_rolled === null) return;
    if (offer_rolled === false && !reject_reason?.trim()) {
      toastWarning("Please provide valid reason for rejecting candidate.");
      return;
    }

    // employer is confirmed to make this decision
    if (offer_rolled === false) dispatch(offerDecisionByEmployer(auc_id, bid_id, offer_rolled, reject_reason));
    else dispatch(offerDecisionByEmployer(auc_id, bid_id, offer_rolled));
    handleModalClose();
  };

  return (
    <div className="container-fluid auction__window__box mb-4">
      {isAuthenticated()?.userType === "E" && status === STATUSES.IDLE ? (
        <div className="auction__window__inner__box pt-3 pb-5 px-xl-5 px-4" id={`auction__${auctionInfo?.auction_id}`}>
          {/* Candidate Info */}
          <div className="row auction__candidate__info">
            <div className="col-lg-3 col-md-4 col-sm-4 col-5 mt-3">
              <div className="info__col1">
                <img src={CandidateProfileImg} alt="candidate_profile" />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-4 col-7 info__col__common mt-3">
              <div className="info__col2">
                <h4 className="candidate__name">{getUserAlias(auctionInfo?.candidate_profile?.first_name)}</h4>
                <p className="candidate__company__name">{auctionInfo?.candidate_profile?.current_employer}</p>
                <div className="extra__info">
                  <p>
                    <span>Auction Started At:</span> {auctionInfo?.auction_live_date}
                  </p>
                  <p>
                    <span>Auction Ended At:</span> {auctionInfo?.auction_end_date}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-4 col-7 info__col__common mt-3">
              <div className="info__col3">
                <ul className="pt-2">
                  <li>
                    <span>Profile:</span> {auctionInfo?.candidate_profile?.current_role}
                  </li>
                  <li>
                    <span>Experience:</span> {auctionInfo?.candidate_profile?.relevant_experience} Year(s)
                  </li>
                  <li>
                    <span>Expected CTC:</span> ${auctionInfo?.base_bid}
                  </li>
                  <li>
                    <span>Joining Availability:</span> Within {auctionInfo?.candidate_profile?.notice_period} Days
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-4 col-5 info__col__common current__bid__col mt-xs-4 mt-3">
              <div className="info__col4">
                {auctionInfo?.latest_bid ? (
                  <>
                    <h6>Current Bid</h6>
                    <h3>${auctionInfo?.latest_bid}</h3>
                    <p className="bid__company__name">
                      <span>By</span> <span>{getLatestBidInfo(auctionBiddings)}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <h5>Current Bid</h5>
                    <p className="text-center text-muted">Not Bid Yet</p>
                  </>
                )}
              </div>
            </div>
            <div className="col-xl-10 offset-xl-1 col-lg-12 col-md-7 col-sm-8 ps-md-0 ps-sm-4 mt-md-2 mt-sm-4 mt-2">
              <p className="mt-3 candidate__skills d-flex justify-content-center">
                {auctionInfo?.candidate_profile?.skills && getSkills(auctionInfo?.candidate_profile?.skills)}
              </p>
            </div>
            <div className="col-12">
              <hr className="window__divider" />
            </div>
          </div>

          {/* Auction Info */}
          <div className="row auction__info candidate__profile__box">
            <div className="col-lg-10 offset-lg-1">
              <div className="auction__biddings__box py-4">
                <div className="auction__head__box">
                  <div className="heading">
                    <h6 className="py-2">All Biddings</h6>
                    <div className="heading__border"></div>
                  </div>
                  <div className="refresh__biddings">
                    <BiRefresh className="refresh__icon" title="Refresh" onClick={HandleRefreshRequest} />
                  </div>
                </div>
                {auctionBiddings?.length > 0 ? (
                  <div className="auction__biddings mt-4">
                    {[...auctionBiddings].map((auc_item, idx) => {
                      return (
                        <div
                          className="px-lg-5 px-4 py-3 mt-3 rounded"
                          style={{ background: "#dedddd" }}
                          key={`auc_${auc_item?.auc_id}_${idx}`}
                        >
                          <div className="row">
                            <div className="col-md-3 col-6">
                              <div className="mt-md-0 mt-2 d-flex flex-column">
                                <label htmlFor={`bidding_employer_${idx}`} className="candidate__info__label">
                                  Employer
                                </label>
                                <span className="candidate__info__value">{auc_item?.employer_team?.account?.name}</span>
                              </div>
                            </div>
                            <div className="col-md-3 col-6">
                              <div className="mt-md-0 mt-2 d-flex flex-column">
                                <label htmlFor={`bidding__time_${idx}`} className="candidate__info__label">
                                  Modified At
                                </label>
                                <span className="candidate__info__value" style={{ fontSize: "0.9rem" }}>
                                  {getFormatBidTime(auc_item?.last_modified_date)}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-3 col-6">
                              <div className="mt-md-0 mt-2 d-flex flex-column">
                                <label htmlFor={`bidding__time_${idx}`} className="candidate__info__label">
                                  Bid Value
                                </label>
                                <span className="candidate__info__value">${auc_item?.bid_value}</span>
                              </div>
                            </div>
                            <div className="col-md-3 col-6">
                              <div className="mt-md-0 mt-2 accept__reject__btn">
                                {auc_item?.offer_rolled === "Yes" ? (
                                  <button
                                    type="button"
                                    className="btn btn-secondary rounded"
                                    style={btn_styles}
                                    disabled
                                  >
                                    Offer Rolled
                                  </button>
                                ) : auc_item?.offer_rolled === "No" ? (
                                  <button
                                    type="button"
                                    className="btn btn-secondary rounded"
                                    style={btn_styles}
                                    disabled
                                  >
                                    Candidate Rejected
                                  </button>
                                ) : auc_item?.employer_team?.email === email ? (
                                  <>
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      style={btn_styles}
                                      disabled={auc_item?.bid_stage === "Interview" ? false : true}
                                      onClick={() => {
                                        handleModalOpen();
                                        setOfferDecisionInfo({
                                          auc_id: auction_id,
                                          bid_id: auc_item?.bid_id,
                                          offer_rolled: true,
                                        });
                                      }}
                                    >
                                      Give Offer
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      style={btn_styles}
                                      disabled={auc_item?.bid_stage === "Interview" ? false : true}
                                      onClick={() => {
                                        handleModalOpen();
                                        setOfferDecisionInfo({
                                          auc_id: auction_id,
                                          bid_id: auc_item?.bid_id,
                                          offer_rolled: false,
                                        });
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="not__bid__section">
                    <p>Not Biddings Yet</p>
                    <p>Be the first one to Bid!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader shadow={true} />
      )}

      {/* Modal for Confirmation of Rolling/Rejecting Candidate Offer */}
      <Modal show={offerDecisionModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Offer Decision on Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure for this decision? You won't be able to change it again.</p>
          {offerDecisionInfo?.offer_rolled === false && (
            <div className="form-group">
              <label htmlFor="reject_reason" className="small mb-2">
                Please give us the proper reason for why you're rejecting this candidate?{" "}
                <span className="text-danger fw-bold">*</span>
              </label>
              <textarea
                name="reject_reason"
                id="reject_reason"
                rows="5"
                className="form-control"
                value={rejectCandidateReason}
                onChange={(e) => setRejectCandidateReason(e.target.value)}
                placeholder="Type here ..."
              ></textarea>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" className="px-4" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="success"
            className="px-4"
            onClick={() => {
              HandleRollRejectOffer(rejectCandidateReason);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OfferStage;
