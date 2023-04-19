import { setLocalStorage, getLocalStorage, removeLocalStorage } from "./LocalStorage";

// Store User Authentication
export const setAuthentication = (user) => {
    setLocalStorage("user", user);
};

// Check whether user is Authenticated or not
export const isAuthenticated = () => {
    if (getLocalStorage("user"))
        return getLocalStorage("user");
    return false;
};

// Logout User from System
export const logout = (next) => {
    removeLocalStorage("user");
    next();
};