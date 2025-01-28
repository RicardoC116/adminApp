import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "../../api/axios"; // Asegúrate de que esta ruta sea correcta.
import { useNavigation } from "@react-navigation/native";

const DeudoresScreen = ({ route }) => {
  const { usuario } = route.params; // Recibimos el cobrador.
  const [deudores, setDeudores] = useState([]); // Estado para almacenar los deudores.
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga.
  const navigation = useNavigation();

  useEffect(() => {
    // Obtener la lista de deudores del backend
    const fetchDeudores = async () => {
      try {
        const response = await axios.get(`/deudores/cobrador/${usuario.id}`);
        setDeudores(response.data); // Asumimos que el backend devuelve un array de deudores.
      } catch (error) {
        console.error("Error al cargar los deudores:", error);
      } finally {
        setLoading(false); // Ocultar indicador de carga.
      }
    };

    fetchDeudores();
  }, [usuario.id]);

  // Función para navegar a los detalles del deudor
  const handleDeudorPress = (deudor) => {
    navigation.navigate("DetallesDeudor", { deudor });
  };

  // Renderizar cada deudor en la lista
  const renderDeudor = ({ item }) => (
    <TouchableOpacity
      style={styles.deudorItem}
      onPress={() => handleDeudorPress(item)}
    >
      <Text style={styles.deudorName}>{item.name}</Text>
      <Text style={styles.deudorMonto}>Monto: ${item.amount}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes de {usuario.name}</Text>
      {loading ? (
        <Text style={styles.loading}>Cargando deudores...</Text>
      ) : (
        <FlatList
          data={deudores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeudor}
        />
      )}
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
  loading: {
    textAlign: "center",
    fontSize: 16,
  },
  deudorItem: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  deudorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deudorMonto: {
    fontSize: 16,
    color: "#333",
  },
});

export default DeudoresScreen;
