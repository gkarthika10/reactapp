import Cookies from "js-cookie";

// Set Cookies
export const setCookies = (key, value) => {
    Cookies.set(key, value, { expires: 1 });
};

// Get Cookies
export const getCookies = (key) => {
    return Cookies.get(key);
};

// Remove Cookies
export const removeCookies = (key) => {
    Cookies.remove(key);
};