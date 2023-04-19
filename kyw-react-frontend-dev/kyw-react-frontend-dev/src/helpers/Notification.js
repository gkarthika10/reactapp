import { toast } from "react-hot-toast";
import successNotificationMP3 from "../media/audio/success_notification.mp3";
import errorNotificationMP3 from "../media/audio/error_notification.mp3";

const notificationSuccess = new Audio(successNotificationMP3);
const notificationError = new Audio(errorNotificationMP3);
const common_toast_config = {
    position: "top-right",
    duration: 4000,
};

const common_toast_style = {
    boxShadow: "0px 1px 4px #2c2c2c",
    color: "#fff",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 400,
    letterSpacing: "0.7px",
    width: "fit-content"
};

export const toastSuccess = (message) => {
    notificationSuccess.play();
    toast.success(message, {
        ...common_toast_config,
        style: {
            ...common_toast_style,
            backgroundColor: "#2C7F2F",
        }
    });
};

export const toastError = (message) => {
    notificationError.play();
    toast.error(message, {
        ...common_toast_config,
        style: {
            ...common_toast_style,
            backgroundColor: "#df4759",
        }
    });
};

export const toastWarning = (message) => {
    notificationSuccess.play();
    toast(message, {
        ...common_toast_config,
        icon: '⚠',
        style: {
            ...common_toast_style,
            background: "#DBC300",
            iconTheme: {
                fontWeight: 800,
                primary: '#ffffff !important',
                border: "1.5px solid #fff",
                borderRadius: "50%"
            }
        },
    });
};