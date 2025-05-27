import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Text, TextInput } from "react-native-paper";

function WordCard({ word, showEnglish, isEditable, onWordChange }) {
  // Get the actual word data from wordId and add null check
  const wordData = word?.wordId || word || {};

  // Helper function to safely get word data with default values
  const getWordData = (field, defaultValue = "") => {
    return wordData[field] || defaultValue;
  };

  if (isEditable) {
    return (
      <Surface style={styles.card}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.wordInfo}>
            <TextInput
              label="Word *"
              value={getWordData("word")}
              onChangeText={(value) => onWordChange("word", value)}
              placeholder="Enter word"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Pronunciation"
              value={getWordData("pronunciation")}
              onChangeText={(value) => onWordChange("pronunciation", value)}
              placeholder="Enter pronunciation"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Meaning *"
              value={getWordData("meaning")}
              onChangeText={(value) => onWordChange("meaning", value)}
              placeholder="Enter meaning"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Example"
              value={getWordData("example")}
              onChangeText={(value) => onWordChange("example", value)}
              placeholder="Enter example sentence"
              style={styles.input}
              mode="outlined"
              multiline
            />
            <TextInput
              label="IELTS Level"
              value={getWordData("ieltsLevel")}
              onChangeText={(value) => onWordChange("ieltsLevel", value)}
              placeholder="Enter IELTS level"
              style={styles.input}
              mode="outlined"
            />
          </View>
        </ScrollView>
      </Surface>
    );
  }

  return (
    <Surface style={styles.card}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.wordInfo}>
          <Text style={styles.wordTitle}>
            Word: {showEnglish ? getWordData("word") : "••••••"}
          </Text>
          <Text style={styles.text}>
            Pronunciation:{" "}
            {showEnglish ? getWordData("pronunciation") : "••••••"}
          </Text>
          <Text style={styles.text}>Meaning: {getWordData("meaning")}</Text>
          <Text style={styles.text}>
            Example: "
            {showEnglish
              ? getWordData("example")
              : (getWordData("example") || "").replace(
                  getWordData("word") || "",
                  "••••••"
                )}
            "
          </Text>
          <Text style={styles.text}>
            IELTS Level: {getWordData("ieltsLevel")}
          </Text>
          <Text style={styles.text}>
            Date:{" "}
            {wordData.createdAt
              ? new Date(wordData.createdAt).toLocaleDateString()
              : ""}
          </Text>
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flex: 1,
  },
  wordInfo: {
    gap: 16,
  },
  input: {
    backgroundColor: "#fff",
  },
  wordTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default WordCard;
