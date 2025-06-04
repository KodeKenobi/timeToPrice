import { HomeHeader } from "@/components/HomeHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

const commodities = [
  "YELLOW MAIZE FUTURE SPOT",
  "WHITE MAIZE FUTURE SPOT",
  "SOYBEAN FUTURE SPOT",
];

console.log("[CalculationForm] File loaded");
export default function CalculationForm(props: any) {
  console.log("[CalculationForm] Render", { props });
  const [fields, setFields] = useState({
    hectares: "",
    seedCost: "",
    fertiliserCost: "",
    chemicalsCost: "",
    employeeCost: "",
    eskomCost: "",
    fuelCost: "",
    transportCost: "",
    otherExpenses: "",
    profitWanted: "",
    averageYield: "",
    insurance: "",
    commodity: commodities[0],
    hasInsurance: false,
  });
  const [commodityModalVisible, setCommodityModalVisible] = useState(false);
  const [result, setResult] = useState<{
    breakEven: string;
    priceWithProfit: string;
  } | null>(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const PREVIOUS_CALCS_KEY = "@previous_calculations";
  const { t } = useTranslation();

  useEffect(() => {
    console.log("[CalculationForm] State snapshot", {
      fields,
      commodityModalVisible,
      result,
      resultModalVisible,
      loading,
    });
  });

  const handleChange = (key: keyof typeof fields, value: string | boolean) => {
    console.log("[CalculationForm] handleChange", { key, value });
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = async () => {
    console.log("[CalculationForm] handleCalculate", { fields });
    setLoading(true);
    // Parse all fields as numbers, defaulting to 0 if empty
    const hectares = parseFloat(fields.hectares) || 0;
    const seedCost = parseFloat(fields.seedCost) || 0;
    const fertiliserCost = parseFloat(fields.fertiliserCost) || 0;
    const chemicalsCost = parseFloat(fields.chemicalsCost) || 0;
    const employeeCost = parseFloat(fields.employeeCost) || 0;
    const eskomCost = parseFloat(fields.eskomCost) || 0;
    const fuelCost = parseFloat(fields.fuelCost) || 0;
    const transportCost = parseFloat(fields.transportCost) || 0;
    const otherExpenses = parseFloat(fields.otherExpenses) || 0;
    const profitWanted = parseFloat(fields.profitWanted) || 0;
    const averageYield = parseFloat(fields.averageYield) || 0;
    const insurance = fields.hasInsurance
      ? parseFloat(fields.insurance) || 0
      : 0;

    // Calculate total cost
    const totalCost =
      seedCost +
      fertiliserCost +
      chemicalsCost +
      employeeCost +
      eskomCost +
      fuelCost +
      transportCost +
      otherExpenses +
      insurance;

    // Avoid division by zero
    let calcResult;
    if (hectares === 0 || averageYield === 0) {
      calcResult = {
        breakEven: "Invalid input",
        priceWithProfit: "Invalid input",
      };
    } else {
      // Calculate break-even and price with profit
      const breakEven = totalCost / hectares / averageYield;
      const priceWithProfit =
        (totalCost + profitWanted) / hectares / averageYield;
      calcResult = {
        breakEven: breakEven.toFixed(2),
        priceWithProfit: priceWithProfit.toFixed(2),
      };
    }

    setResult(null);
    setResultModalVisible(true);
    // Save last calculation time
    try {
      await AsyncStorage.setItem("@last_calc_time", Date.now().toString());
      // Save all fields and result to previous calculations
      const prev = await AsyncStorage.getItem(PREVIOUS_CALCS_KEY);
      const prevArr = prev ? JSON.parse(prev) : [];
      prevArr.unshift({
        fields,
        result: calcResult,
        timestamp: Date.now(),
      });
      await AsyncStorage.setItem(PREVIOUS_CALCS_KEY, JSON.stringify(prevArr));
    } catch (e) {
      console.warn("Failed to save last calc time or previous calculation", e);
    }
    // Simulate loading for 1 second
    setTimeout(() => {
      setResult(calcResult);
      setLoading(false);
      console.log("[CalculationForm] Calculation result", calcResult);
    }, 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.form}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Hectares Planted")}</Text>
        <TextInput
          style={styles.input}
          value={fields.hectares}
          onChangeText={(v) => handleChange("hectares", v)}
          keyboardType="numeric"
          placeholder={t("Enter hectares planted")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Total Seed Cost")}</Text>
        <TextInput
          style={styles.input}
          value={fields.seedCost}
          onChangeText={(v) => handleChange("seedCost", v)}
          keyboardType="numeric"
          placeholder={t("Enter total seed cost")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Total Fertiliser Cost")}</Text>
        <TextInput
          style={styles.input}
          value={fields.fertiliserCost}
          onChangeText={(v) => handleChange("fertiliserCost", v)}
          keyboardType="numeric"
          placeholder={t("Enter total fertiliser cost")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Estimated Total Chemicals Cost")}</Text>
        <TextInput
          style={styles.input}
          value={fields.chemicalsCost}
          onChangeText={(v) => handleChange("chemicalsCost", v)}
          keyboardType="numeric"
          placeholder={t("Enter estimated total chemicals cost")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Total Employee Cost")}</Text>
        <TextInput
          style={styles.input}
          value={fields.employeeCost}
          onChangeText={(v) => handleChange("employeeCost", v)}
          keyboardType="numeric"
          placeholder={t("Enter total employee cost")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Total Eskom Cost")}</Text>
        <TextInput
          style={styles.input}
          value={fields.eskomCost}
          onChangeText={(v) => handleChange("eskomCost", v)}
          keyboardType="numeric"
          placeholder={t("Enter total eskom cost")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Total Fuel Cost")}</Text>
        <TextInput
          style={styles.input}
          value={fields.fuelCost}
          onChangeText={(v) => handleChange("fuelCost", v)}
          keyboardType="numeric"
          placeholder={t("Enter total fuel cost")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Total Transport Cost")}</Text>
        <TextInput
          style={styles.input}
          value={fields.transportCost}
          onChangeText={(v) => handleChange("transportCost", v)}
          keyboardType="numeric"
          placeholder={t("Enter total transport cost")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Other Expenses")}</Text>
        <TextInput
          style={styles.input}
          value={fields.otherExpenses}
          onChangeText={(v) => handleChange("otherExpenses", v)}
          keyboardType="numeric"
          placeholder={t("Enter other expenses")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Total Profit Wanted")}</Text>
        <TextInput
          style={styles.input}
          value={fields.profitWanted}
          onChangeText={(v) => handleChange("profitWanted", v)}
          keyboardType="numeric"
          placeholder={t("Enter total profit wanted")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          {t("Average long term yield per Hectare")}
        </Text>
        <TextInput
          style={styles.input}
          value={fields.averageYield}
          onChangeText={(v) => handleChange("averageYield", v)}
          keyboardType="numeric"
          placeholder={t("Enter average long term yield per hectare")}
          placeholderTextColor="#888"
        />
      </View>
      <View style={[styles.fieldGroup, styles.row]}>
        <Text style={styles.label}>{t("Do you have insurance?")}</Text>
        <Switch
          value={fields.hasInsurance}
          onValueChange={(v) => handleChange("hasInsurance", v)}
        />
      </View>
      {fields.hasInsurance && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t("Insurance Amount")}</Text>
          <TextInput
            style={styles.input}
            value={fields.insurance}
            onChangeText={(v) => handleChange("insurance", v)}
            keyboardType="numeric"
            placeholder={t("Enter insurance amount")}
            placeholderTextColor="#888"
          />
        </View>
      )}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t("Type of Commodity")}</Text>
        <TouchableOpacity
          style={styles.commoditySelector}
          onPress={() => setCommodityModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.commoditySelectorContent}>
            <Text style={styles.commoditySelectorText}>{fields.commodity}</Text>
            <IconSymbol name="chevron.right" size={22} color="#3e6b2f" />
          </View>
        </TouchableOpacity>
        <Modal
          visible={commodityModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCommodityModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("Select Commodity")}</Text>
              <FlatList
                data={commodities}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange("commodity", item);
                      setCommodityModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setCommodityModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>{t("Cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.saveButtonContainer}>
        <Pressable style={styles.saveButton} onPress={handleCalculate}>
          <Text style={styles.saveButtonText}>{t("Calculate")}</Text>
        </Pressable>
      </View>
      {/* Result Modal */}
      <Modal
        visible={resultModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setResultModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#e9f5e1" }}>
          <HomeHeader
            title={t("Calculation Result")}
            onBackPress={() => setResultModalVisible(false)}
            paddingOverride={{ paddingTop: 54, paddingBottom: 32 }}
          />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 18,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 2,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#b7c9a8",
                marginBottom: 24,
              }}
            >
              {loading ? (
                <View style={{ alignItems: "center", marginVertical: 24 }}>
                  <ActivityIndicator size="large" color="#3e6b2f" />
                  <Text style={{ marginTop: 16, fontSize: 16 }}>
                    {t("Calculating...")}
                  </Text>
                </View>
              ) : (
                result && (
                  <>
                    {[
                      { label: t("Hectares Planted"), value: fields.hectares },
                      { label: t("Total Seed Cost"), value: fields.seedCost },
                      {
                        label: t("Total Fertiliser Cost"),
                        value: fields.fertiliserCost,
                      },
                      {
                        label: t("Estimated Total Chemicals Cost"),
                        value: fields.chemicalsCost,
                      },
                      {
                        label: t("Total Employee Cost"),
                        value: fields.employeeCost,
                      },
                      { label: t("Total Eskom Cost"), value: fields.eskomCost },
                      { label: t("Total Fuel Cost"), value: fields.fuelCost },
                      {
                        label: t("Total Transport Cost"),
                        value: fields.transportCost,
                      },
                      {
                        label: t("Other Expenses"),
                        value: fields.otherExpenses,
                      },
                      {
                        label: t("Total Profit Wanted"),
                        value: fields.profitWanted,
                      },
                      {
                        label: t("Average long term yield per Hectare"),
                        value: fields.averageYield,
                      },
                      {
                        label: t("Do you have insurance?"),
                        value: fields.hasInsurance ? t("Yes") : t("No"),
                      },
                      ...(fields.hasInsurance
                        ? [
                            {
                              label: t("Insurance Amount"),
                              value: fields.insurance,
                            },
                          ]
                        : []),
                      { label: t("Commodity"), value: fields.commodity },
                    ].map((row, idx) => (
                      <View
                        key={row.label}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor:
                            idx % 2 === 0 ? "#f7faf3" : "#f0f4ea",
                          paddingVertical: 10,
                          paddingHorizontal: 8,
                          borderTopLeftRadius: idx === 0 ? 12 : 0,
                          borderTopRightRadius: idx === 0 ? 12 : 0,
                          borderBottomLeftRadius: idx === 12 ? 12 : 0,
                          borderBottomRightRadius: idx === 12 ? 12 : 0,
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
                    <View style={{ height: 12 }} />
                    <View
                      style={{
                        backgroundColor: "#e9f5e1",
                        borderRadius: 10,
                        paddingVertical: 12,
                        paddingHorizontal: 8,
                        marginTop: 4,
                        marginBottom: 2,
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
                        {t("Break-even Price per ton: R")}
                        {result.breakEven}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#2e7d32",
                          fontWeight: "bold",
                        }}
                      >
                        {t("Price per ton (including profit): R")}
                        {result.priceWithProfit}
                      </Text>
                    </View>
                  </>
                )
              )}
              <TouchableOpacity
                style={[styles.modalCancel, loading && { opacity: 0.5 }]}
                onPress={() => !loading && setResultModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.modalCancelText}>{t("Close")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: { padding: 0, alignItems: "stretch" },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3e6b2f",
    marginBottom: 18,
    marginTop: 8,
    alignSelf: "center",
  },
  fieldGroup: { width: "100%", marginBottom: 14, paddingHorizontal: 16 },
  label: { fontWeight: "bold", color: "#4e5d3a", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#b7c9a8",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#b7c9a8",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%",
  },
  picker: { width: "100%" },
  pickerItem: { fontSize: 16 },
  commoditySelector: {
    borderWidth: 1,
    borderColor: "#b7c9a8",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%",
    padding: 12,
    justifyContent: "center",
  },
  commoditySelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commoditySelectorText: {
    fontSize: 16,
    color: "#3e6b2f",
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#3e6b2f",
    alignSelf: "center",
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalCancel: {
    marginTop: 16,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#b00",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonContainer: {
    marginTop: 25,
    marginBottom: 60,
    width: "100%",
    paddingHorizontal: 16,
  },
  saveButton: {
    backgroundColor: "#3e6b2f",
    padding: 16,
    borderRadius: 80,
    width: "100%",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
