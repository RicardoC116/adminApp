import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InputWithIcon = ({
  value,
  onChangeText,
  placeholder,
  onFocus,
  onBlur,
  focus,
}) => {
  return (
    <View
      style={[
        styles.container,
        focus ? styles.containerFocus : styles.containerNoFocus,
      ]}
    >
      <Ionicons name="search" size={20} color="#333" style={styles.icon} />
      <TextInput
        style={[
          styles.input,
          Platform.OS === "web" && { outlineStyle: "none" },
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
  },
  containerFocus: {
    borderColor: "#4A90E2",
    backgroundColor: "#E8F0FE",
  },
  containerNoFocus: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    // color: "#333",
  },
});

export default InputWithIcon;
