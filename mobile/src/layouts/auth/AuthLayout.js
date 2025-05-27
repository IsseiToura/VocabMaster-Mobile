import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";
import Login from "../../pages/auth/login/Login";
import Register from "../../pages/auth/register/Register";
import { styles } from "./styles";
import { CustomHeader } from "../Header";

const Tab = createBottomTabNavigator();

function AuthLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <CustomHeader />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#228be6",
          tabBarInactiveTintColor: "#868e96",
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="log-in" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Register"
          component={Register}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="user-plus" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default AuthLayout;
