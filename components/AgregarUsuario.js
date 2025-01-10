// AgregarUsuarioScreen.js

import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Platform } from "react-native";
import api from "../api/axios";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-web";

const AgregarUsuarioScreen = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibily = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (name && password && phone_number) {
      try {
        await api.post("/cobradores", {
          name,
          phone_number,
          password,
        });
        alert("Usuario agregado.");
        setName("");
        setPassword("");
        setPhoneNumber("");
      } catch (error) {
        console.error(error);
        alert("Hubo un error al agregar el usuario.");
      }
    } else {
      alert("Por favor, ingresa todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
      />
      <TextInput
        style={styles.input}
        value={phone_number}
        onChangeText={setPhoneNumber}
        placeholder="Número de identificación"
        keyboardType="numeric"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.passwordInput,
            Platform.OS === "web" && { outlineStyle: "none" },
          ]}
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibily}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <Button
        title="Agregar usuario"
        onPress={handleSubmit}
        color={"#5d1793"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },

  eyeIcon: {
    padding: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#000",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default AgregarUsuarioScreen;
