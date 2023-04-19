// get month in string like January, Feburary, ...
export const getMonthString = (dateStr, isShort = false) => {
    try {
        const month = new Date(dateStr).getMonth();
        switch (month) {
            case 0: return !isShort ? "January" : "Jan";
            case 1: return !isShort ? "Feburary" : "Feb";
            case 2: return !isShort ? "March" : "Mar";
            case 3: return !isShort ? "April" : "Apr";
            case 4: return !isShort ? "May" : "May";
            case 5: return !isShort ? "June" : "Jun";
            case 6: return !isShort ? "July" : "Jul";
            case 7: return !isShort ? "August" : "Aug";
            case 8: return !isShort ? "September" : "Sept";
            case 9: return !isShort ? "Octobar" : "Oct";
            case 10: return !isShort ? "November" : "Nov";
            case 11: return !isShort ? "December" : "Dec";
            default: return dateStr;
        };
    } catch (err) {
        console.error(err);
        return dateStr;
    }
};

// get first char of first_name & last_name of user
export const getUserAlias = (first_name, last_name) => {
    const firstChr = first_name?.substring(0, 1);
    const lastChr = last_name?.substring(0, 1) || "";
    return `${firstChr}${lastChr}`;
};

// validate email (will return not-null if validate otherwise null)
export const validateEmail = (email) => {
    if (String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) !== null) return true;
    return false;
}