import { HomeHeader } from "@/components/HomeHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PREVIOUS_CALCS_KEY = "@previous_calculations";

export default function CostAnalysisModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [calculations, setCalculations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    avgBreakEven: number;
    avgProfit: number;
  } | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!visible) return;
    const fetchCalcs = async () => {
      setLoading(true);
      try {
        const data = await AsyncStorage.getItem(PREVIOUS_CALCS_KEY);
        const calcs = data ? JSON.parse(data) : [];
        setCalculations(calcs);
        // Calculate summary
        if (calcs.length > 0) {
          let breakEvenSum = 0;
          let profitSum = 0;
          let count = 0;
          calcs.forEach((entry: any) => {
            const be = parseFloat(entry.result?.breakEven);
            const pw = parseFloat(entry.result?.priceWithProfit);
            if (!isNaN(be)) breakEvenSum += be;
            if (!isNaN(pw)) profitSum += pw;
            if (!isNaN(be) && !isNaN(pw)) count++;
          });
          setSummary({
            avgBreakEven: breakEvenSum / (count || 1),
            avgProfit: profitSum / (count || 1),
          });
        } else {
          setSummary(null);
        }
      } catch (e) {
        setCalculations([]);
        setSummary(null);
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
          title={t("Cost Analysis")}
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
                {t("No previous calculations found.")}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>{t("Summary")}</Text>
                <Text style={styles.summaryText}>
                  {t("Average Break-even Price per ton:")}
                  <Text style={styles.summaryValue}>
                    R{summary?.avgBreakEven.toFixed(2) ?? "-"}
                  </Text>
                </Text>
                <Text style={styles.summaryText}>
                  {t("Average Price per ton (with profit):")}
                  <Text style={styles.summaryValue}>
                    R{summary?.avgProfit.toFixed(2) ?? "-"}
                  </Text>
                </Text>
              </View>
              {calculations.map((entry, idx) => (
                <View key={idx} style={styles.calcCard}>
                  <Text style={styles.calcDate}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </Text>
                  <Text style={styles.calcTitle}>{entry.fields.commodity}</Text>
                  <View
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      marginTop: 8,
                    }}
                  >
                    {[
                      {
                        label: t("Hectares Planted"),
                        value: entry.fields.hectares,
                      },
                      {
                        label: t("Total Seed Cost"),
                        value: entry.fields.seedCost,
                      },
                      {
                        label: t("Total Fertiliser Cost"),
                        value: entry.fields.fertiliserCost,
                      },
                      {
                        label: t("Estimated Total Chemicals Cost"),
                        value: entry.fields.chemicalsCost,
                      },
                      {
                        label: t("Total Employee Cost"),
                        value: entry.fields.employeeCost,
                      },
                      {
                        label: t("Total Eskom Cost"),
                        value: entry.fields.eskomCost,
                      },
                      {
                        label: t("Total Fuel Cost"),
                        value: entry.fields.fuelCost,
                      },
                      {
                        label: t("Total Transport Cost"),
                        value: entry.fields.transportCost,
                      },
                      {
                        label: t("Other Expenses"),
                        value: entry.fields.otherExpenses,
                      },
                      {
                        label: t("Total Profit Wanted"),
                        value: entry.fields.profitWanted,
                      },
                      {
                        label: t("Average long term yield per Hectare"),
                        value: entry.fields.averageYield,
                      },
                      {
                        label: t("Do you have insurance?"),
                        value: entry.fields.hasInsurance ? t("Yes") : t("No"),
                      },
                      ...(entry.fields.hasInsurance
                        ? [
                            {
                              label: t("Insurance Amount"),
                              value: entry.fields.insurance,
                            },
                          ]
                        : []),
                      { label: t("Commodity"), value: entry.fields.commodity },
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
                  <View style={styles.resultCard}>
                    <Text style={styles.resultText}>
                      {t("Break-even Price per ton:")}
                      <Text style={styles.resultValue}>
                        R{entry.result?.breakEven}
                      </Text>
                    </Text>
                    <Text style={styles.resultText}>
                      {t("Price per ton (including profit):")}
                      <Text style={styles.resultValue}>
                        R{entry.result?.priceWithProfit}
                      </Text>
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>{t("Close")}</Text>
        </TouchableOpacity>
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
    marginTop: 18,
    paddingBottom: 40,
    paddingHorizontal: 12,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
  summaryCard: {
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
  summaryTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#3e6b2f",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: "#222",
    marginBottom: 2,
  },
  summaryValue: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  calcCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#b7c9a8",
    marginBottom: 18,
  },
  calcDate: {
    color: "#7a7a52",
    fontSize: 13,
    marginBottom: 2,
  },
  calcTitle: {
    fontWeight: "bold",
    color: "#3e6b2f",
    fontSize: 16,
    marginBottom: 2,
  },
  resultCard: {
    backgroundColor: "#e9f5e1",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginTop: 16,
    shadowColor: "#2e7d32",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultValue: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#3e6b2f",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    margin: 24,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
