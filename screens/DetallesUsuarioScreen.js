// screens/DetallesUsuarioScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DetallesUsuarioScreen = ({ route }) => {
  // Recibe los detalles del usuario desde la navegación
  const { usuario } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.detailText}>Nombre: {usuario.name}</Text>
      <Text style={styles.detailText}>
        Número de Identificación: {usuario.phone_number}
      </Text>
      <Text style={styles.detailText}>Contraseña: {usuario.password}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default DetallesUsuarioScreen;
