// controlPanelScreen

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ClienteIcono } from "../components/iconos";

const ControlPanelScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AgregarUsuario")}
      >
        <ClienteIcono size={25} color="#AD49E1" />
        <Text style={styles.buttonText}>Agregar Usuario</Text>
      </TouchableOpacity>

      {/* Más botones de navegación si es necesario */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#333",
  },
});

export default ControlPanelScreen;
