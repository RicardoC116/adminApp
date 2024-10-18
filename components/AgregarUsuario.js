// AgregarUsuarioScreen.js

import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import api from "../api/axios";

const AgregarUsuarioScreen = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

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
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
      />
      <Button title="Agregar usuario" onPress={handleSubmit} />
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
});

export default AgregarUsuarioScreen;
