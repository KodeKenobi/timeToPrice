import CalculationForm from "@/components/CalculationForm";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CalculatePage() {
  return (
    <View style={styles.root}>
      {/* Header Section */}
      <View style={styles.headerBg}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Calculation</Text>
            <Text style={styles.subtext}>Enter your field costs</Text>
          </View>
          <View style={styles.headerIcons}>
            <View style={styles.headerIconCircle}>
              <IconSymbol name="notifications-none" size={20} color="#000" />
            </View>
          </View>
        </View>
      </View>
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
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
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
