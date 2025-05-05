import React, { createContext, useState, useContext, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Notifications from "../../services/notification.service";
import { useAuth } from "../../common/AuthProvider";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (currentUser) {
          setIsLoading(true);
          const response = await Notifications.getNotifications();
          setNotifications(response.data);
        } else {
          setNotifications([]); 
        }
      } catch (err) {
        setError("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchNotifications();
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => console.debug("STOMP:", str),
      onConnect: () => {
        client.subscribe("/topic/notifications", (message) => {
          if (!isMounted) return;
          try {
            const notification = JSON.parse(message.body);
            if (shouldShowNotification(notification)) {
              setNotifications((prev) => {
                const exists = prev.some((n) => n.id === notification.id);
                return exists ? prev : [...prev, notification];
              });
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers.message);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      isMounted = false;
      client.deactivate();
    };
  }, []);

  const shouldShowNotification = (notification) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return false;
    return notification.recipientRoles?.some(
      (role) => user.roles.includes(role) || role === "ALL"
    );
  };

  const markAsRead = async (id) => {
    try {
      await Notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Notifications.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await Notifications.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
