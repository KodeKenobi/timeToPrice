import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

interface HomeHeaderProps {
  showStats?: boolean;
  showGreeting?: boolean;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  title?: string;
  centerTitle?: boolean;
  alertsCount?: number;
  commoditiesCount?: number;
  lastCalcTime?: Date | null;
  onBackPress?: () => void;
  paddingOverride?: { paddingTop?: number; paddingBottom?: number };
}

// Compact relative time formatter
function formatCompactDistanceToNow(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk}w ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  const yr = Math.floor(day / 365);
  return `${yr}y ago`;
}

export const HomeHeader = ({
  showStats = false,
  showGreeting = false,
  notificationCount = 0,
  onNotificationsPress,
  title = "Dashboard",
  centerTitle = false,
  alertsCount = 0,
  commoditiesCount = 0,
  lastCalcTime = null,
  onBackPress,
  paddingOverride,
}: HomeHeaderProps) => {
  // Compute dynamic padding if override is provided
  const headerBgStyle = [
    styles.headerBg,
    centerTitle && styles.headerBgCompact,
    paddingOverride && {
      paddingTop:
        paddingOverride.paddingTop ??
        (centerTitle
          ? styles.headerBgCompact.paddingTop
          : styles.headerBg.paddingTop),
      paddingBottom:
        paddingOverride.paddingBottom ??
        (centerTitle
          ? styles.headerBgCompact.paddingBottom
          : styles.headerBg.paddingBottom),
    },
    onBackPress && { paddingHorizontal: 4 },
  ];
  return (
    <View style={headerBgStyle}>
      <View style={[styles.headerRow, centerTitle && styles.headerRowCenter]}>
        {onBackPress && (
          <Pressable
            onPress={onBackPress}
            style={{
              marginRight: 0,
              alignItems: "center",
              justifyContent: "center",
              minWidth: 44,
              minHeight: 44,
            }}
            hitSlop={10}
          >
            <IconSymbol
              name="chevron.right"
              size={28}
              color="#fff"
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </Pressable>
        )}
        <View style={centerTitle ? styles.headerContentCenter : undefined}>
          {showGreeting ? (
            <>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.subtext}>Welcome to our app</Text>
            </>
          ) : (
            <Text style={styles.headerTitle}>{title}</Text>
          )}
        </View>
        <View style={styles.headerIcons}>
          <Pressable
            onPress={onNotificationsPress}
            style={{
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 44,
              minHeight: 44,
            }}
          >
            <View style={styles.headerNotifCircle}>
              <IconSymbol name="notifications-none" size={25} color="#fff" />
            </View>
            {notificationCount > 0 && (
              <View style={styles.notificationBadgeOuter}>
                <Text style={styles.notificationBadgeOuterText}>
                  {notificationCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
      {showStats && (
        <View style={styles.infoCardWhite}>
          <View style={styles.statsRowHorz}>
            <View style={styles.statsItemHorz}>
              <IconSymbol name="notifications-none" size={20} color="#7a7a52" />
              <Text style={styles.statsValueHorz}>{alertsCount}</Text>
              <Text style={styles.statsLabelHorz}>Saved Alerts</Text>
            </View>
            <View style={styles.statsItemHorz}>
              <IconSymbol name="eco" size={20} color="#7a7a52" />
              <Text style={styles.statsValueHorz}>{commoditiesCount}</Text>
              <Text style={styles.statsLabelHorz}>Commodities</Text>
            </View>
            <View style={styles.statsItemHorz}>
              <IconSymbol name="access-time" size={20} color="#7a7a52" />
              <Text style={styles.statsValueHorz}>
                {lastCalcTime ? formatCompactDistanceToNow(lastCalcTime) : "-"}
              </Text>
              <Text style={styles.statsLabelHorz}>Last Calc</Text>
            </View>
          </View>
          <View style={styles.statsDividerHorz} />
          <Text style={styles.motivationHorz}>
            You're on track for a great season!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerBg: {
    backgroundColor: "#3e6b2f",
    paddingTop: 54,
    paddingBottom: 32,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 2,
  },
  headerBgCompact: {
    paddingTop: 28,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerRowCenter: {
    justifyContent: "center",
  },
  headerContentCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
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
    paddingHorizontal: 0,
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
