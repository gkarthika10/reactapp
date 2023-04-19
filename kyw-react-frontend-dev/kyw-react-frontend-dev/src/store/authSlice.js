import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helpers 
import { setAuthentication, logout } from "../helpers/Auth";
import { toastSuccess, toastError } from "../helpers/Notification";

// API Statuses
const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading"
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        employer_team_members: [],
        notifications: [],
        status: STATUSES.IDLE
    },
    reducers: {
        logoutStore() {
            // From here we can take action only at this "auth" state
            // But, as we have taken care of this particular "logoutStore" action
            // in rootReducer, we can use it to CLEAR the complete Redux Store's state
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setEmployerTeamMembers(state, action) {
            state.employer_team_members = action.payload;
        },
        setNotifications(state, action) {
            state.notifications = action.payload;
        }
    }
});

// Get User Details (Just After Login)
export function getUserInfo(userRole, next, byLogin = false) {
    return async function getUserInfoThunk(dispatch) {
        const url = `${process.env.REACT_APP_BASE_API_URI}/auth/user`;
        const config = {
            headers: {
                "userType": userRole
            },
            withCredentials: true
        };

        await axios.get(url, config).then((res) => {
            console.log(res.data);

            if (res.status === 200) {
                setAuthentication({ ...res.data, userType: userRole });
                if (byLogin) toastSuccess("Successfully Logged In!");

                // navigate user as per role and profile stage
                setTimeout(() => {
                    if (userRole === "C") {
                        if (res?.data?.screening_stages === "Email Verified") next("/resume-parse");
                        else if (res?.data?.screening_stages === "Profile Created") next("/candidate_console");
                    } else if (userRole === "E") {
                        next("/role-based-auctions");
                    }
                }, 500);
            }
        }).catch((err) => {
            if (byLogin) toastError("Login Failed!");
            console.log(err);
        });
    }
};

// Login User (Candidate, Employer)
export function loginUser(userInfo, userType, next = () => { }) {
    return async function loginUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auth/login`;
        const config = {
            headers: {
                "userType": userType,
            },
            withCredentials: true
        };

        await axios.post(url, userInfo, config).then((res) => {
            console.log(res);
            dispatch(setStatus(STATUSES.IDLE));

            // Get User Info
            if (res.status === 200) {
                setTimeout(() => {
                    dispatch(getUserInfo(userType, next, true));
                }, 500);
            }
        }).catch(err => {
            console.log(err);
            dispatch(setStatus(STATUSES.ERROR));
            if (err?.response?.data?.Error) toastError(`${err?.response?.data?.Error}!`);
            else toastError(`Some Error Occured!`);
        });
    }
};

// SignUp User (Candidate, Employer)
export const signupUser = (userInfo, userType, next = () => { }) => {
    return async function signupUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auth/register`;
        const config = {
            headers: {
                "userType": userType,
            }
        };

        await axios.post(url, userInfo, config).then(res => {
            console.log(res);
            dispatch(setStatus(STATUSES.IDLE));
            if (res.status === 200) {
                toastSuccess("Registration Success, Verification Email Sent!");
                next();
            }
        }).catch(err => {
            console.log(err);
            if (err?.response?.data?.Error) toastError(`${err?.response?.data?.Error}!`);
            else toastError(`Some Error Occured!`);
            dispatch(setStatus(STATUSES.ERROR));
        });
    }
};

// Logout User
export const logoutUser = (next) => {
    return async function logoutUserThunk(dispatch) {
        const url = `${process.env.REACT_APP_BASE_API_URI}/auth/logout`;

        await axios.post(url).then((res) => {
            console.log(res);
            if (res.status === 200) toastSuccess("Successfully Logged Out!");
            dispatch(logoutStore());
            logout(next);
        }).catch((err) => {
            console.log(err);
            toastError(err?.data?.message);
        });
    };
};

