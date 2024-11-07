import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CorteCajaScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Sección de Cobranza */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("CobranzaDetails")}
      >
        <Text style={styles.title}>Cobranza</Text>
        <Text style={styles.info}>Clientes: 15</Text>
        <Text style={styles.info}>Monto: $1500</Text>
      </TouchableOpacity>

      {/* Sección de Liquidaciones */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("LiquidacionesDetails")}
      >
        <Text style={styles.title}>Liquidaciones</Text>
        <Text style={styles.info}>Número de Liquidaciones: 3</Text>
      </TouchableOpacity>

      {/* Sección de No Pagos */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("NoPagosDetails")}
      >
        <Text style={styles.title}>No Pagos</Text>
        <Text style={styles.info}>Clientes: 2</Text>
      </TouchableOpacity>

      {/* Sección de Créditos */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("CreditosDetails")}
      >
        <Text style={styles.title}>Créditos</Text>
        <Text style={styles.info}>Número: 4</Text>
        <Text style={styles.info}>Monto: $5000</Text>
      </TouchableOpacity>

      {/* Sección de Primeros Pagos */}
      <View style={styles.section}>
        <Text style={styles.title}>Primeros Pagos</Text>
        <Text style={styles.info}>Monto: $1200</Text>
      </View>

      {/* Botones de acción */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Hacer Corte Diario</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.disabledButton]} disabled>
        <Text style={styles.buttonText}>Hacer Corte Semanal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",

  },
  section: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  info: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CorteCajaScreen;
