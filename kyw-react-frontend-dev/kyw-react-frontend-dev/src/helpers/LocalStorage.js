// Add Item in Local Storage
export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// Get Item from Local Storage
export const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

// Delete Item in Local Storage
export const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
};