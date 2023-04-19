import React, { useState, useEffect } from "react";
import "../../styles/AuctionWindow.css";
import { useParams } from "react-router-dom";
import Countdown from "react-countdown";

// React-Bootstrap Components
import { Modal, Button } from "react-bootstrap";

// Helpers
import { isAuthenticated } from "../../helpers/Auth";
import { getLocalStorage } from "../../helpers/LocalStorage";
import { getUserAlias } from "../../helpers/Utility";
import { STATUSES } from "../../App";
import Loader from "../common/Loader";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { bidForCandidate, fetchCandidateAuctionWindow } from "../../store/auctionSlice";

// Media & Icons
import { BiRevision } from "react-icons/bi";
import CandidateProfileImg from "../../media/avatars/Candidate2.png";
import CompanyGenericImg from "../../media/icons/company-generic.png";
import AmazonLogo from "../../media/icons/Amazon_Logo.png";
import MakeMyTripLogo from "../../media/icons/MakeMyTrip_Logo.png";
import JustDialLogo from "../../media/icons/JustDial_Logo.png";

// Components
import { SkillsItem } from "../candidate/resume-parse/SkillsCertification";

const AuctionWindow = () => {
  const dispatch = useDispatch();
  const { status, data: auction_data } = useSelector((state) => state.auction.auction_bid_window);

  const { auction_id } = useParams();
  const [auctionInfo, setAuctionInfo] = useState({});
  const [auctionBiddings, setAuctionBiddings] = useState([]);

  // states for confirmation modal
  const [bidDecisionModal, setBidDecisionModal] = useState(false);

  // Handle Open & Close Modal for Bidding Decision
  const handleModalOpen = () => setBidDecisionModal(true);
  const handleModalClose = () => setBidDecisionModal(false);

  // fetch specific auction details
  useEffect(() => {
    dispatch(fetchCandidateAuctionWindow(auction_id));
  }, [dispatch, auction_id]);

  // store auction details in states
  useEffect(() => {
    if (auction_data) {
      setAuctionInfo(auction_data);
      setAuctionBiddings(auction_data.bid_details);
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

  // handle raise bid request
  const HandleRaiseBid = (auc_id) => {
    if ((auctionInfo?.latest_bid && auctionInfo?.increment_amount) || auctionInfo?.base_bid) {
      let amount = 0;
      if (auctionInfo?.latest_bid) amount = Number(auctionInfo?.latest_bid) + Number(auctionInfo?.increment_amount);
      else amount = Number(auctionInfo?.base_bid);

      dispatch(bidForCandidate(auc_id, amount));
      handleModalClose();
    }
  };

  // handle refresh window request
  const HandleRefreshRequest = () => {
    dispatch(fetchCandidateAuctionWindow(auction_id));
  };

  // static company logo (for sometime)
  const getCompanyLogo = (company_name) => {
    switch (company_name) {
      case "Amazon":
        return AmazonLogo;

      case "Make My Trip":
        return MakeMyTripLogo;

      case "Just Dial":
        return JustDialLogo;

      default:
        return CompanyGenericImg;
    }
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

  // function for react-countdown
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span className="text-danger">EXPIRED!</span>;
    } else {
      // Render a countdown
      return (
        <span className="text-success">
          {days}d : {hours}h : {minutes}m : {seconds}s
        </span>
      );
    }
  };

  // validate date format
  const isValidDateFormat = (date) => {
    try {
      const dt = new Date(date);
      if (Object.prototype.toString.call(dt) === "[object Date]") {
        // it is a date
        if (isNaN(dt)) return false;
        else return true;
      } else return false;
    } catch (err) {
      console.log(err);
      return false;
    }
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
                <p className="candidate__company__name">{auctionInfo?.candidate_profile?.current_company}</p>
                <div className="extra__info">
                  <p>
                    <span>Auction Started At:</span> {auctionInfo?.auction_live_date}
                  </p>
                  <p>
                    <span>Status:</span> <span className="bid__status text-success">Active</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-4 col-7 info__col__common mt-3">
              <div className="info__col3">
                <ul>
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
          <div className="row auction__info">
            <div className="col-lg-4">
              <div className="raise__bid__amount__box py-4 px-xxl-5 px-4">
                <h5 className="heading py-1">{auctionInfo?.latest_bid ? "Raise Bid By" : "Place Bid"}</h5>
                <p className="auction__countdown">
                  Auction Ends In:{" "}
                  {isValidDateFormat(auction_data?.auction_end_date) && (
                    <Countdown
                      date={new Date(auction_data?.auction_end_date).getTime() + 86400000}
                      autoStart={true}
                      renderer={renderer}
                    />
                  )}
                </p>
                <div className="input-group mt-4">
                  {/* <button type="button" className="btn px-3" name="decrease" disabled>
                    <BiMinus className="control__icon" />
                  </button> */}
                  <input
                    type="text"
                    className="form-control"
                    value={`$${auctionInfo?.latest_bid ? auctionInfo?.increment_amount : auctionInfo?.base_bid}`}
                    onChange={() => console.log("Can't Change Increment Value")}
                    readOnly={true}
                  />
                  {/* <button type="button" className="btn px-3" name="increase" disabled>
                    <BiPlus className="control__icon" />
                  </button> */}
                </div>
                <div className="last__increment__time mt-3">
                  <span>Last Increment At: </span>
                  <span>
                    {auctionBiddings?.length > 0
                      ? getFormatBidTime(auctionBiddings[0]?.last_modified_date)
                      : "Not Bid Yet!"}
                  </span>
                </div>
                <div className="raise__bid__btn">
                  <button
                    type="button"
                    className="btn"
                    id={auctionInfo?.auction_id}
                    onClick={handleModalOpen}
                    disabled={
                      auctionBiddings?.length > 0
                        ? getLocalStorage("user")?.account?.name === auctionBiddings[0]?.employer_team?.account?.name
                        : false
                    }
                  >
                    {auctionInfo?.latest_bid ? "Raise Bid" : "Start Bid"}
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="auction__biddings__box py-4">
                <div className="auction__head__box">
                  <div className="heading">
                    <h6 className="py-2">Biddings</h6>
                    <div className="heading__border"></div>
                  </div>
                  <div className="refresh__biddings">
                    <BiRevision className="refresh__icon" title="Refresh" onClick={HandleRefreshRequest} />
                  </div>
                </div>
                {auctionBiddings?.length > 0 ? (
                  <div className="auction__biddings mt-4">
                    {[...auctionBiddings].map((auc_item, idx) => {
                      return (
                        <div
                          className="auction__bidding__item px-4"
                          key={`auc_${auc_item?.employer_team?.email}_${idx}`}
                        >
                          <div className="row">
                            <div className="col-md-2 col-6">
                              <div className="bidding__item__col">
                                <img
                                  src={getCompanyLogo(auc_item?.employer_team?.email)}
                                  alt={auc_item?.employer_team?.email}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-6">
                              <div className="bidding__item__col">
                                <p className="bidding__company__name">{auc_item?.employer_team?.account?.name}</p>
                              </div>
                            </div>
                            <div className="col-md-4 col-7">
                              <div className="bidding__item__col">
                                <p className="bidding__time">{getFormatBidTime(auc_item?.last_modified_date)}</p>
                              </div>
                            </div>
                            <div className="col-md-2 col-5">
                              <div className="bidding__item__col">
                                <p className="bidding__offer__amount">${auc_item?.bid_value}</p>
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
      <Modal show={bidDecisionModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Raise Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure? You want to Bid.</p>
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
              HandleRaiseBid(auction_id);
            }}
          >
            Yes, Bid
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuctionWindow;
