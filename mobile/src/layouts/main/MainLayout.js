import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { useAuth } from "../../contexts/AuthContext";
import CreateWords from "../../pages/main/createWords/CreateWords";
import YourWords from "../../pages/main/yourWords/YourWords";
import Practice from "../../pages/main/practice/Practice";
import PracticeHistories from "../../pages/main/practiceHistories/PracticeHistories";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationService from "../../services/notifications/NotificationService";
import { CustomHeader } from "../Header";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { navigation } = props;
  const { logout } = useAuth();

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#e7f5ff" }}>
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>What do you want to do?</Text>
      </View>
      <View style={styles.menuItems}>
        <DrawerItem
          label="Create Words"
          onPress={() => navigation.navigate("CreateWords")}
        />
        <DrawerItem
          label="Your Words"
          onPress={async () => {
            navigation.navigate("YourWords");
            await NotificationService.sendImmediateNotification(
              "Practice Reminder",
              "Let's practice your words in Practice section!"
            );
          }}
        />
        <DrawerItem
          label="Practice"
          onPress={() => navigation.navigate("Practice")}
        />
        <DrawerItem
          label="Practice Histories"
          onPress={() => navigation.navigate("PracticeHistories")}
        />
        <DrawerItem label="Logout" onPress={logout} />
      </View>
    </DrawerContentScrollView>
  );
}

function MainLayout() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Drawer.Navigator
        screenOptions={{
          header: ({ navigation }) => (
            <CustomHeader navigation={navigation} user={user} showMenu={true} />
          ),
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="CreateWords" component={CreateWords} />
        <Drawer.Screen name="YourWords" component={YourWords} />
        <Drawer.Screen name="Practice" component={Practice} />
        <Drawer.Screen name="PracticeHistories" component={PracticeHistories} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

export default MainLayout;
