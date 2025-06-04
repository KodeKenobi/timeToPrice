import { IconSymbol } from "@/components/ui/IconSymbol";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  dismissAllNotifications,
  dismissNotificationById,
} from "../(tabs)/index";
import { HomeHeader } from "../../components/HomeHeader";
import {
  Notification,
  useNotifications,
} from "../../context/NotificationContext";

const { width } = Dimensions.get("window");

console.log("[NotificationsScreen (app/notifications/index)] File loaded");
export default function NotificationsScreen() {
  const { notifications, clearAll, removeNotification } = useNotifications();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    // No-op: notifications are always in sync via context
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  // Remove all notifications
  const handleClearAll = async () => {
    await clearAll();
    await dismissAllNotifications();
  };

  // Remove a single notification by id
  const handleRemoveNotification = async (id: string) => {
    await removeNotification(id);
    await dismissNotificationById(id);
  };

  const renderNotification = ({ item }: { item: Notification }) => {
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
              <Text style={styles.notificationTitle}>{t(item.title)}</Text>
            </View>
          </View>
          {item.image_url && (
            <Image
              source={{ uri: item.image_url }}
              style={styles.notificationImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.notificationBody}>{t(item.body)}</Text>
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
        notifications,
      }
    );
  });

  return (
    <View style={styles.root}>
      {/* Header Section */}
      <HomeHeader
        title={t("Notifications")}
        onBackPress={() => router.back()}
        paddingOverride={{ paddingTop: 60, paddingBottom: 28 }}
      />
      {/* Clear All Button */}
      <View style={styles.clearAllRow}>
        <View style={{ flex: 1 }} />
        {notifications.length > 0 && (
          <Text style={styles.clearAllText} onPress={handleClearAll}>
            {t("Clear All")}
          </Text>
        )}
      </View>
      {/* Main Content Section */}
      <View style={styles.contentSection}>
        <FlatList
          data={notifications}
          renderItem={
            renderNotification as ({
              item,
            }: {
              item: Notification;
            }) => React.ReactElement
          }
          keyExtractor={(item: Notification) => item.id}
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
      {/* Notification Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
            {selectedNotification && (
              <>
                <Text style={styles.modalTitle}>
                  {t(selectedNotification.title)}
                </Text>
                <Text style={styles.modalTime}>
                  {formatDistanceToNow(
                    new Date(selectedNotification.created_at),
                    { addSuffix: true }
                  )}
                </Text>
                {selectedNotification.image_url && (
                  <Image
                    source={{ uri: selectedNotification.image_url }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.modalBody}>
                  {t(selectedNotification.body)}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalCloseBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  modalCloseText: {
    fontSize: 28,
    color: "#3e6b2f",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3e6b2f",
    marginBottom: 8,
    textAlign: "center",
  },
  modalTime: {
    color: "#888",
    fontSize: 13,
    marginBottom: 12,
  },
  modalImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 16,
    color: "#222",
    textAlign: "center",
    marginBottom: 8,
  },
});

export const options = { headerShown: false };
