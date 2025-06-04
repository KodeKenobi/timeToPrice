import { IconSymbol } from "@/components/ui/IconSymbol";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { XMLParser } from "fast-xml-parser";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  AppState,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import CostAnalysisModal from "../../components/CostAnalysisModal";
import { HomeHeader } from "../../components/HomeHeader";
import PreviousCalculationsModal from "../../components/PreviousCalculationsModal";
import { useNotifications } from "../../context/NotificationContext";
import { RootState, addAlert, removeAlert } from "../../lib/store";

const NOTIFICATIONS_KEY = "@local_notifications";

// Helper function for sentence case
function toSentenceCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Save notification to AsyncStorage for notifications screen
const saveNotification = async (notification: any) => {
  try {
    const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifs = existing ? JSON.parse(existing) : [];
    const n = {
      id: notification.request.identifier,
      title: notification.request.content.title || "No Title",
      body: notification.request.content.body || "",
      image_url: notification.request.content.data?.image_url || null,
      button_text: notification.request.content.data?.button_text || null,
      button_link: notification.request.content.data?.button_link || null,
      screen: notification.request.content.data?.screen || null,
      params: notification.request.content.data?.params || {},
      notification_type:
        notification.request.content.data?.notification_type || "system",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    notifs.unshift(n);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch (e) {
    // handle error
  }
};

// Export these helper functions for use in notifications screen
export const dismissNotificationById = async (id: string) => {
  try {
    await Notifications.dismissNotificationAsync(id);
  } catch {}
};

export const dismissAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch {}
};

export default function HomeScreen(props: any) {
  console.log("[HomeScreen] Render", { props });
  const [marketModalVisible, setMarketModalVisible] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [savedEntries, setSavedEntries] = useState<any[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef(AppState.currentState);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const router = useRouter();
  const [alertsModalVisible, setAlertsModalVisible] = useState(false);
  // Alerts modal form state
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedPriceType, setSelectedPriceType] = useState<
    "High" | "Low" | "Last"
  >("Last");
  const [targetValue, setTargetValue] = useState("");
  const alerts = useSelector((state: RootState) => state.alerts.alerts);
  const dispatch = useDispatch();
  const { notifications } = useNotifications();
  const { t } = useTranslation();
  // Get unique commodities from marketData
  const commodityOptions = Array.from(
    new Set(marketData.map((row: any) => row.SecurityName))
  ).filter(Boolean);

  // Log and filter commodityOptions before using in SelectDropdown
  const filteredCommodityOptions = commodityOptions.filter(
    (item) => typeof item === "string" && item.trim() !== ""
  );
  console.log("commodityOptions", filteredCommodityOptions);
  console.log("priceTypeOptions", ["High", "Low", "Last"]);

  const [lastCalcTime, setLastCalcTime] = useState<Date | null>(null);
  const [showPrevCalcs, setShowPrevCalcs] = useState(false);
  const [costAnalysisModalVisible, setCostAnalysisModalVisible] =
    useState(false);

  const addTestEntry = () => {
    setSavedEntries((entries) => {
      const updated = [
        ...entries,
        {
          commodity: "YELLOW MAIZE FUTURE SPOT",
          priceWithProfit: "5000",
        },
      ];
      console.log("[HomeScreen] addTestEntry", updated);
      return updated;
    });
  };

  const handleOpenMarketModal = () => {
    setMarketModalVisible(true);
    fetchMarketData();
    console.log("[HomeScreen] handleOpenMarketModal");
  };

  const cards = [
    {
      title: t("New Calculation"),
      subtitle: t("Create cost calculation"),
      badge: t("Calculate Now"),
      icon: "calculator",
      onPress: () => router.push("/calculate"),
    },
    {
      title: t("Previous Calculations"),
      subtitle: t("View history"),
      badge: t("History"),
      icon: "history",
      onPress: () => setShowPrevCalcs(true),
    },
    {
      title: t("Market Prices"),
      subtitle: t("Check current rates"),
      badge: t("Live Prices"),
      icon: "trending-up",
      onPress: handleOpenMarketModal,
    },
    {
      title: t("Cost Analysis"),
      subtitle: t("View insights"),
      badge: t("Analytics"),
      icon: "bar-chart",
      onPress: () => setCostAnalysisModalVisible(true),
    },
  ];

  useEffect(() => {
    console.log("[HomeScreen] useEffect (mount)");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("[HomeScreen] Notification permission status", status);
      if (status !== "granted") {
        alert("Enable notifications to receive price alerts!");
      }
    })();
    return () => {
      console.log("[HomeScreen] useEffect (unmount)");
    };
  }, []);

  const sendPriceAlertNotification = async (
    commodity: string,
    lastPrice: string,
    priceType?: string,
    targetValue?: number
  ) => {
    if (priceType && targetValue !== undefined) {
      // Atomic check and write in AsyncStorage
      const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      const notifs = existing ? JSON.parse(existing) : [];
      const duplicate = notifs.find(
        (n: any) =>
          n.params &&
          n.params.commodity === commodity &&
          n.params.priceType === priceType &&
          String(n.params.targetValue) === String(targetValue)
      );
      if (duplicate) {
        return; // Don't send duplicate
      }
      // Add new notification to storage
      const n = {
        id: Date.now().toString(),
        title: t("Alert"),
        body: t(
          "Your alert for {{commodity}} at {{lastPrice}} has been triggered!",
          { commodity, lastPrice }
        ),
        image_url: null,
        button_text: null,
        button_link: null,
        screen: null,
        params: { commodity, priceType, targetValue },
        notification_type: "system",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      notifs.unshift(n);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
      // Optionally: update context if needed (context will sync on next effect)
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t("Alert"),
        body: t(
          "Your alert for {{commodity}} at {{lastPrice}} has been triggered!",
          { commodity, lastPrice }
        ),
        sound: true,
        data: {
          commodity,
          priceType,
          targetValue,
          params: { commodity, priceType, targetValue },
        },
      },
      trigger: null,
    });
  };

  const fetchMarketData = async () => {
    setMarketLoading(true);
    setMarketError(null);
    console.log("[HomeScreen] fetchMarketData: start");
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setMarketError(t("Request timed out. Please try again."));
      setMarketLoading(false);
    }, 8000); // 8 seconds
    try {
      const url =
        "https://df.marketdata.feeds.iress.com/feed/2642/?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzZWNJRCI6MTE5NiwiaWF0IjoxNzQxNzExNjI3LCJhdWQiOiJpcmVzcy5jby56YSIsImlzcyI6ImFjY291bnRzLmlyZXNzLmNvLnphIn0.nWybRXpaODHmTTM80mJScPWX7noGWcxXHUdl8E05KtljjEvVqs4hgZt7hc2nCJzJBN_AOfavu3TG1wv8LHJ18Q";
      console.log("[HomeScreen] fetchMarketData: fetching", url);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      console.log("[HomeScreen] fetchMarketData: response", response.status);
      if (!response.ok) throw new Error("Failed to fetch market data");
      const text = await response.text();
      // Parse XML using fast-xml-parser
      const parser = new XMLParser();
      const xmlObj = parser.parse(text);
      const records = Array.isArray(xmlObj.data?.record)
        ? xmlObj.data.record
        : xmlObj.data?.record
        ? [xmlObj.data.record]
        : [];
      const data = records.map((node: any) => ({
        SecurityName: node.SecurityName || "",
        HighPrice: node.HighPrice || "",
        LowPrice: node.LowPrice || "",
        LastPrice: node.LastPrice || "",
      }));
      setMarketData(data);
      console.log("[HomeScreen] fetchMarketData: parsed data", data);
      data.forEach((row: any) => {
        const securityName = row.SecurityName;
        const lastPrice = parseFloat(row.LastPrice || "0");
        savedEntries.forEach((entry) => {
          if (entry.commodity === securityName) {
            const targetPrice = parseFloat(entry.priceWithProfit || "0");
            if (lastPrice > targetPrice && targetPrice > 0) {
              sendPriceAlertNotification(
                securityName,
                row.LastPrice,
                undefined,
                undefined
              );
            }
          }
        });
        // Redux alerts logic
        alerts.forEach(
          (alert: {
            commodity: string;
            priceType: "High" | "Low" | "Last";
            targetValue: number;
          }) => {
            let priceValue = 0;
            if (alert.priceType === "High")
              priceValue = parseFloat(row.HighPrice || "0");
            if (alert.priceType === "Low")
              priceValue = parseFloat(row.LowPrice || "0");
            if (alert.priceType === "Last")
              priceValue = parseFloat(row.LastPrice || "0");
            if (
              alert.commodity === securityName &&
              priceValue === alert.targetValue
            ) {
              // Only send one notification per alert per fetch
              sendPriceAlertNotification(
                securityName,
                `${alert.priceType} price hit: ${alert.targetValue}`,
                alert.priceType,
                alert.targetValue
              );
              // Add to notificationsList for notifications screen
              setNotificationsList((prev) => [
                {
                  request: {
                    content: {
                      title: `Alert for ${securityName}`,
                      body: `${alert.priceType} price hit: ${alert.targetValue}`,
                    },
                  },
                  date: new Date().toISOString(),
                },
                ...prev,
              ]);
            }
          }
        );
      });
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        setMarketError(t("Request timed out. Please try again."));
      } else {
        setMarketError(
          err.message ||
            t(
              "Unable to load market data. Please check your connection or try again later."
            )
        );
      }
      console.error("[HomeScreen] fetchMarketData: error", err);
    } finally {
      setMarketLoading(false);
      console.log("[HomeScreen] fetchMarketData: end");
    }
  };

  useEffect(() => {
    console.log("[HomeScreen] useEffect (fetchMarketData, savedEntries)", {
      savedEntries,
    });
    fetchMarketData();
    intervalRef.current = setInterval(fetchMarketData, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      console.log("[HomeScreen] useEffect (cleanup fetchMarketData interval)");
    };
  }, [savedEntries]);

  const cardsWithModal = cards.map((card) =>
    card.title === "Market Prices"
      ? { ...card, onPress: handleOpenMarketModal }
      : card
  );

  useEffect(() => {
    console.log("[HomeScreen] useEffect (notification listener)");
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotificationsList((prev) => {
          const updated = [notification, ...prev];
          console.log("[HomeScreen] Notification received", notification);
          console.log("[HomeScreen] Updated notificationsList", updated);
          return updated;
        });
        saveNotification(notification);
      }
    );
    return () => {
      subscription.remove();
      console.log("[HomeScreen] useEffect (notification listener cleanup)");
    };
  }, []);

  const handleOpenNotificationsScreen = () => {
    router.push("./notifications");
    console.log("[HomeScreen] handleOpenNotificationsScreen");
  };

  // Log all state on every render
  useEffect(() => {
    console.log("[HomeScreen] State snapshot", {
      marketModalVisible,
      marketLoading,
      marketData,
      marketError,
      savedEntries,
      notificationsList,
      alertsModalVisible,
    });
  });

  const handleAddAlert = () => {
    if (!selectedCommodity || !targetValue) return;
    dispatch(
      addAlert({
        id: Date.now().toString(),
        commodity: selectedCommodity,
        priceType: selectedPriceType,
        targetValue: parseFloat(targetValue),
      })
    );
    setSelectedCommodity("");
    setSelectedPriceType("Last");
    setTargetValue("");
  };

  const handleDeleteAlert = (id: string) => {
    dispatch(removeAlert(id));
  };

  useEffect(() => {
    const loadLastCalcTime = async () => {
      try {
        const ts = await AsyncStorage.getItem("@last_calc_time");
        setLastCalcTime(ts ? new Date(Number(ts)) : null);
      } catch (e) {
        setLastCalcTime(null);
      }
    };
    loadLastCalcTime();
  }, [alertsModalVisible]);

  // Add polling and AppState logic
  useEffect(() => {
    // Polling interval
    const interval = setInterval(() => {
      fetchMarketData();
    }, 30000); // every 30 seconds

    // AppState logic
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        fetchMarketData();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.root}>
      {/* Header Section */}
      <HomeHeader
        showStats
        showGreeting
        notificationCount={notifications.length}
        onNotificationsPress={handleOpenNotificationsScreen}
        alertsCount={alerts.length}
        commoditiesCount={commodityOptions.length}
        lastCalcTime={lastCalcTime}
      />
      {/* Main Content Section */}
      <View
        style={[styles.contentSection, { width: "100%", alignSelf: "center" }]}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t("Dashboard Shortcuts")}</Text>
          <TouchableOpacity
            style={styles.sectionViewAllBtn}
            onPress={() => setAlertsModalVisible(true)}
          >
            <Text style={styles.sectionViewAllBtnText}>{t("Alerts")}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.cardsListModern}
          contentContainerStyle={styles.cardsListContent}
          showsVerticalScrollIndicator={false}
        >
          {cards.map((card, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.cardModernSingle,
                pressed && styles.cardModernSinglePressed,
                idx === cards.length - 1 && { marginBottom: 0 },
              ]}
              onPress={card.onPress}
            >
              <View style={styles.cardRowModern}>
                {/* Icon always present */}
                <View style={styles.cardIconCircleModern}>
                  <IconSymbol name={card.icon} size={28} color="#3e6b2f" />
                </View>
                <View style={styles.cardTextBlockModern}>
                  <Text
                    style={styles.cardTitleModernSingle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {card.title}
                  </Text>
                  <Text style={styles.cardSubtitleModernSingle}>
                    {card.subtitle}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {/* Previous Calculations Modal */}
      <PreviousCalculationsModal
        visible={showPrevCalcs}
        onClose={() => setShowPrevCalcs(false)}
      />
      {/* Market Prices Modal */}
      <Modal
        visible={marketModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMarketModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Solid dark overlay to fully obscure the background */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.92)",
              zIndex: 0,
            }}
          />
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 0,
              width: "95%",
              maxWidth: 420,
              alignItems: "stretch",
              minHeight: 220,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
              zIndex: 1,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#e9f5e1",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
              }}
            >
              <Text style={{ flex: 2, fontWeight: "bold", color: "#3e6b2f" }}>
                {t("Commodity")}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontWeight: "bold",
                  color: "#3e6b2f",
                  textAlign: "right",
                }}
              >
                {t("High")}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontWeight: "bold",
                  color: "#3e6b2f",
                  textAlign: "right",
                }}
              >
                {t("Low")}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontWeight: "bold",
                  color: "#3e6b2f",
                  textAlign: "right",
                }}
              >
                {t("Last")}
              </Text>
            </View>
            {/* Market Prices Modal Content */}
            <ScrollView style={{ maxHeight: 300 }}>
              {marketLoading ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 32,
                    marginBottom: 32,
                  }}
                >
                  <ActivityIndicator size="large" color="#3e6b2f" />
                  <Text
                    style={{
                      color: "#3e6b2f",
                      marginTop: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {t("Loading...")}
                  </Text>
                </View>
              ) : marketError ? (
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 32,
                    marginBottom: 32,
                  }}
                >
                  <Text
                    style={{
                      color: "#e57373",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    {marketError}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#3e6b2f",
                      borderRadius: 20,
                      paddingVertical: 10,
                      paddingHorizontal: 24,
                    }}
                    onPress={fetchMarketData}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      {t("Retry")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : commodityOptions.length === 0 ? (
                <Text
                  style={{ color: "#888", textAlign: "center", marginTop: 16 }}
                >
                  {t("No data available.")}
                </Text>
              ) : (
                marketData.map((row, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      backgroundColor: i % 2 === 0 ? "#f7faf3" : "#fff",
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text style={{ flex: 2, color: "#222" }}>
                      {row.SecurityName}
                    </Text>
                    <Text
                      style={{ flex: 1, color: "#222", textAlign: "right" }}
                    >
                      {row.HighPrice && row.HighPrice !== ""
                        ? row.HighPrice
                        : "0"}
                    </Text>
                    <Text
                      style={{ flex: 1, color: "#222", textAlign: "right" }}
                    >
                      {row.LowPrice && row.LowPrice !== "" ? row.LowPrice : "0"}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: "#3e6b2f",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      {row.LastPrice && row.LastPrice !== ""
                        ? row.LastPrice
                        : "0"}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: "#3e6b2f",
                borderRadius: 24,
                paddingVertical: 14,
                marginHorizontal: 24,
                marginVertical: 18,
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 2,
              }}
              onPress={() => setMarketModalVisible(false)}
              disabled={marketLoading}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Alerts Modal */}
      <Modal
        visible={alertsModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setAlertsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#f4f8f2",
            justifyContent: "flex-start",
          }}
        >
          <HomeHeader
            title={t("Alerts")}
            notificationCount={notifications.length}
            onNotificationsPress={handleOpenNotificationsScreen}
            centerTitle
            onBackPress={() => setAlertsModalVisible(false)}
          />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 24,
              paddingTop: 12,
              width: "100%",
              alignSelf: "center",
              paddingBottom: 40,
              flexGrow: 1,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 22,
                color: "#3e6b2f",
                marginBottom: 18,
              }}
            >
              {t("manage_price_alerts")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e9f5e1",
                borderRadius: 10,
                padding: 14,
                marginBottom: 18,
                marginTop: 2,
                borderWidth: 1,
                borderColor: "#b7c9a8",
              }}
            >
              <MaterialIcons
                name="info-outline"
                size={22}
                color="#3e6b2f"
                style={{ marginRight: 10 }}
              />
              <Text style={{ color: "#3e6b2f", fontSize: 15, flex: 1 }}>
                {t("dashboard_tip")}
              </Text>
            </View>
            {marketLoading ? (
              <View style={{ alignItems: "center", marginVertical: 32 }}>
                <ActivityIndicator size="large" color="#3e6b2f" />
                <Text
                  style={{
                    color: "#3e6b2f",
                    marginTop: 12,
                    fontWeight: "bold",
                  }}
                >
                  {t("Loading commodities...")}
                </Text>
              </View>
            ) : marketError ? (
              <View style={{ alignItems: "center", marginVertical: 32 }}>
                <Text
                  style={{
                    color: "#e57373",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginBottom: 12,
                  }}
                >
                  {marketError}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3e6b2f",
                    borderRadius: 20,
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                  }}
                  onPress={fetchMarketData}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {t("Retry")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : commodityOptions.length === 0 ? (
              <Text
                style={{ color: "#888", textAlign: "center", marginTop: 16 }}
              >
                {t("No data available.")}
              </Text>
            ) : (
              <>
                <Text
                  style={{
                    color: "#3e6b2f",
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  {t("Commodity")}
                </Text>
                <View style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      width: "100%",
                      borderWidth: 1,
                      borderColor: "#3e6b2f",
                      borderRadius: 8,
                      backgroundColor: "#fff",
                      height: 44,
                      marginBottom: 12,
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <SelectDropdown
                      data={commodityOptions}
                      onSelect={(selectedItem: string) =>
                        setSelectedCommodity(selectedItem)
                      }
                      defaultButtonText={t("Select commodity...")}
                      buttonTextAfterSelection={(selectedItem: string) =>
                        selectedItem
                      }
                      rowTextForSelection={(item: string) => item}
                      buttonStyle={{
                        flex: 1,
                        backgroundColor: "transparent",
                        borderWidth: 0,
                        height: 44,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingHorizontal: 12,
                      }}
                      buttonTextStyle={{
                        color: "#222",
                        textAlign: "left",
                        fontSize: 16,
                      }}
                      dropdownStyle={{
                        borderRadius: 8,
                      }}
                      rowStyle={{
                        height: 44,
                        alignItems: "center",
                      }}
                      rowTextStyle={{
                        color: "#222",
                        fontSize: 16,
                      }}
                      selectedRowStyle={{ backgroundColor: "#e9f5e1" }}
                    />
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={28}
                      color="#3e6b2f"
                      style={{
                        position: "absolute",
                        right: 8,
                        pointerEvents: "none",
                      }}
                    />
                  </View>
                </View>
                <Text
                  style={{
                    color: "#3e6b2f",
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  {t("Price Type")}
                </Text>
                <View style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      width: "100%",
                      borderWidth: 1,
                      borderColor: "#3e6b2f",
                      borderRadius: 8,
                      backgroundColor: "#fff",
                      height: 44,
                      marginBottom: 12,
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <SelectDropdown
                      data={["High", "Low", "Last"]}
                      onSelect={(selectedItem: "High" | "Low" | "Last") =>
                        setSelectedPriceType(selectedItem)
                      }
                      defaultButtonText={t("Select price type...")}
                      buttonTextAfterSelection={(selectedItem: string) =>
                        t(selectedItem)
                      }
                      rowTextForSelection={(item: string) => t(item)}
                      buttonStyle={{
                        flex: 1,
                        backgroundColor: "transparent",
                        borderWidth: 0,
                        height: 44,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingHorizontal: 12,
                      }}
                      buttonTextStyle={{
                        color: "#222",
                        textAlign: "left",
                        fontSize: 16,
                      }}
                      dropdownStyle={{
                        borderRadius: 8,
                      }}
                      rowStyle={{
                        height: 44,
                        alignItems: "center",
                      }}
                      rowTextStyle={{
                        color: "#222",
                        fontSize: 16,
                      }}
                      selectedRowStyle={{ backgroundColor: "#e9f5e1" }}
                    />
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={28}
                      color="#3e6b2f"
                      style={{
                        position: "absolute",
                        right: 8,
                        pointerEvents: "none",
                      }}
                    />
                  </View>
                </View>
                <Text
                  style={{
                    color: "#3e6b2f",
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  {t("Target Value")}
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#3e6b2f",
                    borderRadius: 8,
                    marginBottom: 16,
                    paddingHorizontal: 8,
                  }}
                >
                  <TextInput
                    value={targetValue}
                    onChangeText={setTargetValue}
                    placeholder={t("Enter target value")}
                    keyboardType="numeric"
                    style={{ height: 44, fontSize: 16 }}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3e6b2f",
                    borderRadius: 24,
                    paddingVertical: 14,
                    alignItems: "center",
                    marginBottom: 18,
                    opacity: !selectedCommodity || !targetValue ? 0.5 : 1,
                  }}
                  onPress={handleAddAlert}
                  disabled={!selectedCommodity || !targetValue}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {t("Add Alert")}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: "#3e6b2f",
                marginBottom: 12,
                marginTop: 18,
              }}
            >
              {t("Saved Alerts")}
            </Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {alerts.length === 0 ? (
                <Text style={{ color: "#888", marginBottom: 16 }}>
                  {t("No alerts set.")}
                </Text>
              ) : (
                alerts.map(
                  (alert: {
                    id: string;
                    commodity: string;
                    priceType: string;
                    targetValue: number;
                  }) => (
                    <View
                      key={alert.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                        backgroundColor: "#f7faf3",
                        borderRadius: 12,
                        padding: 14,
                        shadowColor: "#000",
                        shadowOpacity: 0.04,
                        shadowRadius: 2,
                        elevation: 1,
                        borderWidth: 1,
                        borderColor: "#e9f5e1",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "#3e6b2f",
                            fontSize: 15,
                          }}
                        >
                          {toSentenceCase(alert.commodity)}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: "#7a7a52",
                              fontWeight: "bold",
                              fontSize: 13,
                              marginRight: 8,
                            }}
                          >
                            {t("{{type}} price", {
                              type: toSentenceCase(alert.priceType),
                            })}
                          </Text>
                          <View
                            style={{
                              backgroundColor: "#e9f5e1",
                              borderRadius: 8,
                              paddingHorizontal: 10,
                              paddingVertical: 2,
                              marginRight: 8,
                            }}
                          >
                            <Text
                              style={{
                                color: "#2e7d32",
                                fontWeight: "bold",
                                fontSize: 14,
                              }}
                            >
                              R{alert.targetValue}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteAlert(alert.id)}
                        style={{
                          marginLeft: 8,
                          padding: 6,
                          borderRadius: 16,
                        }}
                        accessibilityLabel={t("Delete alert")}
                      >
                        <MaterialIcons
                          name="delete"
                          size={22}
                          color="#e57373"
                        />
                      </TouchableOpacity>
                    </View>
                  )
                )
              )}
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: "#3e6b2f",
                borderRadius: 24,
                paddingVertical: 14,
                alignItems: "center",
                marginTop: 0,
              }}
              onPress={() => setAlertsModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      <CostAnalysisModal
        visible={costAnalysisModalVisible}
        onClose={() => setCostAnalysisModalVisible(false)}
      />
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
  subtext: {
    color: "#e0e7d6",
    fontSize: 14,
    fontWeight: "500",
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
  infoCardWhite: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 18,
    marginHorizontal: 2,
  },
  statsRowHorz: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  statsItemHorz: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsValueHorz: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#3e6b2f",
    marginTop: 2,
  },
  statsLabelHorz: {
    color: "#7a7a52",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  statsDividerHorz: {
    width: "80%",
    height: 1,
    backgroundColor: "#e9f5e1",
    marginVertical: 8,
    borderRadius: 1,
  },
  motivationHorz: {
    color: "#3e6b2f",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    marginTop: 2,
  },
  contentSection: {
    flex: 1,
    backgroundColor: "transparent",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -8,
    paddingTop: 28,
    paddingHorizontal: 18,
    zIndex: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  sectionViewAllBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#3e6b2f",
  },
  sectionViewAllBtnText: {
    color: "#3e6b2f",
    fontWeight: "bold",
    fontSize: 13,
  },
  cardsListModern: {
    flex: 1,
    marginTop: 8,
  },
  cardsListContent: {
    paddingBottom: 12,
  },
  cardModernSingle: {
    backgroundColor: "#f7f8f6",
    borderRadius: 18,
    marginBottom: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#b7c9a8",
    minWidth: 0,
    width: "100%",
    maxWidth: "100%",
  },
  cardModernSinglePressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.18,
  },
  cardRowModern: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconCircleModern: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e9f5e1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardTextBlockModern: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  cardTitleModernSingle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#3e6b2f",
    marginBottom: 2,
    flexShrink: 1,
    minWidth: 0,
  },
  cardSubtitleModernSingle: {
    fontSize: 13,
    color: "#7a7a52",
  },
  cardBadgePillModern: {
    backgroundColor: "#3e6b2f",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 12,
    alignSelf: "center",
  },
  cardBadgePillTextModern: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  notificationBadgeOuter: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#f2f3f2",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#e0e7d6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationBadgeOuterText: {
    color: "#3e6b2f",
    fontWeight: "bold",
    fontSize: 11,
  },
});