// Forgot Password Request
export const forgotPassword = (email, next = () => { }) => {
    return async function forgotPasswordThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auth/forgot`;
        const body = { email: email };

        await axios.post(url, body).then((res) => {
            console.log(res);
            dispatch(setStatus(STATUSES.IDLE));
            toastSuccess("Reset Password Link Sent!");
            next();
        }).catch((err) => {
            console.log(err);
            dispatch(setStatus(STATUSES.ERROR));
            toastError(err?.response?.data?.Error);
        });
    };
};

// Change Password by Verification Mail
export const changePassword = (token, password, next = () => { }) => {
    return async function changePasswordThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auth/change-password/${token}/`;
        const body = { ...password };

        await axios.post(url, body).then((res) => {
            console.log(res);
            toastSuccess(res?.data?.message);
            dispatch(setStatus(STATUSES.IDLE));
            next();
        }).catch((err) => {
            console.log(err);
            toastError(err?.response?.data?.Error);
            dispatch(setStatus(STATUSES.ERROR));
        });
    }
}

// Register Employer's Team Member by Verification Mail
export const registerTeamMember = (token, member_details, next = () => { }) => {
    return async function registerTeamMemberThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/auth/register/${token}/`;
        const body = { ...member_details };

        await axios.post(url, body).then((res) => {
            console.log(res);
            toastSuccess(res?.data?.message);
            dispatch(setStatus(STATUSES.IDLE));
            next();
        }).catch((err) => {
            console.log(err);
            toastError(err?.response?.data?.Error);
            dispatch(setStatus(STATUSES.ERROR));
        });
    }
};

// Get All Notifications for a user
export const fetchNotifications = () => {
    return async function fetchNotificationsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/employer/notification`;
        const config = { withCredentials: true };

        await axios.get(url, config).then((res) => {
            console.log(res.data);
            dispatch(setNotifications(res.data));
            dispatch(setStatus(STATUSES.IDLE));
        }).catch((err) => {
            console.log(err);
            dispatch(setStatus(STATUSES.ERROR));
        });
    }
};

// Mark all Notifications for a user
export const markAllNotifications = () => {
    return async function markAllNotificationsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/employer/notification`;
        const config = { withCredentials: true };

        await axios.post(url, {}, config).then((res) => {
            console.log(res.data);
            dispatch(setStatus(STATUSES.IDLE));
            toastSuccess(res?.data?.message);
        }).catch((err) => {
            console.log(err);
            dispatch(setStatus(STATUSES.ERROR));
            toastError(err?.response?.data?.Error);
        });
    }
};

// Get All Team Members of an Employer
export const fetchAllTeamMembers = () => {
    return async function fetchAllTeamMembersThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/employer/employer-team`;
        const config = {
            withCredentials: true
        };

        await axios.get(url, config).then((res) => {
            dispatch(setStatus(STATUSES.IDLE));
            dispatch(setEmployerTeamMembers(res.data));
        }).catch((err) => {
            console.log(err);
            dispatch(setStatus(STATUSES.ERROR));
        });
    }
};

// Add a Team Member in Employer Profile
export const addEmployerTeamMember = (data) => {
    return async function addEmployerTeamMemberThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/employer/add-member`;
        const body = { member_email: [...data] };
        const config = {
            withCredentials: true
        };

        await axios.post(url, body, config).then((res) => {
            console.log(res);
            dispatch(setStatus(STATUSES.IDLE));
            if (res.status === 200) {
                toastSuccess(res?.data?.message);
            }
        }).catch((err) => {
            console.log(err);
            dispatch(setStatus(STATUSES.ERROR));
        });
    }
};

// Update Team Member of an Employer
export const updateTeamMember = (member_id, member_status) => {
    return async function updateTeamMemberThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/employer/employer-team`;
        const body = {
            id: member_id,
            flag: member_status
        };
        const config = {
            withCredentials: true
        };

        await axios.post(url, body, config).then((res) => {
            dispatch(fetchAllTeamMembers());
            dispatch(setStatus(STATUSES.IDLE));
            if (res.status === 200)
                toastSuccess("Team Member Account Updated!");
        }).catch((err) => {
            console.log(err);
            dispatch(setStatus(STATUSES.ERROR));
        });
    }
};

export const { logoutStore, setStatus, setEmployerTeamMembers, setNotifications } = authSlice.actions;
export default authSlice.reducer;