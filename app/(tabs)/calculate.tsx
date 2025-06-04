import CalculationForm from "@/components/CalculationForm";
import { HomeHeader } from "@/components/HomeHeader";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function CalculatePage() {
  const { notifications } = useNotifications();
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      {/* Header Section */}
      <HomeHeader
        title={t("Calculate")}
        notificationCount={notifications.length}
        onNotificationsPress={() => router.push("../notifications")}
        paddingOverride={{ paddingTop: 54, paddingBottom: 32 }}
        onBackPress={() => router.back()}
      />
      {/* Main Content Section */}
      <View style={styles.contentSection}>
        <CalculationForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#e9f5e1",
  },
  contentSection: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -8,
    paddingTop: 28,
    zIndex: 1,
  },
});
