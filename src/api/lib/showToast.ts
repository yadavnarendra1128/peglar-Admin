import {toast} from 'react-toastify'
const showToast = (
  type: boolean,
  message: string = "Something went wrong",
  error?: any
) => {
  if (type) {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  } else {
    let errorMessage = "";

    if (error?.response?.data?.message) {
      errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(", ")
        : error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    toast.error(`${message}${errorMessage ? `: ${errorMessage}` : ""}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        width: "95%",
        margin: "10px auto",
      },
    });
  }
};

export default showToast;