import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helpers
import { toastError, toastSuccess, toastWarning } from "../helpers/Notification";

// API Statuses
const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading"
});

const auctionSlice = createSlice({
    name: "auction",
    initialState: {
        // common for all employers
        all_active_auctions: {
            data: [],
            status: STATUSES.IDLE
        },
        auctions_role_based: {
            data: [],
            status: STATUSES.IDLE
        },
        auction_bid_window: {
            data: {},
            status: STATUSES.IDLE
        },

        // specific candidate
        candidate_auction_view: {
            data: {},
            status: STATUSES.IDLE
        },
        offer_in_hand: {
            data: [],
            status: STATUSES.IDLE
        },

        // specific employer
        active_bids_by_employer: {
            data: [],
            status: STATUSES.IDLE
        },
        interview_stage_candidates: {
            data: [],
            status: STATUSES.IDLE
        },
        interview_offer_candidate: {
            data: {},
            status: STATUSES.IDLE
        },
        all_favourite_candidates: {
            data: [],
            status: STATUSES.IDLE
        },
        past_engagements: {
            data: [],
            status: STATUSES.IDLE
        }
    },
    reducers: {
        setAllActiveAuctionsStatus(state, action) {
            state.all_active_auctions.status = action.payload;
        },
        setAllActiveAuctions(state, action) {
            state.all_active_auctions.data = action.payload;
        },
        setAuctionsRoleBasedStatus(state, action) {
            state.auctions_role_based.status = action.payload;
        },
        setAuctionsRoleBased(state, action) {
            state.auctions_role_based.data = action.payload;
        },
        setAuctionBidWindowStatus(state, action) {
            state.auction_bid_window.status = action.payload;
        },
        setAuctionBidWindow(state, action) {
            state.auction_bid_window.data = action.payload;
        },
        setActiveBidsByEmployerStatus(state, action) {
            state.active_bids_by_employer.status = action.payload;
        },
        setActiveBidsByEmployer(state, action) {
            state.active_bids_by_employer.data = action.payload;
        },
        setPastEngagementsStatus(state, action) {
            state.past_engagements.status = action.payload;
        },
        setPastEngagements(state, action) {
            state.past_engagements.data = action.payload;
        },
        setInteviewStageCandidatesStatus(state, action) {
            state.interview_stage_candidates.status = action.payload;
        },
        setInteviewStageCandidates(state, action) {
            state.interview_stage_candidates.data = action.payload;
        },
        setInterviewOfferCandidateStatus(state, action) {
            state.interview_offer_candidate.status = action.payload;
        },
        setInterviewOfferCandidate(state, action) {
            state.interview_offer_candidate.data = action.payload;
        },
        setAllFavouriteCandidatesStatus(state, action) {
            state.all_favourite_candidates.status = action.payload;
        },
        setAllFavouriteCandidates(state, action) {
            state.all_favourite_candidates.data = action.payload;
        },
        setCandidateAuctionViewStatus(state, action) {
            state.candidate_auction_view.status = action.payload;
        },
        setCandidateAuctionView(state, action) {
            state.candidate_auction_view.data = action.payload;
        },
        setOfferInHandStatus(state, action) {
            state.offer_in_hand.status = action.payload;
        },
        setOfferInHand(state, action) {
            state.offer_in_hand.data = action.payload;
        }
    }
});

