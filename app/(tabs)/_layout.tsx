import { Tabs } from "expo-router";
import { View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#333",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <>
              {focused && (
                <View
                  style={{
                    height: 3,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    width: 28,
                    alignSelf: "center",
                    marginBottom: 2,
                  }}
                />
              )}
              <IconSymbol size={28} name="house.fill" color="#fff" />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="calculate"
        options={{
          title: "Calculate",
          tabBarIcon: ({ focused }) => (
            <>
              {focused && (
                <View
                  style={{
                    height: 3,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    width: 28,
                    alignSelf: "center",
                    marginBottom: 2,
                  }}
                />
              )}
              <IconSymbol size={28} name="calculator" color="#fff" />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          tabBarIcon: ({ focused }) => (
            <>
              {focused && (
                <View
                  style={{
                    height: 3,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    width: 28,
                    alignSelf: "center",
                    marginBottom: 2,
                  }}
                />
              )}
              <IconSymbol size={28} name="questionmark.circle" color="#fff" />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <>
              {focused && (
                <View
                  style={{
                    height: 3,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    width: 28,
                    alignSelf: "center",
                    marginBottom: 2,
                  }}
                />
              )}
              <IconSymbol size={28} name="gear" color="#fff" />
            </>
          ),
        }}
      />
    </Tabs>
  );
}
