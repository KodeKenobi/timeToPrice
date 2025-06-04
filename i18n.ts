import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // General
      "App Settings": "App Settings",
      "Enable Notifications": "Enable Notifications",
      Theme: "Theme",
      "System Default": "System Default",
      Language: "Language",
      Account: "Account",
      "Manage Account (Coming Soon)": "Manage Account (Coming Soon)",
      Settings: "Settings",
      Help: "Help",
      Home: "Home",
      Calculate: "Calculate",
      "Cost Analysis": "Cost Analysis",
      "Previous Calculations": "Previous Calculations",
      "Market Prices": "Market Prices",
      Alerts: "Alerts",
      Close: "Close",
      "Add Alert": "Add Alert",
      "Saved Alerts": "Saved Alerts",
      "No alerts set.": "No alerts set.",
      "Dashboard Shortcuts": "Dashboard Shortcuts",
      "New Calculation": "New Calculation",
      "Create cost calculation": "Create cost calculation",
      "Calculate Now": "Calculate Now",
      "View history": "View history",
      History: "History",
      "Check current rates": "Check current rates",
      "Live Prices": "Live Prices",
      "View insights": "View insights",
      Analytics: "Analytics",
      "How can we help you?": "How can we help you?",
      "Welcome to the Help page! Here are some tips to get you started:":
        "Welcome to the Help page! Here are some tips to get you started:",
      "Use the Dashboard to quickly access calculations, market prices, and alerts.":
        "Use the Dashboard to quickly access calculations, market prices, and alerts.",
      "Set up price alerts to get notified when your target price is reached.":
        "Set up price alerts to get notified when your target price is reached.",
      "View your previous calculations and cost analysis for insights.":
        "View your previous calculations and cost analysis for insights.",
      "Tap the settings tab to customize your experience.":
        "Tap the settings tab to customize your experience.",
      "If you need further assistance, please contact support or check our website for more resources.":
        "If you need further assistance, please contact support or check our website for more resources.",
      "Frequently Asked Questions": "Frequently Asked Questions",
      "No Title": "No Title",
      "Clear All": "Clear All",
      // HomeHeader
      "Hello,": "Hello,",
      "Welcome to our app": "Welcome to our app",
      Commodities: "Commodities",
      "You're on track for a great season!":
        "You're on track for a great season!",
      // FAQ
      "How do I create a new calculation?":
        "How do I create a new calculation?",
      "Go to the Dashboard and tap 'New Calculation'. Fill in your details and tap Calculate to see your results.":
        "Go to the Dashboard and tap 'New Calculation'. Fill in your details and tap Calculate to see your results.",
      "How do I set a price alert?": "How do I set a price alert?",
      "Open the Alerts modal from the Dashboard, select your commodity, price type, and target value, then tap 'Add Alert'.":
        "Open the Alerts modal from the Dashboard, select your commodity, price type, and target value, then tap 'Add Alert'.",
      "Where can I see my previous calculations?":
        "Where can I see my previous calculations?",
      "Tap 'Previous Calculations' on the Dashboard to view your calculation history.":
        "Tap 'Previous Calculations' on the Dashboard to view your calculation history.",
      "How do I contact support?": "How do I contact support?",
      "If you need further assistance, please contact support via the app or visit our website for more resources.":
        "If you need further assistance, please contact support via the app or visit our website for more resources.",
      Alert: "Alert",
      "Your alert for {{commodity}} at {{lastPrice}} has been triggered!":
        "Your alert for {{commodity}} at {{lastPrice}} has been triggered!",
      "Unable to load market data. Please check your connection or try again later.":
        "Unable to load market data. Please check your connection or try again later.",
      Retry: "Retry",
      "Loading commodities...": "Loading commodities...",
      "Request timed out. Please try again.":
        "Request timed out. Please try again.",
      manage_price_alerts: "Manage Price Alerts",
      dashboard_tip:
        "Tip: Check the Market Prices card on your dashboard for the latest rates.",
      // CalculationForm
      "Hectares Planted": "Hectares Planted",
      "Enter hectares planted": "Enter hectares planted",
      "Total Seed Cost": "Total Seed Cost",
      "Enter total seed cost": "Enter total seed cost",
      "Total Fertiliser Cost": "Total Fertiliser Cost",
      "Enter total fertiliser cost": "Enter total fertiliser cost",
      "Estimated Total Chemicals Cost": "Estimated Total Chemicals Cost",
      "Enter estimated total chemicals cost":
        "Enter estimated total chemicals cost",
      "Total Employee Cost": "Total Employee Cost",
      "Enter total employee cost": "Enter total employee cost",
      "Total Eskom Cost": "Total Eskom Cost",
      "Enter total eskom cost": "Enter total eskom cost",
      "Total Fuel Cost": "Total Fuel Cost",
      "Enter total fuel cost": "Enter total fuel cost",
      "Total Transport Cost": "Total Transport Cost",
      "Enter total transport cost": "Enter total transport cost",
      "Other Expenses": "Other Expenses",
      "Enter other expenses": "Enter other expenses",
      "Total Profit Wanted": "Total Profit Wanted",
      "Enter total profit wanted": "Enter total profit wanted",
      "Average long term yield per Hectare":
        "Average long term yield per Hectare",
      "Enter average long term yield per hectare":
        "Enter average long term yield per hectare",
      "Do you have insurance?": "Do you have insurance?",
      "Insurance Amount": "Insurance Amount",
      "Enter insurance amount": "Enter insurance amount",
      "Type of Commodity": "Type of Commodity",
      "Select Commodity": "Select Commodity",
      Cancel: "Cancel",
      "Calculation Result": "Calculation Result",
      "Calculating...": "Calculating...",
      Yes: "Yes",
      No: "No",
      Commodity: "Commodity",
      "Break-even Price per ton: R": "Break-even Price per ton: R",
      "Price per ton (including profit): R":
        "Price per ton (including profit): R",
    },
  },
  af: {
    translation: {
      // General
      "App Settings": "Toepassing Instellings",
      "Enable Notifications": "Aktiveer Kennisgewings",
      Theme: "Tema",
      "System Default": "Stelsel Verstek",
      Language: "Taal",
      Account: "Rekening",
      "Manage Account (Coming Soon)": "Bestuur Rekening (Binnekort Beskikbaar)",
      Settings: "Instellings",
      Help: "Hulp",
      Home: "Tuis",
      Calculate: "Bereken",
      "Cost Analysis": "Koste-analise",
      "Previous Calculations": "Vorige Berekeninge",
      "Market Prices": "Markpryse",
      Alerts: "Waarskuwings",
      Close: "Maak toe",
      "Add Alert": "Voeg Waarskuwing By",
      "Saved Alerts": "Gestoor Waarskuwings",
      "No alerts set.": "Geen waarskuwings gestel nie.",
      "Dashboard Shortcuts": "Dashboard Kortpaaie",
      "New Calculation": "Nuwe Berekening",
      "Create cost calculation": "Skep koste-berekening",
      "Calculate Now": "Bereken Nou",
      "View history": "Sien Geskiedenis",
      History: "Geskiedenis",
      "Check current rates": "Kyk huidige tariewe",
      "Live Prices": "Lewende Pryse",
      "View insights": "Sien insigte",
      Analytics: "Analise",
      "How can we help you?": "Hoe kan ons jou help?",
      "Welcome to the Help page! Here are some tips to get you started:":
        "Welkom by die Hulp-bladsy! Hier is ’n paar wenke om jou te help begin:",
      "Use the Dashboard to quickly access calculations, market prices, and alerts.":
        "Gebruik die Dashboard om vinnig toegang tot berekeninge, markpryse en waarskuwings te kry.",
      "Set up price alerts to get notified when your target price is reached.":
        "Stel pryswaarskuwings in om kennisgewings te ontvang wanneer jou teikenprys bereik word.",
      "View your previous calculations and cost analysis for insights.":
        "Sien jou vorige berekeninge en koste-analise vir insigte.",
      "Tap the settings tab to customize your experience.":
        "Tik op die instellings-oortjie om jou ervaring aan te pas.",
      "If you need further assistance, please contact support or check our website for more resources.":
        "As jy verdere hulp benodig, kontak asseblief ondersteuning of besoek ons webwerf vir meer hulpbronne.",
      "Frequently Asked Questions": "Gereelde Vrae",
      "No Title": "Geen Titel",
      "Clear All": "Maak alles skoon",
      // HomeHeader
      "Hello,": "Hallo,",
      "Welcome to our app": "Welkom by ons toepassing",
      Commodities: "Kommoditeite",
      "You're on track for a great season!":
        "Jy is op koers vir 'n wonderlike seisoen!",
      // FAQ
      "How do I create a new calculation?": "Hoe maak ek ’n nuwe berekening?",
      "Go to the Dashboard and tap 'New Calculation'. Fill in your details and tap Calculate to see your results.":
        "Gaan na die Dashboard en tik op 'Nuwe Berekening'. Vul jou besonderhede in en tik op Bereken om jou resultate te sien.",
      "How do I set a price alert?": "Hoe stel ek ’n pryswaarskuwing?",
      "Open the Alerts modal from the Dashboard, select your commodity, price type, and target value, then tap 'Add Alert'.":
        "Maak die Waarskuwings-modal oop vanaf die Dashboard, kies jou kommoditeit, prys-tipe en teikenwaarde, en tik dan op 'Voeg Waarskuwing By'.",
      "Where can I see my previous calculations?":
        "Waar kan ek my vorige berekeninge sien?",
      "Tap 'Previous Calculations' on the Dashboard to view your calculation history.":
        "Tik op 'Vorige Berekeninge' op die Dashboard om jou berekeningsgeskiedenis te sien.",
      "How do I contact support?": "Hoe kontak ek ondersteuning?",
      "If you need further assistance, please contact support via the app or visit our website for more resources.":
        "As jy verdere hulp benodig, kontak asseblief ondersteuning via die toepassing of besoek ons webwerf vir meer hulpbronne.",
      Alert: "Waarskuwing",
      "Your alert for {{commodity}} at {{lastPrice}} has been triggered!":
        "Jou waarskuwing vir {{commodity}} teen {{lastPrice}} is geaktiveer!",
      "Unable to load market data. Please check your connection or try again later.":
        "Kon nie markdata laai nie. Kontroleer jou verbinding of probeer weer later.",
      Retry: "Probeer weer",
      "Loading commodities...": "Laai kommoditeite...",
      "Request timed out. Please try again.":
        "Versoek het te lank geneem. Probeer asseblief weer.",
      manage_price_alerts: "Bestuur Pryswaarskuwings",
      dashboard_tip:
        "Wenk: Kyk die Markpryse-kaart op jou dashboard vir die nuutste tariewe.",
      // CalculationForm
      "Hectares Planted": "Hektaar geplant",
      "Enter hectares planted": "Voer hektaar geplant in",
      "Total Seed Cost": "Totale saadkoste",
      "Enter total seed cost": "Voer totale saadkoste in",
      "Total Fertiliser Cost": "Totale kunsmiskoste",
      "Enter total fertiliser cost": "Voer totale kunsmiskoste in",
      "Estimated Total Chemicals Cost": "Geskatte totale chemiese koste",
      "Enter estimated total chemicals cost":
        "Voer geskatte totale chemiese koste in",
      "Total Employee Cost": "Totale werknemerskoste",
      "Enter total employee cost": "Voer totale werknemerskoste in",
      "Total Eskom Cost": "Totale Eskom-koste",
      "Enter total eskom cost": "Voer totale Eskom-koste in",
      "Total Fuel Cost": "Totale brandstofkoste",
      "Enter total fuel cost": "Voer totale brandstofkoste in",
      "Total Transport Cost": "Totale vervoerkoste",
      "Enter total transport cost": "Voer totale vervoerkoste in",
      "Other Expenses": "Ander uitgawes",
      "Enter other expenses": "Voer ander uitgawes in",
      "Total Profit Wanted": "Totale wins verlang",
      "Enter total profit wanted": "Voer totale wins verlang in",
      "Average long term yield per Hectare":
        "Gemiddelde langtermyn opbrengs per hektaar",
      "Enter average long term yield per hectare":
        "Voer gemiddelde langtermyn opbrengs per hektaar in",
      "Do you have insurance?": "Het jy versekering?",
      "Insurance Amount": "Versekering bedrag",
      "Enter insurance amount": "Voer versekering bedrag in",
      "Type of Commodity": "Tipe kommoditeit",
      "Select Commodity": "Kies kommoditeit",
      Cancel: "Kanselleer",
      "Calculation Result": "Berekeningsresultaat",
      "Calculating...": "Besig om te bereken...",
      Yes: "Ja",
      No: "Nee",
      Commodity: "Kommoditeit",
      "Break-even Price per ton: R": "Gelykbreekprys per ton: R",
      "Price per ton (including profit): R":
        "Prys per ton (insluitend wins): R",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