// Fetch All Active Auctions available in KYW
export const fetchAllAuctions = () => {
    return async function fetchAllAuctionsThunk(dispatch) {
        dispatch(setAllActiveAuctionsStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/auction`;
        const config = {
            headers: {
                aucstage: "Auction Active"
            },
            withCredentials: true
        };

        await axios.get(url, config).then((res) => {
            console.log(res?.data);

            if (res.status === 200) {
                dispatch(setAllActiveAuctions(res.data));
                dispatch(setAllActiveAuctionsStatus(STATUSES.IDLE));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setAllActiveAuctionsStatus(STATUSES.ERROR));
        });
    }
};

// Fetch Role-Based Active Auctions (for Employer Home Screen)
export const fetchAuctionsRoleBased = () => {
    return async function fetchAuctionsRoleBasedThunk(dispatch) {
        dispatch(setAuctionsRoleBasedStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/auction`;
        const config = {
            headers: {
                aucstage: "Auction Active_R"
            },
            withCredentials: true
        };

        await axios.get(url, config).then((res) => {
            console.log(res);

            if (res.status === 200) {
                dispatch(setAuctionsRoleBased(res.data?.data));
                dispatch(setAuctionsRoleBasedStatus(STATUSES.IDLE));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setAuctionsRoleBasedStatus(STATUSES.ERROR));
        });
    }
};

// Fetch Active Bids by specific Employer (for Employer Console -> Active Bids)
export const fetchActiveBidsByEmployer = () => {
    return async function fetchActiveBidsByEmployerThunk(dispatch) {
        dispatch(setActiveBidsByEmployerStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/auction`;
        const config = {
            headers: {
                aucstage: "Auction Active_E"
            },
            withCredentials: true
        };

        await axios.get(url, config).then((res) => {
            console.log(res?.data);

            if (res.status === 200) {
                dispatch(setActiveBidsByEmployer(res?.data));
                dispatch(setActiveBidsByEmployerStatus(STATUSES.IDLE));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setActiveBidsByEmployerStatus(STATUSES.ERROR));
        });
    }
};

// Fetch Past Engagements (for Employer Console -> Past Engagements)
export const fetchPastEngagements = () => {
    return async function fetchPastEngagementsThunk(dispatch) {
        dispatch(setPastEngagementsStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/auction`;
        const config = {
            headers: {
                aucstage: "Auction Finalized"
            },
            withCredentials: true
        };

        await axios.get(url, config).then((res) => {
            console.log(res?.data);

            if (res.status === 200) {
                dispatch(setPastEngagements(res?.data));
                dispatch(setPastEngagementsStatus(STATUSES.IDLE));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setPastEngagementsStatus(STATUSES.ERROR));
        });
    }
};

// Fetch Inteview Stage Candidates (Vetting) for specific Employer (for Employer Console -> Interivew Stage)
export const fetchInterviewStageCandidates = () => {
    return async function fetchInterviewStageCandidatesThunk(dispatch) {
        dispatch(setInteviewStageCandidatesStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/interview-auctions`;
        const config = { withCredentials: true };

        await axios.get(url, config).then(res => {
            dispatch(setInteviewStageCandidates(res.data));
            dispatch(setInteviewStageCandidatesStatus(STATUSES.IDLE));
        }).catch(err => {
            console.log(err);
            dispatch(setInteviewStageCandidatesStatus(STATUSES.ERROR));
        });
    }
};

// Fetch Interview State Specific Candidate Information (Offer Stage from Employer Side)
export const fetchInterviewOfferCandidate = (auction_id) => {
    return async function fetchInterviewOfferCandidateThunk(dispatch) {
        dispatch(setInterviewOfferCandidateStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/interview-auctions/${auction_id}`;
        const config = { withCredentials: true };

        await axios.get(url, config).then((res) => {
            console.log(res.data);
            if (res.status === 200) {
                dispatch(setInterviewOfferCandidateStatus(STATUSES.IDLE));
                dispatch(setInterviewOfferCandidate(res.data));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setInterviewOfferCandidateStatus(STATUSES.ERROR));
        });
    }
};

// Roll/Reject Offer for Candidate (by Employer)
export const offerDecisionByEmployer = (auction_id, bid_id, offer_rolled, rejectCandidateReason = "") => {
    return async function offerDecisionByEmployerThunk(dispatch) {
        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/offer`;
        const body = {
            bid_id: bid_id,
            offer_rolled: offer_rolled,
            remark: rejectCandidateReason
        };
        const config = { withCredentials: true };

        await axios.post(url, body, config).then((res) => {
            console.log(res.data);

            if (res.status === 200) {
                toastSuccess("Offer Decision Successfully Submitted!");
                dispatch(fetchInterviewOfferCandidate(auction_id));
            }
        }).catch((err) => {
            console.log(err);
        });
    }
};

// Fetch Specific Candidate Auction Window by Employer
export const fetchCandidateAuctionWindow = (auction_id) => {
    return async function fetchCandidateAuctionWindowThunk(dispatch) {
        dispatch(setAuctionBidWindowStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/auction/${auction_id}`;
        const config = { withCredentials: true };

        await axios.get(url, config).then((res) => {
            console.log(res);

            if (res.status === 200) {
                dispatch(setAuctionBidWindow(res.data));
                dispatch(setAuctionBidWindowStatus(STATUSES.IDLE));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setAuctionBidWindowStatus(STATUSES.ERROR));
        });
    }
};

// Place Bid for Specfic Candidate
export const bidForCandidate = (auction_id, bid_amount) => {
    return async function bidForCandidateThunk(dispatch) {
        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/bids`;
        const config = { withCredentials: true };
        const body = {
            auction_id: auction_id,
            bid_value: bid_amount
        };

        await axios.post(url, body, config).then((res) => {
            console.log(res);

            if (res.status === 200) {
                toastSuccess("Bid Placed Successfully!");
                dispatch(fetchCandidateAuctionWindow(auction_id));
            }
        }).catch((err) => {
            console.log(err);
            // toastError(err?.data?.response?.detail);
        });
    }
};

// Get All Faourite Candidates of marked by specific Employer
export const fetchAllFavoriteCandidates = () => {
    return async function fetchAllFavoriteCandidatesThunk(dispatch) {
        dispatch(setAllFavouriteCandidatesStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/favourites`;
        const config = { withCredentials: true };

        await axios.get(url, config).then((res) => {
            console.log(res.data);

            if (res.status === 200) {
                dispatch(setAllFavouriteCandidatesStatus(STATUSES.IDLE));
                dispatch(setAllFavouriteCandidates(res?.data));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setAllFavouriteCandidatesStatus(STATUSES.ERROR));
        });
    }
};

// Add a Candidate in Favourites
export const addCandidateInFavourites = (auction_id) => {
    return async function addCandidateInFavouritesThunk(dispatch) {
        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/favourites`;
        const body = { auction_id: auction_id };
        const config = { withCredentials: true };

        await axios.post(url, body, config).then((res) => {
            console.log(res.data);
            if (res.status === 200) {
                if (res?.data?.message === "Auction already marked as Favourite")
                    toastWarning("Auction already marked as Favourite");
                else
                    toastSuccess(res?.data?.message);
                dispatch(fetchAllFavoriteCandidates());
            }
        }).catch((err) => {
            console.log(err);
            toastWarning(err?.response?.data?.Error);
        })
    }
};

// Remove from Favourites
export const removeFromFavourites = (auction_id) => {
    return async function removeFromFavouritesThunk(dispatch) {
        const url = `${process.env.REACT_APP_BASE_API_URI}/auc/favourites/${auction_id}`;
        const config = { withCredentials: true };

        await axios.delete(url, config).then((res) => {
            console.log(res.data);
            dispatch(fetchAllFavoriteCandidates());
            toastSuccess(res?.data?.message);
        }).catch((err) => {
            console.log(err);
            toastWarning(err?.response?.data?.Error);
        })
    }
};

// Request for Auction by Candidate (for Candidate Console)
export const requestForAuction = () => {
    return async function requestForAuctionThunk(dispatch) {

        const url = `${process.env.REACT_APP_BASE_API_URI}/candidate/auction-availability`;
        const config = { withCredentials: true };

        await axios.post(url, {}, config).then((res) => {
            console.log(res?.data);

            if (res.status === 200) {
                dispatch(fetchCandidateAuctionView());
                toastSuccess(res?.data?.message);
            }
        }).catch((err) => {
            console.log(err);
            if (err?.Error) toastError(err?.Error);
            else toastError("Some Error Occured!");
        });
    }
};

// Fetch Candidate Auction View
export const fetchCandidateAuctionView = () => {
    return async function fetchCandidateAuctionViewThunk(dispatch) {
        dispatch(setCandidateAuctionViewStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/candidate/auction`;
        const config = { withCredentials: true };

        await axios.get(url, config).then((res) => {
            console.log(res.data);

            if (res.status === 200) {
                dispatch(setCandidateAuctionView(res.data));
                dispatch(setCandidateAuctionViewStatus(STATUSES.IDLE));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setCandidateAuctionViewStatus(STATUSES.ERROR));
        });
    }
};

// Get Offer In Hand for Specific Candidate
export const fetchOfferInHand = () => {
    return async function fetchOfferInHandThunk(dispatch) {
        dispatch(setOfferInHandStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/candidate/offer`;
        const config = { withCredentials: true };

        await axios.get(url, config).then((res) => {
            console.log(res.data);

            if (res.status === 200) {
                dispatch(setOfferInHand(res.data));
                dispatch(setOfferInHandStatus(STATUSES.IDLE));
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setOfferInHandStatus(STATUSES.ERROR));
        });
    }
};

// Accept / Reject Offer by specific Candidate
export const offerDecisionByCandidate = (bid_id, offer_accepted, rejectOfferReason = "") => {
    return async function offerDecisionByCandidateThunk(dispatch) {
        const url = `${process.env.REACT_APP_BASE_API_URI}/candidate/offer`;
        const body = {
            bid_id: bid_id,
            offer_accepted: offer_accepted,
            remark: rejectOfferReason
        }
        const config = { withCredentials: true };

        await axios.post(url, body, config).then((res) => {
            console.log(res.data);

            if (res.status === 200) {
                toastSuccess("Offer Decision Successfully Submitted!");
                dispatch(fetchOfferInHand());
            }
        }).catch((err) => {
            console.log(err);
        })
    }
};

export const { setAllActiveAuctionsStatus, setAllActiveAuctions, setAuctionBidWindowStatus, setAuctionBidWindow, setAuctionsRoleBasedStatus, setAuctionsRoleBased, setActiveBidsByEmployerStatus, setActiveBidsByEmployer, setPastEngagementsStatus, setPastEngagements, setInteviewStageCandidatesStatus, setInteviewStageCandidates, setInterviewOfferCandidateStatus, setInterviewOfferCandidate, setAllFavouriteCandidatesStatus, setAllFavouriteCandidates, setCandidateAuctionViewStatus, setCandidateAuctionView, setOfferInHandStatus, setOfferInHand } = auctionSlice.actions;
export default auctionSlice.reducer;