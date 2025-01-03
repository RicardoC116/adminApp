import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DetallesUsuariosScreen = ({ route }) => {
  const { usuario } = route.params;
  const navigation = useNavigation();

  const handleNavigateToCortes = () => {
    navigation.navigate("Cortes", { usuario });
  };

  // boton para redirigir a navigateToCortesAgente
  const handleNavigateToCortesAgente = () => {
    navigation.navigate("CortesAgente", { usuario });
  };

  const handleNavigateToDeudores = () => {
    navigation.navigate("Deudores", { usuario });
  };

  const handleNavigateToHistorial = () => {
    navigation.navigate("HistorialCortes", { usuario });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opciones de {usuario.name}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={handleNavigateToCortes}
        >
          <Text style={styles.buttonText}>Realizar Cortes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={handleNavigateToCortesAgente}
        >
          <Text style={styles.buttonText}>Cortes Agente</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateToDeudores}
      >
        <Text style={styles.buttonText}>Ver Deudores</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateToHistorial}
      >
        <Text style={styles.buttonText}>Historial de Cortes</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    // marginBottom: 15,
  },
  smallButton: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: "center",
    flex: 1,
  },
});

export default DetallesUsuariosScreen;
