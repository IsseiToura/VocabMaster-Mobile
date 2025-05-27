import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Button, Text, Surface, IconButton, Menu } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import WordCard from "../../../components/WordCard";
import { styles } from "./style";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function YourWords() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEnglish, setShowEnglish] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort, setSort] = useState("newest");
  const [timeFilter, setTimeFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [newWord, setNewWord] = useState(null);
  const [token, setToken] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [timeMenuVisible, setTimeMenuVisible] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("jwt");
      setToken(storedToken);
    };
    getToken();
  }, []);

  const fetchWords = async (currentPage = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/your_words?page=${currentPage}&limit=${limit}&sort=${sort}${
          timeFilter ? `&timeFilter=${timeFilter}` : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setWords(data.data);
        setTotalPages(data.pagination.pages);
        setPage(currentPage);
      } else {
        setError(data.message);
        Toast.show({
          type: "error",
          text1: data.message,
          position: "top",
        });
      }
    } catch (error) {
      setError(error.message);
      Toast.show({
        type: "error",
        text1: "Failed to fetch words",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWords(1);
    }
  }, [sort, timeFilter, token]);

  useEffect(() => {
    if (token) {
      fetchWords(page);
    }
  }, [page, token]);

  const handleDeleteWord = async (wordId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/your_words/${wordId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setWords(words.filter((word) => word._id !== wordId));
        Toast.show({
          type: "success",
          text1: "Word deleted successfully",
          position: "top",
        });
        setPage(1);
      }
    } catch (error) {
      setError(error.message);
      Toast.show({
        type: "error",
        text1: "Failed to delete word",
        position: "top",
      });
    }
  };

  const createWords = () => {
    const emptyWord = {
      word: "",
      pronunciation: "",
      meaning: "",
      example: "",
      ieltsLevel: "",
      createdAt: new Date().toISOString(),
    };
    setNewWord(emptyWord);
  };

  const handleNewWordChange = (field, value) => {
    setNewWord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveNewWord = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/your_words/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newWord),
      });
      const data = await response.json();
      if (data.success) {
        setNewWord(null);
        Toast.show({
          type: "success",
          text1: "Word created successfully",
          position: "top",
        });
        // Refresh the first page after creating new word
        fetchWords(1);
      } else {
        if (data.errors) {
          data.errors.forEach((error) => {
            Toast.show({
              type: "error",
              text1: `${error.path}: ${error.msg}`,
              position: "top",
            });
          });
        } else {
          setError(data.message);
          Toast.show({
            type: "error",
            text1: data.message,
            position: "top",
          });
        }
      }
    } catch (error) {
      setError(error.message);
      Toast.show({
        type: "error",
        text1: "Failed to create word",
        position: "top",
      });
    }
  };

  const handleShareAllWords = async () => {
    try {
      if (words.length === 0) {
        Toast.show({
          type: "error",
          text1: "No words to share",
          position: "top",
        });
        return;
      }

      const shareText = words
        .map((item, index) => {
          // Check if word object exists and has the required properties
          if (!item || !item.wordId) {
            return null;
          }

          const word = item.wordId;
          const wordData = {
            word: word.word || "N/A",
            pronunciation: word.pronunciation || "N/A",
            meaning: word.meaning || "N/A",
            example: word.example || "N/A",
            ieltsLevel: word.ieltsLevel || "N/A",
          };

          return `Word ${index + 1}:\nWord: ${wordData.word}\nPronunciation: ${
            wordData.pronunciation
          }\nMeaning: ${wordData.meaning}\nExample: ${
            wordData.example
          }\nIELTS Level: ${wordData.ieltsLevel}\n\n`;
        })
        .filter((text) => text !== null) // Remove any null entries
        .join("---\n\n");

      if (await Sharing.isAvailableAsync()) {
        const fileUri = `${FileSystem.cacheDirectory}vocabulary.txt`;
        await FileSystem.writeAsStringAsync(fileUri, shareText);

        await Sharing.shareAsync(fileUri, {
          mimeType: "text/plain",
          dialogTitle: "Share Vocabulary",
          UTI: "public.plain-text",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Sharing is not available on this device",
          position: "top",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to share vocabulary",
        position: "top",
      });
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Words</Text>
          <View style={styles.filterContainer}>
            <IconButton
              icon="share"
              onPress={handleShareAllWords}
              style={styles.filterButton}
            />
            <IconButton
              icon="filter"
              onPress={() => setShowFilters(!showFilters)}
              style={styles.filterButton}
            />
            <IconButton
              icon={showEnglish ? "eye-off" : "eye"}
              onPress={() => setShowEnglish(!showEnglish)}
              style={styles.eyeButton}
            />
          </View>
        </View>

        {showFilters && (
          <View style={styles.filtersContent}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Sort by:</Text>
              <Menu
                visible={sortMenuVisible}
                onDismiss={() => setSortMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setSortMenuVisible(true)}
                    style={styles.filterButton}
                  >
                    {sort === "newest" ? "Newest First" : "Oldest First"}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setSort("newest");
                    setPage(1);
                    setSortMenuVisible(false);
                  }}
                  title="Newest First"
                />
                <Menu.Item
                  onPress={() => {
                    setSort("oldest");
                    setPage(1);
                    setSortMenuVisible(false);
                  }}
                  title="Oldest First"
                />
              </Menu>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Time filter:</Text>
              <Menu
                visible={timeMenuVisible}
                onDismiss={() => setTimeMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setTimeMenuVisible(true)}
                    style={styles.filterButton}
                  >
                    {timeFilter === ""
                      ? "All Time"
                      : timeFilter === "week"
                      ? "This Week"
                      : "This Month"}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setTimeFilter("");
                    setPage(1);
                    setTimeMenuVisible(false);
                  }}
                  title="All Time"
                />
                <Menu.Item
                  onPress={() => {
                    setTimeFilter("week");
                    setPage(1);
                    setTimeMenuVisible(false);
                  }}
                  title="This Week"
                />
                <Menu.Item
                  onPress={() => {
                    setTimeFilter("month");
                    setPage(1);
                    setTimeMenuVisible(false);
                  }}
                  title="This Month"
                />
              </Menu>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={createWords}
            style={styles.createButton}
          >
            Create New Word
          </Button>
        </View>

        {newWord && (
          <Surface style={styles.newWordContainer}>
            <WordCard
              word={newWord}
              showEnglish={showEnglish}
              isEditable={true}
              onWordChange={handleNewWordChange}
            />
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={saveNewWord}
                style={styles.saveButton}
              >
                Save
              </Button>
              <Button
                mode="contained"
                onPress={() => setNewWord(null)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          </Surface>
        )}

        <View style={styles.wordsContainer}>
          {words.map((word) => (
            <Surface key={word._id} style={styles.wordItem}>
              <WordCard word={word} showEnglish={showEnglish} />
              <Button
                mode="contained"
                onPress={() => handleDeleteWord(word._id)}
                style={styles.deleteButton}
              >
                Delete
              </Button>
            </Surface>
          ))}
        </View>

        <View style={styles.paginationContainer}>
          <Button
            mode="contained"
            onPress={() => setPage(page - 1)}
            disabled={page === 1}
            style={styles.paginationButton}
          >
            Previous
          </Button>
          <Text style={styles.pageText}>
            Page {page} of {totalPages}
          </Text>
          <Button
            mode="contained"
            onPress={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={styles.paginationButton}
          >
            Next
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
}

export default YourWords;
