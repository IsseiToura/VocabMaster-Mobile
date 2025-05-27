import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  surface: {
    padding: 16,
    margin: 16,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    marginBottom: 8,
  },
  historyHeader: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  historyHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  highScoreBadge: {
    backgroundColor: "#4caf50",
  },
  lowScoreBadge: {
    backgroundColor: "#ff9800",
  },
  scoreText: {
    color: "white",
    fontWeight: "500",
  },
  historyDetails: {
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
  },
  noHistoryText: {
    textAlign: "center",
    color: "#666",
    marginTop: 16,
  },
  errorText: {
    color: "#f44336",
    textAlign: "center",
    margin: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  paginationButton: {
    minWidth: 100,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
