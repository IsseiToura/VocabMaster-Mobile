import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  Surface,
  List,
  IconButton,
  Divider,
  Button,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./style";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function PracticeHistories() {
  const [histories, setHistories] = useState([]);
  const [historyDetails, setHistoryDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("jwt");
      setToken(storedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/practice_histories?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch practice histories");
        }
        const responseData = await response.json();
        const historiesData = Array.isArray(responseData)
          ? responseData
          : responseData.data || [];
        setHistories(historiesData);
        setTotalPages(responseData.pagination.pages);
      } catch (error) {
        console.error("Error fetching practice histories:", error);
        setHistories([]);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchHistories();
    }
  }, [page, limit, token]);

  const fetchHistoryDetails = async (historyId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/practice_histories/${historyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch practice history details");
      }
      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        setHistoryDetails((prev) => ({
          ...prev,
          [historyId]: responseData.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching history details:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleAccordion = (historyId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [historyId]: !prev[historyId],
    }));
    if (!historyDetails[historyId]) {
      fetchHistoryDetails(historyId);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Practice History</Text>
        {!Array.isArray(histories) || histories.length === 0 ? (
          <Text style={styles.noHistoryText}>
            No practice history available
          </Text>
        ) : (
          <View style={styles.historyList}>
            {histories.map((history) => (
              <View key={history._id} style={styles.historyItem}>
                <Surface style={styles.historyHeader}>
                  <View style={styles.historyHeaderContent}>
                    <Text style={styles.dateText}>
                      {formatDate(history.createdAt)}
                    </Text>
                    <View
                      style={[
                        styles.scoreBadge,
                        history.score >= 7
                          ? styles.highScoreBadge
                          : styles.lowScoreBadge,
                      ]}
                    >
                      <Text style={styles.scoreText}>
                        Score: {history.score}/{history.totalQuestions}
                      </Text>
                    </View>
                    <IconButton
                      icon={
                        expandedItems[history._id]
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      onPress={() => toggleAccordion(history._id)}
                    />
                  </View>

                  {expandedItems[history._id] && (
                    <View style={styles.historyDetails}>
                      {historyDetails[history._id] ? (
                        <List.Section>
                          {historyDetails[history._id].wordResults.map(
                            (result) => (
                              <List.Item
                                key={result._id}
                                title={result.wordId.word}
                                description={result.wordId.meaning}
                                left={(props) => (
                                  <List.Icon
                                    {...props}
                                    icon={result.isCorrect ? "check" : "close"}
                                    color={
                                      result.isCorrect ? "#4caf50" : "#f44336"
                                    }
                                  />
                                )}
                              />
                            )
                          )}
                        </List.Section>
                      ) : (
                        <Text style={styles.loadingText}>
                          Loading details...
                        </Text>
                      )}
                    </View>
                  )}
                </Surface>
                <Divider />
              </View>
            ))}
          </View>
        )}

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

export default PracticeHistories;
