import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const PROGRESS_WIDTH = width - 64; // 32px padding on each side

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
  segmentedContainer: {
    marginBottom: 24,
    width: "100%",
  },
  segmentedButtons: {
    width: "100%",
  },
  segmentedButtonLabel: {
    fontSize: 12,
  },
  startButton: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 24,
  },
  actionButton: {
    flex: 1,
  },
  correctButton: {
    backgroundColor: "#4caf50",
  },
  incorrectButton: {
    backgroundColor: "#f44336",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#f44336",
    textAlign: "center",
    margin: 16,
  },
  // PracticeComplete styles
  completeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3F51B5",
    marginBottom: 32,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 16,
  },
  completeProgressBar: {
    width: PROGRESS_WIDTH,
    height: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  message: {
    fontSize: 20,
    fontWeight: "500",
  },
  goodScore: {
    color: "#4CAF50",
  },
  needsPractice: {
    color: "#FF9800",
  },
  completeButton: {
    width: PROGRESS_WIDTH,
    borderRadius: 8,
    backgroundColor: "#3F51B5",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
});
