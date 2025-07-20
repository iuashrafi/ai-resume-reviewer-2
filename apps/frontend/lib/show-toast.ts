import toast from "react-hot-toast";

export const showToast = (
  message: string,
  type?: "success" | "error" | "loading" | "custom",
  duration?: number
) => {
  const options = {
    duration: duration || 3000,
    position: "bottom-right" as const,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "loading":
      toast.loading(message, options);
      break;
    default:
      toast(message, options);
  }
};
