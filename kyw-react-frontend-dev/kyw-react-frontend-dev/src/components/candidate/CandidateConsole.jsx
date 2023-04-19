import React, { useState, useEffect } from "react";
import "../../styles/CandidateConsole.css";
import "../../styles/AuctionWindow.css";

// React-Bootstrap Components
import { Modal, Button } from "react-bootstrap";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCandidateAuctionView,
  fetchOfferInHand,
  offerDecisionByCandidate,
  requestForAuction,
} from "../../store/auctionSlice";

// Helpers
import { STATUSES } from "../../App";
import Loader from "../common/Loader";
import { getLocalStorage } from "../../helpers/LocalStorage";
import { toastWarning } from "../../helpers/Notification";

// Media & Icons
import CandidateProfileImg from "../../media/avatars/Candidate1.png";
import { BiCloudDownload, BiFile } from "react-icons/bi";
// import MakeMyTripLogo from "../../media/icons/MakeMyTrip_Logo.png";

const CandidateConsole = () => {
  const dispatch = useDispatch();
  const { data: offer_in_hand, status } = useSelector((state) => state.auction.offer_in_hand);
  const { data: auction_view } = useSelector((state) => state.auction.candidate_auction_view);

  const [auctionView, setAuctionView] = useState([]);
  const [offersInHand, setOffersInHand] = useState([]);

  const [offerDecisionModal, setOfferDecisionModal] = useState(false);
  const [offerDecisionInfo, setOfferDecisionInfo] = useState({});
  const [rejectOfferReason, setRejectOfferReason] = useState("");

  // fetch offer_in_hand once component load
  useEffect(() => {
    dispatch(fetchOfferInHand());
    dispatch(fetchCandidateAuctionView());
  }, [dispatch]);

  // save offer_in_hand everytime gets update from store
  useEffect(() => {
    if (offer_in_hand?.length > 0) setOffersInHand([...offer_in_hand]);
    if (Object.keys(auction_view)?.length > 0) setAuctionView([...auction_view]);
  }, [offer_in_hand, auction_view]);

  // Accept / Reject Offer Button Extra Styles
  const btn_styles = { fontSize: "0.85rem", transform: "translateY(17px)" };

  // Handle Open & Close Modal for Offer Decision
  const handleModalOpen = () => setOfferDecisionModal(true);
  const handleModalClose = () => setOfferDecisionModal(false);

  // Handle Accept / Reject Offer by Employer
  const HandleAcceptRejectOffer = (reject_reason = "") => {
    const { bid_id, offer_accepted } = offerDecisionInfo;
    if (!bid_id || offer_accepted === null) return;
    if (offer_accepted === false && !reject_reason?.trim()) {
      toastWarning("Please provide valid reason for denying offer.");
      return;
    }

    // candidate is confirmed to make this decision
    if (offer_accepted === false) dispatch(offerDecisionByCandidate(bid_id, offer_accepted, reject_reason));
    else dispatch(offerDecisionByCandidate(bid_id, offer_accepted));
    handleModalClose();
  };

  return (
    <div className="candidate__console__box">
      {auctionView?.length > 0 ? (
        <div className="container-fluid mb-5 px-xl-5 px-sm-4 px-3">
          <div className="row mt-4 px-md-5 px-2">
            {/* Auction Window */}
            <div className="row section__bg p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="profile__section__heading">Auction Window</h6>
              </div>

              <div className="row auction__candidate__info">
                <div className="col-lg-3 col-md-4 col-5 mt-4">
                  <div className="info__col1">
                    <img src={CandidateProfileImg} alt="candidate_console_profile" />
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-7 info__col__common mt-3">
                  <div className="info__col2">
                    <h4 className="candidate__name">
                      {getLocalStorage("user")?.first_name} {getLocalStorage("user")?.last_name}
                    </h4>
                    <p className="candidate__company__name">Apisero Inc. </p>
                    <div className="extra__info">
                      <p>
                        <span>Auction Started At:</span> 16-08-2022
                      </p>
                      <p>
                        <span>Status:</span> <span className="bid__status text-success">Active</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-7 info__col__common mt-3">
                  <div className="info__col3">
                    <ul>
                      <li>
                        <span>Profile:</span> Software Engineer
                      </li>
                      <li>
                        <span>Experience:</span> 1 Year(s)
                      </li>
                      <li>
                        <span>Expected CTC:</span> $100000
                      </li>
                      <li>
                        <span>Joining Availability:</span> Within 90 Days
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-5 info__col__common current__bid__col mt-xs-4 mt-3">
                  <div className="info__col4">
                    {true ? (
                      <>
                        <h6>Current Bid</h6>
                        <h3>$200000</h3>
                      </>
                    ) : (
                      <>
                        <h5>Current Bid</h5>
                        <p className="text-center text-muted">Not Bid Yet</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="row px-md-5 mb-3">
              <div className="auction__biddings mt-4">
                {true ? (
                  [1].map((bidding, idx) => {
                    return (
                      <div className="auction__bidding__item py-xl-0 py-2 px-xl-5 px-sm-5 px-4" key={idx}>
                        <div className="row">
                          <div className="col-md-3 col-6">
                            <div className="bidding__item__col">
                              <p className="bidding__company__name">Make My Trip</p>
                            </div>
                          </div>
                          <div className="col-md-3 col-7">
                            <div className="bidding__item__col">
                              <p className="bidding__time">10:28AM 27-06-2022 (IST)</p>
                            </div>
                          </div>
                          <div className="col-md-3 col-5">
                            <div className="bidding__item__col">
                              <p className="bidding__offer__amount">$150000</p>
                            </div>
                          </div>
                          <div className="col-md-3 col-12">
                            <div className="bidding__item__col">
                              <p className="bidding__job__description tooltip__text text-decoration-underline">
                                See Job Description
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="not__bid__section">
                    <p>Not Biddings Yet</p>
                    <p>Be the first one to Bid!</p>
                  </div>
                )}
              </div>
            </div> */}
            </div>

            {/* Offer In Hand */}
            <div className="row section__bg p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="profile__section__heading">Offer In Hand</h6>
              </div>

              <div className="row mt-3">
                <div className="auction__biddings mb-3 px-md-5">
                  {status !== STATUSES.LOADING ? (
                    <div>
                      {offersInHand?.length > 0 ? (
                        <div className="">
                          {[...offersInHand].map((offer, idx) => {
                            if (offer?.offer_rolled === "No" || offer?.offer_rolled === null) return "";

                            return (
                              <div className="auction__bidding__item py-2 px-xl-5 px-4" key={`offer_${idx + 1}`}>
                                <div className="row">
                                  {/* <div className="col-lg-2 col-md-4 col-6">
                                    <div className="bidding__item__col">
                                      <img src={MakeMyTripLogo} alt={"bidding_company_name"} style={{ maxHeight: 35 }} />
                                    </div>
                                  </div> */}
                                  <div className="col-lg-4 col-md-4 col-6">
                                    <div className="bidding__item__col flex-column align-items-start justify-content-center">
                                      <p className="bidding__company__name">{offer?.employer_detail?.name}</p>
                                      <p className="bidding__job__role">Associate Software Engineer</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-md-4 col-7">
                                    <div className="bidding__item__col flex-column align-items-start justify-content-center">
                                      <p className="bidding__ctc__offering">
                                        <span>CTC Offering:</span>
                                        <span>${offer?.bid_value}</span>
                                      </p>
                                      <p className="bidding__joining__date">
                                        <span>Joining Date:</span>
                                        <span>28-09-2022</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-md-4 col-5">
                                    <div className="bidding__item__col">
                                      <span className="offer__in__hand__icon">
                                        <BiFile />
                                      </span>
                                      <span className="offer__in__hand__icon">
                                        <BiCloudDownload />
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-md-4 col-12">
                                    <div className="mt-md-0 mt-2 accept__reject__btn d-flex justify-content-center">
                                      {offer?.offer_accepted === "Yes" ? (
                                        <button
                                          type="button"
                                          className="btn btn-success rounded"
                                          style={btn_styles}
                                          disabled
                                        >
                                          Offer Accepted
                                        </button>
                                      ) : offer?.offer_accepted === "No" ? (
                                        <button
                                          type="button"
                                          className="btn btn-danger rounded"
                                          style={btn_styles}
                                          disabled
                                        >
                                          Offer Rejected
                                        </button>
                                      ) : (
                                        <>
                                          <button
                                            type="button"
                                            className="btn btn-success"
                                            style={btn_styles}
                                            onClick={() => {
                                              handleModalOpen();
                                              setOfferDecisionInfo({
                                                bid_id: offer?.bid_id,
                                                offer_accepted: true,
                                              });
                                            }}
                                          >
                                            Accept
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-danger"
                                            style={btn_styles}
                                            onClick={() => {
                                              handleModalOpen();
                                              setOfferDecisionInfo({
                                                bid_id: offer?.bid_id,
                                                offer_accepted: false,
                                              });
                                            }}
                                          >
                                            Reject
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="not__bid__section pt-3 text-center">
                          <p>No Offers Yet</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Loader />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-fluid mb-5 px-xl-5 px-sm-4 px-3">
          <div className="row mt-4 px-md-5 px-2">
            <div className="row p-4 section__bg" style={{ minHeight: "50vh" }}>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <h5 className="text-dark">Your Profile is not Active For Auction</h5>
                <button
                  type="button"
                  className="btn btn-success d-flex justify-content-center align-content-center mt-4 px-4"
                  onClick={() => {
                    dispatch(requestForAuction());
                  }}
                >
                  Request For Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Confirmation of Accepting/Rejecting Offer */}
      <Modal show={offerDecisionModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Offer Decision by Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure for this decision? You won't be able to change it again.</p>
          {offerDecisionInfo?.offer_accepted === false && (
            <div className="form-group">
              <label htmlFor="reject_reason" className="small mb-2">
                Please give us the proper reason for why you're rejecting this offer?{" "}
                <span className="text-danger fw-bold">*</span>
              </label>
              <textarea
                name="reject_reason"
                id="reject_reason"
                rows="5"
                className="form-control"
                value={rejectOfferReason}
                onChange={(e) => setRejectOfferReason(e.target.value)}
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
              HandleAcceptRejectOffer(rejectOfferReason);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CandidateConsole;
