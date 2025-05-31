import { IconSymbol } from "@/components/ui/IconSymbol";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const { width } = Dimensions.get("window");

// Dummy notification data for demo
const demoNotifications = [
  {
    id: "1",
    title: "Price Alert!",
    body: "YELLOW MAIZE FUTURE SPOT has exceeded your target price.",
    image_url: null,
    button_text: null,
    button_link: null,
    screen: null,
    params: {},
    notification_type: "alert",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "System Update",
    body: "Your app has been updated to the latest version.",
    image_url: null,
    button_text: null,
    button_link: null,
    screen: null,
    params: {},
    notification_type: "system",
    is_active: true,
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];

type Notification = (typeof demoNotifications)[number];

console.log("[NotificationsScreen (app/notifications/index)] File loaded");
export default function NotificationsScreen({
  notifications = demoNotifications,
}: {
  notifications?: Notification[];
}) {
  console.log("[NotificationsScreen (app/notifications/index)] Render", {
    notifications,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(notifications);
  const router = useRouter();

  useEffect(() => {
    console.log(
      "[NotificationsScreen (app/notifications/index)] useEffect (mount)"
    );
    return () => {
      console.log(
        "[NotificationsScreen (app/notifications/index)] useEffect (unmount)"
      );
    };
  }, []);

  const onRefresh = async () => {
    console.log(
      "[NotificationsScreen (app/notifications/index)] onRefresh called"
    );
    setRefreshing(true);
    // Fetch notifications here if needed
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    console.log(
      "[NotificationsScreen (app/notifications/index)] handleNotificationPress",
      notification
    );
    router.push({
      pathname: "/notifications/detail",
      params: { notification: JSON.stringify(notification) },
    });
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    console.log(
      "[NotificationsScreen (app/notifications/index)] renderNotification",
      item
    );
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
              <Text style={styles.buttonText}>{item.button_text}</Text>
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
    console.log(
      "[NotificationsScreen (app/notifications/index)] getNotificationIcon",
      type
    );
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
    console.log(
      "[NotificationsScreen (app/notifications/index)] State snapshot",
      {
        refreshing,
        notifs,
      }
    );
  });

  return (
    <View style={styles.root}>
      {/* Header Section */}
      <View style={styles.headerBg}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Notifications</Text>
          <View style={styles.headerIcons}>
            <View style={styles.headerNotifCircle}>
              <IconSymbol name="notifications-none" size={25} color="#fff" />
            </View>
          </View>
        </View>
      </View>
      {/* Main Content Section */}
      <View style={styles.contentSection}>
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
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#e9f5e1",
  },
  headerBg: {
    backgroundColor: "#3e6b2f",
    paddingTop: 54,
    paddingBottom: 32,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  greeting: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  headerNotifCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderColor: "#fff",
    borderWidth: 1,
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -8,
    paddingTop: 28,
    // paddingHorizontal: 18,
    zIndex: 1,
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

export const options = { headerShown: false };
