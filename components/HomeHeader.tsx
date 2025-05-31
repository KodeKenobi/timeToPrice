import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

interface HomeHeaderProps {
  showStats?: boolean;
  showGreeting?: boolean;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  title?: string;
  centerTitle?: boolean;
}

export const HomeHeader = ({
  showStats = false,
  showGreeting = false,
  notificationCount = 0,
  onNotificationsPress,
  title = "Dashboard",
  centerTitle = false,
}: HomeHeaderProps) => {
  return (
    <View style={[styles.headerBg, centerTitle && styles.headerBgCompact]}>
      <View style={[styles.headerRow, centerTitle && styles.headerRowCenter]}>
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
              <IconSymbol name="home" size={20} color="#7a7a52" />
              <Text style={styles.statsValueHorz}>4</Text>
              <Text style={styles.statsLabelHorz}>Total fields</Text>
            </View>
            <View style={styles.statsItemHorz}>
              <IconSymbol name="eco" size={20} color="#7a7a52" />
              <Text style={styles.statsValueHorz}>2</Text>
              <Text style={styles.statsLabelHorz}>Crops planted</Text>
            </View>
            <View style={styles.statsItemHorz}>
              <IconSymbol name="access-time" size={20} color="#7a7a52" />
              <Text style={styles.statsValueHorz}>2d</Text>
              <Text style={styles.statsLabelHorz}>Last calc</Text>
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
