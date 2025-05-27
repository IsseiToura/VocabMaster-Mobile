import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "./auth/styles";

export function CustomHeader({ navigation, user, showMenu = false }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {showMenu && (
            <TouchableOpacity
              onPress={() => navigation?.openDrawer()}
              style={[styles.menuButton, { marginRight: 16 }]}
            >
              <Icon name="menu" size={24} color="white" />
            </TouchableOpacity>
          )}
          <Icon
            name="book-open"
            size={28}
            color="white"
            style={{ marginRight: 12 }}
          />
          <Text style={styles.headerTitle}>VocabMaster</Text>
        </View>
        {user && (
          <Text style={[styles.userName, { color: "white" }]}>
            {user.username}
          </Text>
        )}
      </View>
    </View>
  );
}
