import React from "react";
import { View } from "react-native";
import { Text, Button, ProgressBar } from "react-native-paper";
import { styles } from "./style";

function PracticeComplete({ score, words, onPracticeAgain }) {
  const progressValue = score / words.length;
  const isGoodScore = progressValue >= 0.7;

  return (
    <View style={styles.completeContainer}>
      <Text style={styles.completeTitle}>Practice Complete!</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
          Your Score: {score}/{words.length}
        </Text>

        <ProgressBar
          progress={progressValue}
          style={styles.completeProgressBar}
          color={isGoodScore ? "#4CAF50" : "#FF9800"}
        />

        <Text
          style={[
            styles.message,
            isGoodScore ? styles.goodScore : styles.needsPractice,
          ]}
        >
          {isGoodScore ? "Great job! 🎉" : "Keep practicing! 💪"}
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={onPracticeAgain}
        style={styles.completeButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Practice Again
      </Button>
    </View>
  );
}

export default PracticeComplete;
