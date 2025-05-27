import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "#228be6",
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  tabBar: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
