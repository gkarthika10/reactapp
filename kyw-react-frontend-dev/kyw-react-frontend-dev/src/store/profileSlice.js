import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toastSuccess } from "../helpers/Notification";

// API Statuses
const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading"
});

// Profile View for both Candidate & Employer Role
const profileSlice = createSlice({
    name: "profile",
    initialState: {
        candidate: {
            profile_data: {},
            status: STATUSES.IDLE
        },
        employer: {
            profile_data: {},
            state: STATUSES.IDLE
        }
    },
    reducers: {
        setCandidateStatusRedux(state, action) {
            state.candidate.status = action.payload;
        },
        setCandidateProfileDataRedux(state, action) {
            state.candidate.profile_data = action.payload;
        }
    }
});

// get candidate profile info
export const getCandidateProfile = () => {
    return async function getCandidateProfileThunk(dispatch) {
        dispatch(setCandidateStatusRedux(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/candidate/profile`;
        const config = {
            withCredentials: true
        };

        await axios.get(url, config).then((res) => {
            if (res.status === 200) {
                dispatch(setCandidateProfileDataRedux(res.data));
                dispatch(setCandidateStatusRedux(STATUSES.IDLE));
                console.log(res.data);
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setCandidateStatusRedux(STATUSES.ERROR));
        });
    }
};

// update candidate profile info
export const updateCandidateProfile = (data) => {
    return async function updateCandidateProfileThunk(dispatch) {
        dispatch(setCandidateStatusRedux(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/candidate/profile`;
        const config = {
            withCredentials: true
        };

        await axios.put(url, data, config).then((res) => {
            console.log(res.data);
            dispatch(getCandidateProfile());
            dispatch(setCandidateStatusRedux(STATUSES.IDLE));
            toastSuccess("Profile Updated Successfully!");
        }).catch((err) => {
            console.log(err);
            dispatch(setCandidateStatusRedux(STATUSES.ERROR));
        });
    }
};

export const { setCandidateStatusRedux, setCandidateProfileDataRedux } = profileSlice.actions;
export default profileSlice.reducer;