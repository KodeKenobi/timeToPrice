import React, { useEffect, useState } from "react";
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

  const handleCalculate = () => {
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
        <Text style={styles.label}>Hectares Planted</Text>
        <TextInput
          style={styles.input}
          value={fields.hectares}
          onChangeText={(v) => handleChange("hectares", v)}
          keyboardType="numeric"
          placeholder="e.g. 100"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Total Seed Cost</Text>
        <TextInput
          style={styles.input}
          value={fields.seedCost}
          onChangeText={(v) => handleChange("seedCost", v)}
          keyboardType="numeric"
          placeholder="e.g. 5000"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Total Fertiliser Cost</Text>
        <TextInput
          style={styles.input}
          value={fields.fertiliserCost}
          onChangeText={(v) => handleChange("fertiliserCost", v)}
          keyboardType="numeric"
          placeholder="e.g. 2000"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Estimated Total Chemicals Cost</Text>
        <TextInput
          style={styles.input}
          value={fields.chemicalsCost}
          onChangeText={(v) => handleChange("chemicalsCost", v)}
          keyboardType="numeric"
          placeholder="e.g. 1200"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Total Employee Cost</Text>
        <TextInput
          style={styles.input}
          value={fields.employeeCost}
          onChangeText={(v) => handleChange("employeeCost", v)}
          keyboardType="numeric"
          placeholder="e.g. 3000"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Total Eskom Cost</Text>
        <TextInput
          style={styles.input}
          value={fields.eskomCost}
          onChangeText={(v) => handleChange("eskomCost", v)}
          keyboardType="numeric"
          placeholder="e.g. 800"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Total Fuel Cost</Text>
        <TextInput
          style={styles.input}
          value={fields.fuelCost}
          onChangeText={(v) => handleChange("fuelCost", v)}
          keyboardType="numeric"
          placeholder="e.g. 1500"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Total Transport Cost</Text>
        <TextInput
          style={styles.input}
          value={fields.transportCost}
          onChangeText={(v) => handleChange("transportCost", v)}
          keyboardType="numeric"
          placeholder="e.g. 600"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Other Expenses</Text>
        <TextInput
          style={styles.input}
          value={fields.otherExpenses}
          onChangeText={(v) => handleChange("otherExpenses", v)}
          keyboardType="numeric"
          placeholder="e.g. 400"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Total Profit Wanted</Text>
        <TextInput
          style={styles.input}
          value={fields.profitWanted}
          onChangeText={(v) => handleChange("profitWanted", v)}
          keyboardType="numeric"
          placeholder="e.g. 10000"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Average long term yield per Hectare</Text>
        <TextInput
          style={styles.input}
          value={fields.averageYield}
          onChangeText={(v) => handleChange("averageYield", v)}
          keyboardType="numeric"
          placeholder="e.g. 5"
        />
      </View>
      <View style={[styles.fieldGroup, styles.row]}>
        <Text style={styles.label}>Do you have insurance?</Text>
        <Switch
          value={fields.hasInsurance}
          onValueChange={(v) => handleChange("hasInsurance", v)}
        />
      </View>
      {fields.hasInsurance && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Insurance Amount</Text>
          <TextInput
            style={styles.input}
            value={fields.insurance}
            onChangeText={(v) => handleChange("insurance", v)}
            keyboardType="numeric"
            placeholder="e.g. 2000"
          />
        </View>
      )}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Type of Commodity</Text>
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
              <Text style={styles.modalTitle}>Select Commodity</Text>
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
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.saveButtonContainer}>
        <Pressable style={styles.saveButton} onPress={handleCalculate}>
          <Text style={styles.saveButtonText}>Calculate</Text>
        </Pressable>
      </View>
      {/* Result Modal */}
      <Modal
        visible={resultModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResultModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calculation Result</Text>
            {loading ? (
              <View style={{ alignItems: "center", marginVertical: 24 }}>
                <ActivityIndicator size="large" color="#3e6b2f" />
                <Text style={{ marginTop: 16, fontSize: 16 }}>
                  Calculating...
                </Text>
              </View>
            ) : (
              result && (
                <>
                  <ScrollView style={{ maxHeight: 350 }}>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Hectares Planted:
                      </Text>{" "}
                      {fields.hectares}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Total Seed Cost:
                      </Text>{" "}
                      {fields.seedCost}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Total Fertiliser Cost:
                      </Text>{" "}
                      {fields.fertiliserCost}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Estimated Total Chemicals Cost:
                      </Text>{" "}
                      {fields.chemicalsCost}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Total Employee Cost:
                      </Text>{" "}
                      {fields.employeeCost}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Total Eskom Cost:
                      </Text>{" "}
                      {fields.eskomCost}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Total Fuel Cost:
                      </Text>{" "}
                      {fields.fuelCost}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Total Transport Cost:
                      </Text>{" "}
                      {fields.transportCost}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Other Expenses:
                      </Text>{" "}
                      {fields.otherExpenses}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Total Profit Wanted:
                      </Text>{" "}
                      {fields.profitWanted}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Average long term yield per Hectare:
                      </Text>{" "}
                      {fields.averageYield}
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Do you have insurance?:
                      </Text>{" "}
                      {fields.hasInsurance ? "Yes" : "No"}
                    </Text>
                    {fields.hasInsurance && (
                      <Text style={{ fontSize: 16, marginBottom: 8 }}>
                        <Text style={{ fontWeight: "bold" }}>
                          Insurance Amount:
                        </Text>{" "}
                        {fields.insurance}
                      </Text>
                    )}
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        Type of Commodity:
                      </Text>{" "}
                      {fields.commodity}
                    </Text>
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderTopColor: "#b7c9a8",
                        marginVertical: 12,
                      }}
                    />
                    <Text style={{ fontSize: 16, marginBottom: 8 }}>
                      Break-even Price per ton:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        R{result.breakEven}
                      </Text>
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      Price per ton (including profit):{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        R{result.priceWithProfit}
                      </Text>
                    </Text>
                  </ScrollView>
                </>
              )
            )}
            <TouchableOpacity
              style={[styles.modalCancel, loading && { opacity: 0.5 }]}
              onPress={() => !loading && setResultModalVisible(false)}
              disabled={loading}
            >
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
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
