import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#228be6",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  userName: {
    fontSize: 16,
    color: "white",
    marginLeft: "auto",
  },
  logoutButton: {
    padding: 8,
  },
  menuContainer: {
    flex: 1,
    width: "75%",
    backgroundColor: "#e7f5ff",
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    backgroundColor: "#e7f5ff",
  },
  menuTitle: {
    color: "#212529",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  menuItemText: {
    color: "#212529",
    fontSize: 16,
  },
});
