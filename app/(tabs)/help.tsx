import React from "react";
import { Text, View } from "react-native";

console.log("[HelpScreen] File loaded");
export default function HelpScreen(props: any) {
  console.log("[HelpScreen] Render", { props });
  return (
    <View>
      <Text>Help Page</Text>
    </View>
  );
}
