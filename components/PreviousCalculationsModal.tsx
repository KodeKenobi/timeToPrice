import { HomeHeader } from "@/components/HomeHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PREVIOUS_CALCS_KEY = "@previous_calculations";

export default function PreviousCalculationsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [calculations, setCalculations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const fetchCalcs = async () => {
      setLoading(true);
      try {
        const data = await AsyncStorage.getItem(PREVIOUS_CALCS_KEY);
        setCalculations(data ? JSON.parse(data) : []);
      } catch (e) {
        setCalculations([]);
      }
      setLoading(false);
    };
    fetchCalcs();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <HomeHeader
          title="Previous Calculations"
          onBackPress={onClose}
          paddingOverride={{ paddingTop: 54, paddingBottom: 32 }}
        />
        <ScrollView contentContainerStyle={styles.contentSection}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#3e6b2f"
              style={{ marginTop: 40 }}
            />
          ) : calculations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No previous calculations found.
              </Text>
            </View>
          ) : (
            calculations.map((entry, idx) => (
              <View key={idx} style={styles.calcCard}>
                <Text style={styles.calcDate}>
                  {new Date(entry.timestamp).toLocaleString()}
                </Text>
                <Text style={styles.calcTitle}>{entry.fields.commodity}</Text>
                <View
                  style={{ borderRadius: 12, overflow: "hidden", marginTop: 8 }}
                >
                  {[
                    { label: "Hectares Planted", value: entry.fields.hectares },
                    { label: "Total Seed Cost", value: entry.fields.seedCost },
                    {
                      label: "Total Fertiliser Cost",
                      value: entry.fields.fertiliserCost,
                    },
                    {
                      label: "Estimated Total Chemicals Cost",
                      value: entry.fields.chemicalsCost,
                    },
                    {
                      label: "Total Employee Cost",
                      value: entry.fields.employeeCost,
                    },
                    {
                      label: "Total Eskom Cost",
                      value: entry.fields.eskomCost,
                    },
                    { label: "Total Fuel Cost", value: entry.fields.fuelCost },
                    {
                      label: "Total Transport Cost",
                      value: entry.fields.transportCost,
                    },
                    {
                      label: "Other Expenses",
                      value: entry.fields.otherExpenses,
                    },
                    {
                      label: "Total Profit Wanted",
                      value: entry.fields.profitWanted,
                    },
                    {
                      label: "Average long term yield per Hectare",
                      value: entry.fields.averageYield,
                    },
                    {
                      label: "Do you have insurance?",
                      value: entry.fields.hasInsurance ? "Yes" : "No",
                    },
                    ...(entry.fields.hasInsurance
                      ? [
                          {
                            label: "Insurance Amount",
                            value: entry.fields.insurance,
                          },
                        ]
                      : []),
                    { label: "Commodity", value: entry.fields.commodity },
                  ].map((row, i) => (
                    <View
                      key={row.label}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: i % 2 === 0 ? "#f7faf3" : "#f0f4ea",
                        paddingVertical: 10,
                        paddingHorizontal: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "#3e6b2f",
                          fontWeight: "bold",
                          fontSize: 15,
                        }}
                      >
                        {row.label}
                      </Text>
                      <Text style={{ color: "#222", fontSize: 15 }}>
                        {row.value}
                      </Text>
                    </View>
                  ))}
                </View>
                <View
                  style={{
                    backgroundColor: "#e9f5e1",
                    borderRadius: 10,
                    paddingVertical: 14,
                    paddingHorizontal: 8,
                    marginTop: 16,
                    shadowColor: "#2e7d32",
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#2e7d32",
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    Break-even Price per ton: R{entry.result?.breakEven}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#2e7d32",
                      fontWeight: "bold",
                    }}
                  >
                    Price per ton (including profit): R
                    {entry.result?.priceWithProfit}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#e9f5e1",
  },
  contentSection: {
    // padding: 18,
    marginTop: 18,
    paddingBottom: 40,
    flexGrow: 1,
  },
  calcCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#b7c9a8",
  },
  calcDate: {
    color: "#7a7a52",
    fontSize: 13,
    marginBottom: 4,
  },
  calcTitle: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#3e6b2f",
    marginBottom: 6,
  },
  calcField: {
    color: "#444",
    fontSize: 14,
    marginBottom: 2,
  },
  calcResult: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#888",
    fontSize: 18,
    fontWeight: "bold",
  },
});
