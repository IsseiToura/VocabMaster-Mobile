import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Button, Text, Surface, ProgressBar } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PracticeCard from "../../../components/PracticeCard";
import PracticeComplete from "./PracticeComplete";
import { SegmentedButtons } from "react-native-paper";
import { styles } from "./style";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function Practice() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [languageDirection, setLanguageDirection] = useState(
    "english-to-japanese"
  );
  const [showPractice, setShowPractice] = useState(false);
  const [wordResults, setWordResults] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("jwt");
      setToken(storedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/practice/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setWords(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchWords();
    }
  }, [token]);

  useEffect(() => {
    setIsFlipped(languageDirection === "japanese-to-english");
  }, [languageDirection]);

  const handleCorrect = async () => {
    const newScore = score + 1;
    setScore(newScore);
    const newWordResults = [
      ...wordResults,
      { wordId: words[currentCardIndex].wordId, isCorrect: true },
    ];
    setWordResults(newWordResults);

    if (currentCardIndex === words.length - 1) {
      setPracticeComplete(true);
      sendResults(newWordResults, newScore);
    } else {
      moveToNextCard();
    }
  };

  const handleIncorrect = () => {
    const newWordResults = [
      ...wordResults,
      { wordId: words[currentCardIndex].wordId, isCorrect: false },
    ];
    setWordResults(newWordResults);

    if (currentCardIndex === words.length - 1) {
      setPracticeComplete(true);
      sendResults(newWordResults, score);
    } else {
      moveToNextCard();
    }
  };

  const moveToNextCard = () => {
    setCurrentCardIndex(currentCardIndex + 1);
    setIsFlipped(languageDirection === "japanese-to-english");
  };

  const sendResults = async (finalResults, finalScore) => {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wordResults: finalResults,
          score: finalScore,
          totalQuestions: words.length,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (practiceComplete)
    return (
      <PracticeComplete
        score={score}
        words={words}
        onPracticeAgain={() => {
          setShowPractice(false);
          setPracticeComplete(false);
          setCurrentCardIndex(0);
          setScore(0);
          setWordResults([]);
        }}
      />
    );

  const currentCard = words[currentCardIndex];

  if (!showPractice) {
    return (
      <ScrollView style={styles.container}>
        <Surface style={styles.surface}>
          <Text style={styles.title}>Choose your practice mode!</Text>
          <View style={styles.segmentedContainer}>
            <SegmentedButtons
              value={languageDirection}
              onValueChange={setLanguageDirection}
              buttons={[
                {
                  value: "english-to-japanese",
                  label: "English to Japanese",
                  labelStyle: styles.segmentedButtonLabel,
                },
                {
                  value: "japanese-to-english",
                  label: "Japanese to English",
                  labelStyle: styles.segmentedButtonLabel,
                },
              ]}
            />
          </View>
          <Button
            mode="contained"
            onPress={() => setShowPractice(true)}
            style={styles.startButton}
          >
            Start Practice
          </Button>
        </Surface>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.segmentedContainer}>
          <SegmentedButtons
            value={languageDirection}
            onValueChange={setLanguageDirection}
            buttons={[
              {
                value: "english-to-japanese",
                label: "English to Japanese",
                labelStyle: styles.segmentedButtonLabel,
              },
              {
                value: "japanese-to-english",
                label: "Japanese to English",
                labelStyle: styles.segmentedButtonLabel,
              },
            ]}
          />
        </View>

        <PracticeCard
          word={currentCard.word}
          meaning={currentCard.meaning}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleCorrect}
            style={[styles.actionButton, styles.correctButton]}
            icon={() => <Icon name="check" size={24} color="white" />}
          >
            Correct
          </Button>
          <Button
            mode="contained"
            onPress={handleIncorrect}
            style={[styles.actionButton, styles.incorrectButton]}
            icon={() => <Icon name="x" size={24} color="white" />}
          >
            Incorrect
          </Button>
        </View>

        <ProgressBar
          progress={(currentCardIndex + 1) / words.length}
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>
          Progress: {currentCardIndex + 1}/{words.length}
        </Text>
      </Surface>
    </ScrollView>
  );
}

export default Practice;
