import { HomeHeader } from "@/components/HomeHeader";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Afrikaans", value: "af" },
];

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");
  const router = useRouter();

  return (
    <View style={styles.root}>
      <HomeHeader title="Settings" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.contentSection}>
        <Text style={styles.title}>App Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? "#3e6b2f" : "#ccc"}
            trackColor={{ true: "#b7c9a8", false: "#ccc" }}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Theme</Text>
          <Text style={styles.settingValue}>System Default</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Language</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                style={[
                  styles.langBtn,
                  language === lang.value && styles.langBtnActive,
                ]}
                onPress={() => setLanguage(lang.value)}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === lang.value && styles.langBtnTextActive,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.accountBtn}>
          <Text style={styles.accountBtnText}>
            Manage Account (Coming Soon)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#e9f5e1",
  },
  contentSection: {
    padding: 24,
    paddingTop: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3e6b2f",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#b7c9a8",
  },
  settingLabel: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 16,
    color: "#3e6b2f",
    fontWeight: "bold",
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#e9f5e1",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#b7c9a8",
  },
  langBtnActive: {
    backgroundColor: "#3e6b2f",
    borderColor: "#3e6b2f",
  },
  langBtnText: {
    color: "#3e6b2f",
    fontWeight: "bold",
    fontSize: 15,
  },
  langBtnTextActive: {
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#b7c9a8",
    marginVertical: 24,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3e6b2f",
    marginBottom: 12,
  },
  accountBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#b7c9a8",
  },
  accountBtnText: {
    color: "#7a7a52",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// TODO: Implement global i18n support for language switching. Currently, only the UI for language selection is implemented.
// When a language is selected, all app text should update accordingly.
// Consider using a context/provider and a translation file for each language.
// See: https://react.i18next.com/ or similar libraries for inspiration.
// ---
