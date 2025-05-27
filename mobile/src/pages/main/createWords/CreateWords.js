import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Button, Text, Surface } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import WordCard from "../../../components/WordCard";
import { IELTS_LEVELS } from "../../../constants/IeltsLevel";
import { styles } from "./style";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function CreateWords() {
  const [ieltsLevel, setIeltsLevel] = useState("");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  React.useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("jwt");
      setToken(storedToken);
    };
    getToken();
  }, []);

  const handleGenerateWords = async () => {
    if (!ieltsLevel) {
      setError("Please select an IELTS level before creating words");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/words_generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ieltsLevel }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          setError(errorData.message);
        } else {
          throw new Error("Failed to generate words");
        }
        return;
      }
      const data = await response.json();
      setWords(data.words);
      Toast.show({
        type: "success",
        text1: "Words generated successfully",
        position: "top",
      });
    } catch (error) {
      console.error("Error generating words:", error);
      Toast.show({
        type: "error",
        text1: "Failed to generate words",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async (wordId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/words_generate/save_selected`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ wordIds: [wordId] }),
        }
      );
      if (!response.ok) throw new Error("Failed to save word");
      setWords(words.filter((word) => word._id !== wordId));
      Toast.show({
        type: "success",
        text1: "Word saved successfully",
        position: "top",
      });
    } catch (error) {
      console.error("Error saving word:", error);
      Toast.show({
        type: "error",
        text1: "Failed to save word",
        position: "top",
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Create Your Personal Vocabulary Book</Text>
        <Text style={styles.description}>
          Generate English words based on your IELTS level and build your own
          vocabulary book. Save words and enhance your English learning
          efficiently!
        </Text>

        <View style={styles.selectContainer}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select IELTS Level</Text>
            <Picker
              selectedValue={ieltsLevel}
              onValueChange={(value) => setIeltsLevel(value)}
              style={styles.picker}
            >
              <Picker.Item label="Choose level" value="" />
              {IELTS_LEVELS.map((level) => (
                <Picker.Item
                  key={level.value}
                  label={level.label}
                  value={level.value}
                />
              ))}
            </Picker>
          </View>

          <Button
            mode="contained"
            onPress={handleGenerateWords}
            loading={loading}
            style={styles.generateButton}
            icon={() => <Icon name="plus" size={16} color="white" />}
          >
            Create English Words
          </Button>
        </View>

        {error ? (
          <Surface style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </Surface>
        ) : null}

        <View style={styles.wordsContainer}>
          {words.map((word) => (
            <View key={word._id} style={styles.wordItem}>
              <WordCard word={word} showEnglish={true} />
              <Button
                mode="contained"
                onPress={() => handleSaveWord(word._id)}
                style={styles.saveButton}
              >
                Add to My Words
              </Button>
            </View>
          ))}
        </View>
      </Surface>
    </ScrollView>
  );
}

export default CreateWords;
