import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import api from "../../api/axios";
import { formatearMonto } from "../global/dinero";

const PreCortesScreen = ({ route }) => {
  const { usuarioId } = route.params;
  const [preCortes, setPreCortes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("usuarioId recibido:", usuarioId);
    fetchPreCortes();
    // console.log("preCortes cargados:", preCortes);
  }, []);

  const fetchPreCortes = async () => {
    try {
      const response = await api.get(`cortes/preCorte/${usuarioId}`);
      setPreCortes(response.data);
    } catch (error) {
      console.error("Error al obtener pre-cortes:", error);
      Alert.alert("Error", "No se pudieron cargar los pre-cortes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePreCorte = async (id) => {
    Alert.alert(
      "Eliminar Pre-Corte",
      "¿Seguro que deseas eliminar este pre-corte?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`cortes/preCorte/${id}`);
              setPreCortes((prev) => prev.filter((corte) => corte.id !== id));
              Alert.alert("Eliminado", "Pre-Corte eliminado con éxito.");
            } catch (error) {
              console.error("Error al eliminar el pre-corte:", error);
              Alert.alert("Error", "No se pudo eliminar el pre-corte.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Función para formatear fecha y hora correctamente
  const formatDateTime = (fechaCompleta) => {
    const dateObj = new Date(fechaCompleta); // Asegurar conversión correcta

    // Convertir directamente a la zona horaria local sin modificarla
    const fecha = dateObj.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/Mexico_City", // Asegurar que se muestra bien
    });

    const hora = dateObj.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/Mexico_City", // Mantener la zona horaria correcta
    });

    return { fecha, hora };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pre-Cortes Registrados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : preCortes.length === 0 ? (
        <Text style={styles.noData}>Aún no se han registrado pre-cortes.</Text>
      ) : (
        <FlatList
          data={preCortes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const { fecha, hora } = formatDateTime(item.fecha);
            return (
              <View style={styles.card}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Ventanilla:</Text>{" "}
                  {item.ventanilla_id}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Cobrador:</Text> {item.agente}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Fecha:</Text> {fecha}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Hora:</Text> {hora}
                </Text>

                <Text style={styles.text}>
                  <Text style={styles.label}>Monto cobrado:</Text>{" "}
                  {formatearMonto(item.cobranza_total)}
                </Text>

                {/* <Text style={styles.text}>
                  <Text style={styles.label}>Primeros Pagos Monto:</Text>{" "}
                  {formatearMonto(item.primeros_pagos_montos)}
                </Text> */}

                <Text style={styles.text}>
                  <Text style={styles.label}>Clientes Cobrados:</Text>{" "}
                  {item.deudores_cobrados}
                </Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePreCorte(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            );
          }}
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
    textAlign: "center",
    marginBottom: 20,
  },
  noData: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PreCortesScreen;
