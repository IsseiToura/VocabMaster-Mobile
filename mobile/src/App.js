import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { Provider as PaperProvider } from "react-native-paper";
import NoPage from "./pages/NoPage";
import AuthLayout from "./layouts/auth/AuthLayout";
import MainLayout from "./layouts/main/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import initializeNotifications from "./services/notifications/initNotifications";

const Stack = createNativeStackNavigator();

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Root"
        component={isAuthenticated ? MainLayout : AuthLayout}
      />
      <Stack.Screen name="Main" component={MainLayout} />
      <Stack.Screen name="Auth" component={AuthLayout} />
      <Stack.Screen name="NoPage" component={NoPage} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize notifications when the app starts
    initializeNotifications();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <AppRoutes />
            <Toast />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
