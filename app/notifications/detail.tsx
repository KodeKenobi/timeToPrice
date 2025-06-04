import { formatDistanceToNow } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

console.log("[NotificationDetail] File loaded");

export const options = { headerShown: false };

export default function NotificationDetail(props: any) {
  console.log("[NotificationDetail] Render", { props });
  const router = useRouter();
  const { notification } = useLocalSearchParams();
  const notificationObj = notification
    ? JSON.parse(notification as string)
    : null;
  console.log("[NotificationDetail] notification param", notification);
  console.log("[NotificationDetail] notificationObj", notificationObj);
  const { t } = useTranslation();

  if (!notificationObj) {
    console.log("[NotificationDetail] No notificationObj");
    return (
      <View style={styles.container}>
        <Text style={{ color: "#222", textAlign: "center", marginTop: 40 }}>
          No notification data.
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log("[NotificationDetail] Go Back pressed");
            router.back();
          }}
          style={{ padding: 8 }}
        >
          <Text style={{ color: "#3e6b2f" }}>{t("Go Back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleButtonPress = async () => {
    console.log("[NotificationDetail] handleButtonPress", notificationObj);
    if (notificationObj.button_link) {
      try {
        await Linking.openURL(notificationObj.button_link);
        console.log(
          "[NotificationDetail] Opened URL",
          notificationObj.button_link
        );
      } catch (error) {
        console.error("[NotificationDetail] Error opening URL:", error);
      }
    } else if (notificationObj.screen) {
      router.push(notificationObj.screen);
      console.log(
        "[NotificationDetail] Navigated to screen",
        notificationObj.screen
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {notificationObj.image_url && (
          <Image
            source={{ uri: notificationObj.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Text style={styles.title}>{notificationObj.title}</Text>
        <Text style={styles.time}>
          {formatDistanceToNow(new Date(notificationObj.created_at), {
            addSuffix: true,
          })}
        </Text>

        <Text style={styles.body}>{notificationObj.body}</Text>

        {(notificationObj.button_text || notificationObj.button_link) && (
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>
              {notificationObj.button_text || t("Open Link")}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          console.log("[NotificationDetail] Go Back pressed");
          router.back();
        }}
        style={{ padding: 8 }}
      >
        <Text style={{ color: "#3e6b2f" }}>{t("Go Back")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    justifyContent: "center",
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    color: "#3e6b2f",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  time: {
    color: "#666666",
    fontSize: 14,
    marginBottom: 16,
  },
  body: {
    color: "#222",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#3e6b2f",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
