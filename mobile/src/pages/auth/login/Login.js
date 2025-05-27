import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./style";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }
      const { token } = await response.json();
      await AsyncStorage.setItem("jwt", token);
      login({ username: username });
      Toast.show({
        type: "success",
        text1: "Login successful!",
        position: "top",
        visibilityTime: 3000,
      });
      navigation.navigate("Main");
    } catch (error) {
      setError(error.message);
      Toast.show({
        type: "error",
        text1: error.message,
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface}>
          <Text style={styles.title}>Hello, vocab learner!</Text>

          {error ? (
            <Surface style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </Surface>
          ) : null}

          <View style={styles.form}>
            <TextInput
              label="Name"
              value={username}
              onChangeText={setUsername}
              disabled={isLoading}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              disabled={isLoading}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Login;
