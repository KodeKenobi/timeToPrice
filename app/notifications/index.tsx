import { IconSymbol } from "@/components/ui/IconSymbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { HomeHeader } from "../../components/HomeHeader";

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

console.log("[NotificationsScreen (app/notifications/index)] File loaded");
export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const router = useRouter();
  const NOTIFICATIONS_KEY = "@local_notifications";

  useEffect(() => {
    console.log(
      "[NotificationsScreen (app/notifications/index)] useEffect (mount)"
    );
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (stored) {
          setNotifs(JSON.parse(stored));
        } else {
          setNotifs([]);
        }
      } catch (e) {
        setNotifs([]);
      }
    })();
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
    // Reload notifications from storage
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        setNotifs(JSON.parse(stored));
      } else {
        setNotifs([]);
      }
    } catch (e) {
      setNotifs([]);
    }
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

  // Remove all notifications
  const handleClearAll = async () => {
    setNotifs([]);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  };

  // Remove a single notification by id
  const handleRemoveNotification = async (id: string) => {
    setNotifs((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      return updated;
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
        {/* X button to remove notification */}
        <TouchableOpacity
          style={styles.closeNotifBtn}
          onPress={() => handleRemoveNotification(item.id)}
          hitSlop={10}
        >
          <IconSymbol name="close" size={18} color="#888" />
        </TouchableOpacity>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={styles.titleContainer}>
              <View style={styles.bellIconWrapper}>
                <IconSymbol
                  name="notifications-none"
                  size={20}
                  color="#3e6b2f"
                />
              </View>
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

  // Persist notifications to storage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  }, [notifs]);

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
      <HomeHeader
        title="Notifications"
        onBackPress={() => router.back()}
        paddingOverride={{ paddingTop: 40, paddingBottom: 28 }}
      />
      {/* Clear All Button */}
      <View style={styles.clearAllRow}>
        <View style={{ flex: 1 }} />
        {notifs.length > 0 && (
          <Text style={styles.clearAllText} onPress={handleClearAll}>
            Clear All
          </Text>
        )}
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -8,
    paddingTop: 0,
    // paddingHorizontal: 18,
    zIndex: 1,
  },
  listContainer: {
    padding: 12,
  },
  notificationItem: {
    backgroundColor: "#f7f8f6",
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
  bellIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e9f5e1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#b7c9a8",
  },
  notificationIcon: {
    marginRight: 6,
  },
  notificationTitle: {
    color: "#3e6b2f",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 2,
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
  clearAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 18,
    marginTop: 2,
    marginBottom: 6,
    minHeight: 28,
  },
  clearAllText: {
    color: "#3e6b2f",
    fontWeight: "bold",
    fontSize: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  closeNotifBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
});

export const options = { headerShown: false };
