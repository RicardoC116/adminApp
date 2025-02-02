import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import axios from "../../api/axios";
import { formatearMonto } from "../../components/global/dinero";
import { useFocusEffect } from "@react-navigation/native";
import AdminActions from "../../components/screens/admin";
import { capitalizeFirstLetter } from "../../components/global/letras";

const DetallesDeudor = ({ route, navigation }) => {
  const { deudor } = route.params;
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cobros, setCobros] = useState([]);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isAutorizado, setIsAutorizado] = useState(false);

  const handleConfirmPassword = () => {
    if (password === "serpiente79") {
      setIsAutorizado(true);
      setIsPasswordModalVisible(false);
      setPassword("");
    } else {
      Alert.alert("Error", "Contraseña incorrecta.");
    }
  };

  useEffect(() => {
    const fetchDetallesDeudor = async () => {
      try {
        const response = await axios.get(`/deudores/${deudor.id}`);
        setDetalles(response.data);
      } catch (error) {
        console.error("Error al cargar los detalles del deudor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetallesDeudor();
  }, [deudor.id]);

  // Cargar historial de pagos
  const cargarHistorialPagos = async () => {
    try {
      const response = await axios.get(`/cobros/deudor/${deudor.id}`);
      setCobros(response.data);
    } catch (error) {
      console.error("Error al cargar el historial de pagos:", error);
    }
  };

  // Cargar los detalles del deudor
  const cargarDetallesDeudor = async () => {
    try {
      const response = await axios.get(`/deudores/${deudor.id}`);
      setDetalles(response.data);
    } catch (error) {
      console.error("Error al cargar los detalles del deudor:", error);
    }
  };

  // Lo nuevo
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setIsAutorizado(false);
    });
    return unsubscribe;
  }, [navigation]);

  // Recargar los detalles al volver a la pantallaa de los historiales de pago
  useFocusEffect(
    useCallback(() => {
      cargarHistorialPagos();
    }, [deudor.id])
  );

  // Recargar los detalles de los usuarios al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarDetallesDeudor();
    }, [deudor.id])
  );

  // Funcion para actualizar ambos detalles al hacer cliick al boton
  const actualizarDetalles = async () => {
    cargarDetallesDeudor();
    cargarHistorialPagos();
  };

  const renderPago = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.paymentText}>
        Monto: {formatearMonto(item.amount)} - Fecha:{" "}
        {new Date(item.payment_date).toLocaleDateString()}
      </Text>
      <AdminActions
        cobroId={item.id}
        amount={item.amount}
        actualizarDetalles={actualizarDetalles}
        isAutorizado={isAutorizado}
        verificarContraseña={() => setIsPasswordModalVisible(true)}
        handleConfirmPassword={handleConfirmPassword}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando detalles del cliente...</Text>
      </View>
    );
  }

  if (!detalles) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No se pudieron cargar los clientes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de {detalles.name}</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.detailText}>
          Tipo de pago: {capitalizeFirstLetter(detalles.payment_type)}
        </Text>
        <Text style={styles.detailText}>
          Total a pagar: {formatearMonto(detalles.total_to_pay)}
        </Text>
        <Text style={styles.detailText}>
          Balance: {formatearMonto(detalles.balance)}
        </Text>
      </View>

      <Text style={styles.paymentTitle}>Historial de pagos</Text>

      <FlatList
        data={cobros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPago}
        ListEmptyComponent={
          <Text style={styles.noPagos}>No hay pagos registrados.</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Esto es lo nuevo que me has dado  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Verificación requerida</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={[styles.buttonModal, styles.confirmButton]}
              onPress={handleConfirmPassword}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonModal, styles.cancelButton]}
              onPress={() => setIsPasswordModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  paymentItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 12,
    marginVertical: 10,
  },
  paymentText: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  balanceContainer: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#d9534f",
  },
  buttonModal: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 5,
  },
});

export default DetallesDeudor;
