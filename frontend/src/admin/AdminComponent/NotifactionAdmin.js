import React, { useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotifactionAdmin = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;

  const markAsRead = useCallback(async (id) => {
    try {
      await fetch(`${apiUrl}/mark-notification-read/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({ status: true }),
      });
    } catch (error) {
      // console.error("Error marking notification as read:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-notifications`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        });

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const displayedNotifications =
            JSON.parse(sessionStorage.getItem("displayedNotifications")) || [];
          const newNotifications = data.filter(
            (notification) => !displayedNotifications.includes(notification._id)
          );

          newNotifications.forEach((notification) => {
            const toastClass = getToastClass(notification.type);

            toast(notification.message, {
              className: toastClass,
              position: "top-right",
              autoClose: 6000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });

            markAsRead(notification._id);
          });

          const updatedDisplayedNotifications = [
            ...displayedNotifications,
            ...newNotifications.map((n) => n._id),
          ];
          sessionStorage.setItem(
            "displayedNotifications",
            JSON.stringify(updatedDisplayedNotifications)
          );
        } else {
          
          sessionStorage.removeItem("displayedNotifications");
        }
      } catch (error) {
        // console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [apiUrl, markAsRead]);

  // Function to determine the toast class based on notification type
  const getToastClass = (type) => {
    switch (type) {
      case "product-added":
        return "toast-success";
      case "product-delete":
        return "toast-error";
      case "product-updated":
        return "toast-info";
      case "order-placed":
        return "toast-warning";
      case "order-refund":
        return "toast-refund";
      case "order-return":
        return "toast-return";
      case "gallery-img-add":
        return "toast-success";
      case "gallery-img-delete":
        return "toast-error";
      case "gallery-img-edit":
        return "toast-info";
      case "client-img-add":
        return "toast-success";
      case "client-img-delete":
        return "toast-error";
      case "client-img-edit":
        return "toast-info";
      case "catgory-add":
        return "toast-success";
      case "catgory-delete":
        return "toast-error";
      case "catgory-edit":
        return "toast-info";
      default:
        return "";
    }
  };

  return <ToastContainer />;
};

export default React.memo(NotifactionAdmin);
