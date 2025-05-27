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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  filterButton: {
    marginRight: 8,
  },
  filtersContent: {
    borderRadius: 8,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 12,
    minWidth: 80,
  },
  pickerContainer: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    height: 40,
  },
  eyeButton: {
    marginLeft: 8,
  },
  createButton: {
    width: "100%",
    marginBottom: 16,
  },
  newWordContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#2196f3",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  wordsContainer: {
    gap: 16,
  },
  wordItem: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: "#f44336",
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
    marginTop: 24,
    gap: 16,
  },
  paginationButton: {
    minWidth: 100,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  shareButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#f44336",
  },
});
