import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistanceToNow } from "date-fns";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

const { width } = Dimensions.get("window");

interface Notification {
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

const saveNotification = async (notification: Notification) => {
  try {
    const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifs: Notification[] = existing ? JSON.parse(existing) : [];
    notifs.unshift(notification); // newest first
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch (e) {
    // handle error
  }
};

const loadNotifications = async (): Promise<Notification[]> => {
  try {
    const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (e) {
    return [];
  }
};

console.log("[NotificationsScreen] File loaded");
const NotificationsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    console.log("[NotificationsScreen] useEffect (mount)");
    // Load notifications on mount
    (async () => {
      try {
        const loaded = await loadNotifications();
        console.log(
          "[NotificationsScreen] Loaded Notifications from AsyncStorage",
          loaded
        );
        setNotifs(loaded);
      } catch (e) {
        console.error(
          "[NotificationsScreen] Error loading notifications from AsyncStorage",
          e
        );
      }
    })();
    // Listen for new notifications
    const sub = Notifications.addNotificationReceivedListener(async (notif) => {
      console.log(
        "[NotificationsScreen] Notification Listener Triggered",
        notif
      );
      const data = notif.request.content.data || {};
      const n: Notification = {
        id: notif.request.identifier,
        title:
          typeof notif.request.content.title === "string"
            ? notif.request.content.title
            : t("No Title"),
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
      console.log("[NotificationsScreen] Notification Received", n);
      try {
        await saveNotification(n);
        console.log(
          "[NotificationsScreen] Notification saved to AsyncStorage",
          n
        );
      } catch (e) {
        console.error(
          "[NotificationsScreen] Error saving notification to AsyncStorage",
          e
        );
      }
      setNotifs((prev) => {
        const updated = [n, ...prev];
        console.log(
          "[NotificationsScreen] Updated Notification List After Save",
          updated
        );
        return updated;
      });
    });
    return () => {
      sub.remove();
      console.log("[NotificationsScreen] useEffect (unmount)");
    };
  }, []);

  const onRefresh = async () => {
    console.log("[NotificationsScreen] onRefresh called");
    setRefreshing(true);
    try {
      const loaded = await loadNotifications();
      console.log(
        "[NotificationsScreen] Loaded Notifications on Refresh",
        loaded
      );
      setNotifs(loaded);
    } catch (e) {
      console.error(
        "[NotificationsScreen] Error loading notifications on refresh",
        e
      );
    }
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    console.log("[NotificationsScreen] handleNotificationPress", notification);
    router.push({
      pathname: "/notifications/detail",
      params: { notification: JSON.stringify(notification) },
    });
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    console.log("[NotificationsScreen] renderNotification", item);
    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={styles.titleContainer}>
              <IconSymbol
                name={getNotificationIcon(item.notification_type)}
                size={20}
                color="#3e6b2f"
                style={styles.notificationIcon}
              />
              <Text style={styles.notificationTitle}>{item.title}</Text>
            </View>
          </View>
          {item.image_url && (
            <Image
              source={{ uri: item.image_url }}
              style={styles.notificationImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.notificationBody}>{item.body}</Text>
          {item.button_text && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNotificationPress(item)}
            >
              <Text style={styles.buttonText}>{t(item.button_text)}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.notificationTime}>
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getNotificationIcon = (type: string) => {
    console.log("[NotificationsScreen] getNotificationIcon", type);
    switch ((type || "").toLowerCase()) {
      case "promotion":
        return "pricetag";
      case "message":
        return "chatbubble";
      case "system":
        return "settings";
      case "alert":
        return "alert-circle";
      default:
        return "notifications-none";
    }
  };

  // Log all state on every render
  useEffect(() => {
    console.log("[NotificationsScreen] State snapshot", {
      refreshing,
      notifs,
    });
  });

  // Log the notifications shown in the FlatList before rendering
  console.log("[Notifications Displayed in FlatList]", notifs);
  return (
    <View style={{ flex: 1, backgroundColor: "#e9f5e1" }}>
      {/* Header with back button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#3e6b2f",
          paddingTop: 44,
          paddingBottom: 18,
          paddingHorizontal: 14,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          zIndex: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12, padding: 4 }}
        >
          <IconSymbol name="chevron-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          {t("Notifications")}
        </Text>
      </View>
      <FlatList
        data={notifs}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("No notifications yet")}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 12,
  },
  notificationItem: {
    backgroundColor: "#e9f5e1",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#b7c9a8",
  },
  notificationContent: {
    padding: 12,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notificationIcon: {
    marginRight: 6,
  },
  notificationTitle: {
    color: "#3e6b2f",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  notificationImage: {
    width: width - 48,
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationBody: {
    color: "#222",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    color: "#666666",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#3e6b2f",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9f5e1",
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  headerButtonText: {
    color: "#3e6b2f",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    color: "#666666",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  listContent: {
    padding: 12,
  },
  customHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  headerIconButton: {
    padding: 4,
  },
  headerCenterTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#3e6b2f",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRightTextContainer: {
    minWidth: 60,
    alignItems: "flex-end",
  },
});

export default NotificationsScreen;
