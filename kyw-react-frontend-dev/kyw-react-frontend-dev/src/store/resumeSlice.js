import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toastError, toastSuccess } from "../helpers/Notification";

// API Statuses
const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading"
});

const resumeSlice = createSlice({
    name: "resume",
    initialState: {
        status: STATUSES.IDLE,
        autofill_resume: {
            resume_file: {},
            parsed_resume: {}
        },
        my_information: {
            preferred_worklocation: [],
            address: {},
            dob: "",
            gender: ""
        },
        my_experience: {
            about: "",
            work_experience: [],
            projects: [],
            current_employer: "",
            current_role: "",
            expected_role: "",
            relevant_experience: "",
            total_experience: "",
            notice_period: "",
            social_network_links: {
                linkedin: "",
                twitter: "",
                github: "",
                facebook: ""
            }
        },
        my_education: {
            education: []
        },
        skills_certification: {
            skills: [],
            certifications: [],
            accomplishments: "",
            websites: []
        },
    },
    reducers: {
        setResumeStatus(state, action) {
            state.status = action.payload;
        },
        setResumeFileRedux(state, action) {
            state.autofill_resume.resume_file = action.payload;
        },
        setParsedResumeDataRedux(state, action) {
            state.autofill_resume.parsed_resume = action.payload;
        },
        setMyInformationRedux(state, action) {
            state.my_information.about = action.payload.about;
            state.my_information.preferred_worklocation = action.payload.locations;
            state.my_information.address = action.payload.address;
            state.my_information.dob = action.payload.dob;
            state.my_information.gender = action.payload.gender;
        },
        setMyExperienceRedux(state, action) {
            state.my_experience.work_experience = action.payload.work_experience;
            state.my_experience.projects = action.payload.projects;
            state.my_experience.current_employer = action.payload.current_employer;
            state.my_experience.current_role = action.payload.current_role;
            state.my_experience.expected_role = action.payload.expected_role;
            state.my_experience.relevant_experience = action.payload.relevant_experience;
            state.my_experience.total_experience = action.payload.total_experience;
            state.my_experience.notice_period = action.payload.notice_period;
            state.my_experience.social_network_links = action.payload.social_network_links;
        },
        setMyEducationRedux(state, action) {
            state.my_education.education = action.payload.education;
        },
        setSkillsCertificationRedux(state, action) {
            state.skills_certification.skills = action.payload.skills;
            state.skills_certification.certifications = action.payload.certifications;
            state.skills_certification.accomplishments = action.payload.accomplishments;
            state.skills_certification.websites = action.payload.websites;
        }
    }
});

// Upload Resume Link to Backend after getting from AWS S3
export const uploadResumeLink = (resume_data = {}, next = () => {}) => {
    return async function uploadResumeLinkThunk(dispatch, getState) {
        dispatch(setResumeStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/resume/parser`;
        const body = { ...resume_data };
        const config = { withCredentials: true };

        await axios.post(url, body, config).then((res) => {
            console.log(res.data);
            dispatch(setResumeStatus(STATUSES.IDLE));
            dispatch(setParsedResumeDataRedux(res.data));
            next();
        }).catch((err) => {
            console.log(err);
            dispatch(setResumeStatus(STATUSES.ERROR));
            toastError("Error Occured in File Uploading!");
        });
    }
};

// submit candidate profile (with resume) data
export const submitCandidateProfile = (profile_data, next = () => { }) => {
    return async function submitCandidateProfileThunk(dispatch, getState) {
        dispatch(setResumeStatus(STATUSES.LOADING));

        const url = `${process.env.REACT_APP_BASE_API_URI}/candidate/profile`;
        const body = profile_data;
        const config = { withCredentials: true };

        await axios.post(url, body, config).then((res) => {
            console.log(res);
            dispatch(setResumeStatus(STATUSES.IDLE));
            toastSuccess("Profile Successfully Submitted!");
            next();
        }).catch((err) => {
            console.log(err);
            toastError(err?.response?.data?.Error);
            dispatch(setResumeStatus(STATUSES.ERROR));
        });
    }
};

export const { setResumeStatus, setResumeFileRedux, setParsedResumeDataRedux, setMyInformationRedux, setMyExperienceRedux, setMyEducationRedux, setSkillsCertificationRedux } = resumeSlice.actions;
export default resumeSlice.reducer;