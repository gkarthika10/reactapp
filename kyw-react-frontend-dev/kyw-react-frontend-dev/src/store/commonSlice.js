import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toastSuccess, toastError } from "../helpers/Notification";

// API Statuses
const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading"
});

const commonSlice = createSlice({
    name: "resume",
    initialState: {
        countries: [],
        status: STATUSES.IDLE
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload;
        },
        setCountries(state, action) {
            state.countries = action.payload;
        }
    }
});

// Contact KYW Form (Common)
export const contactKyw = (contact_info, next = () => { }) => {
    return async function contactKywThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auth/contact-us`;
        const body = { ...contact_info };

        await axios.post(url, body).then((res) => {
            console.log(res);
            if (res.status === 200) {
                dispatch(setStatus(STATUSES.IDLE));
                toastSuccess(res?.data?.message);
                next();
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setStatus(STATUSES.ERROR));
            if (err?.response?.data?.Error) toastError(err?.response?.data?.Error);
        });
    }
};

// Fetch All Countries for Employer Registration
export const fetchAllCountries = () => {
    return async function fetchAllCountriesThunk(dispatch) {
        const url = `https://restcountries.com/v3.1/all`;

        await axios.get(url).then((res) => {
            // console.log(res);
            if (res.status === 200)
                dispatch(setCountries(res.data));
        }).catch((err) => {
            console.log(err);
        });
    }
}

// Fetch States of Particular Country (Again in Employer Registration)

export const { setStatus, setCountries } = commonSlice.actions;
export default commonSlice.reducer;