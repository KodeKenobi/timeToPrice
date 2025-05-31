import { HomeHeader } from "@/components/HomeHeader";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

console.log("[HelpScreen] File loaded");

const FAQS = [
  {
    q: "How do I create a new calculation?",
    a: "Go to the Dashboard and tap 'New Calculation'. Fill in your details and tap Calculate to see your results.",
  },
  {
    q: "How do I set a price alert?",
    a: "Open the Alerts modal from the Dashboard, select your commodity, price type, and target value, then tap 'Add Alert'.",
  },
  {
    q: "Where can I see my previous calculations?",
    a: "Tap 'Previous Calculations' on the Dashboard to view your calculation history.",
  },
  {
    q: "How do I contact support?",
    a: "If you need further assistance, please contact support via the app or visit our website for more resources.",
  },
];

export default function HelpScreen(props: any) {
  const router = useRouter();
  console.log("[HelpScreen] Render", { props });
  return (
    <View style={styles.root}>
      <HomeHeader title="Help" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.contentSection}>
        <Text style={styles.title}>How can we help you?</Text>
        <Text style={styles.paragraph}>
          Welcome to the Help page! Here are some tips to get you started:
        </Text>
        <Text style={styles.bullet}>
          • Use the Dashboard to quickly access calculations, market prices, and
          alerts.
        </Text>
        <Text style={styles.bullet}>
          • Set up price alerts to get notified when your target price is
          reached.
        </Text>
        <Text style={styles.bullet}>
          • View your previous calculations and cost analysis for insights.
        </Text>
        <Text style={styles.bullet}>
          • Tap the settings tab to customize your experience.
        </Text>
        <Text style={styles.paragraph}>
          If you need further assistance, please contact support or check our
          website for more resources.
        </Text>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
        {FAQS.map((faq, idx) => (
          <View key={idx} style={styles.faqItem}>
            <Text style={styles.faqQ}>{faq.q}</Text>
            <Text style={styles.faqA}>{faq.a}</Text>
          </View>
        ))}
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
  paragraph: {
    fontSize: 16,
    color: "#222",
    marginBottom: 16,
  },
  bullet: {
    fontSize: 16,
    color: "#222",
    marginBottom: 10,
    marginLeft: 8,
  },
  faqTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#3e6b2f",
    marginTop: 28,
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 18,
  },
  faqQ: {
    fontWeight: "bold",
    color: "#2e7d32",
    fontSize: 16,
    marginBottom: 4,
  },
  faqA: {
    color: "#222",
    fontSize: 15,
    marginLeft: 8,
  },
});
