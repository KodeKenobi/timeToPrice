import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Notification {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  screen: string | null;
  params: Record<string, any>;
  notification_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const NOTIFICATIONS_KEY = "@local_notifications";

type NotificationContextType = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  clearAll: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        setNotifications(stored ? JSON.parse(stored) : []);
      } catch {
        setNotifications([]);
      }
    })();

    // Listen for new notifications globally
    const sub = Notifications.addNotificationReceivedListener(async (notif) => {
      const data = notif.request.content.data || {};
      const n: Notification = {
        id: notif.request.identifier,
        title:
          typeof notif.request.content.title === "string"
            ? notif.request.content.title
            : "No Title",
        body:
          typeof notif.request.content.body === "string"
            ? notif.request.content.body
            : "",
        image_url: typeof data.image_url === "string" ? data.image_url : null,
        button_text:
          typeof data.button_text === "string" ? data.button_text : null,
        button_link:
          typeof data.button_link === "string" ? data.button_link : null,
        screen: typeof data.screen === "string" ? data.screen : null,
        params:
          typeof data.params === "object" && data.params !== null
            ? data.params
            : {},
        notification_type:
          typeof data.notification_type === "string"
            ? data.notification_type
            : "system",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setNotifications((prev) => {
        const updated = [n, ...prev];
        AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
        return updated;
      });
    });

    return () => sub.remove();
  }, []);

  // Persist notifications to storage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Clear all notifications
  const clearAll = async () => {
    setNotifications([]);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  };

  // Remove a single notification
  const removeNotification = async (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, clearAll, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  return ctx;
};
