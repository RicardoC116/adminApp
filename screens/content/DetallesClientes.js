import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import axios from "../../api/axios";
import { useFocusEffect } from "@react-navigation/native";
import { formatearMonto } from "../../components/global/dinero";
import AdminActions from "../../components/screens/admin";
import { capitalizeFirstLetter } from "../../components/global/letras";

const DetallesCliente = ({ route, navigation }) => {
  const { clienteId } = route.params;
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cobros, setCobros] = useState([]);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isAutorizado, setIsAutorizado] = useState(false);

  // Función para verificar contraseña (Lo nuevo)
  const handleConfirmPassword = () => {
    if (password === "serpiente79") {
      setIsAutorizado(true);
      setIsPasswordModalVisible(false);
      setPassword("");
    } else {
      Alert.alert("Error", "Contraseña incorrecta.");
    }
  };

  const eliminarDeudor = async () => {
    try {
      // Mostrar alerta de confirmación
      Alert.alert(
        "Eliminar Deudor",
        "¿Estás seguro de que deseas eliminar a este cliente? Se eliminarán todos sus datos.",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: async () => {
              try {
                // Hacer la petición DELETE al backend
                await axios.delete(`/deudores/${clienteId}`);
                // Al eliminar con éxito, regresar a la pantalla anterior
                navigation.goBack();
              } catch (error) {
                console.error("Error al eliminar al deudor:", error);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error al eliminar deudor:", error);
    }
  };

  // Cargar los detalles del cliente
  useEffect(() => {
    const fetchDetallesCliente = async () => {
      try {
        const response = await axios.get(`/deudores/${clienteId}`);
        setDetalles(response.data);
      } catch (error) {
        console.error("Error al cargar los detalles del cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetallesCliente();
  }, [clienteId]);

  // Cargar historial de pagos
  const cargarHistorialPagos = async () => {
    try {
      const response = await axios.get(`/cobros/deudor/${clienteId}`);
      setCobros(response.data.reverse());
    } catch (error) {
      console.error("Error al cargar el historial de pagos:", error);
    }
  };

  // cargarDetallesCliente
  const cargarDetallesCliente = async () => {
    try {
      const response = await axios.get(`/deudores/${clienteId}`);
      setDetalles(response.data);
    } catch (error) {
      console.error("Error al cargar los detalles del cliente:", error);
    }
  };

  // Lo nuevo
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setIsAutorizado(false);
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await Promise.all([cargarDetallesCliente(), cargarHistorialPagos()]);
      };
      fetchData();
    }, [clienteId])
  );

  // Funcion para actualizar ambos detalles al hacer cliick al boton
  const actualizarDetalles = async () => {
    cargarHistorialPagos();
    cargarDetallesCliente();
  };

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
        <Text style={styles.error}>No se pudieron cargar los detalles.</Text>
      </View>
    );
  }

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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("clientesDetallados", { deudor: detalles })
        }
      >
        <Text style={styles.title}>Detalles de {detalles.name}</Text>
      </TouchableOpacity>
      <View style={styles.infoRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.detailText}>
            {/* Tipo de pago: {capitalizeFirstLetter(detalles.payment_type)} */}
            Tipo de pago:{" "}
            {detalles.payment_type === "diario"
              ? "Semanal"
              : detalles.payment_type === "semanal"
              ? "Mensual"
              : capitalizeFirstLetter(detalles.payment_type)}
            {/* Tipo de pago: {capitalizeFirstLetter(detalles.payment_type)} */}
          </Text>
          <Text style={styles.detailText}>
            Total a pagar: {formatearMonto(detalles.total_to_pay)}
          </Text>
          <Text style={styles.detailText}>
            Balance: {formatearMonto(detalles.balance)}
          </Text>
        </View>

        <View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditarCliente", {
                clienteId,
                contrato: detalles.contract_number,
                cobrador: detalles.collector_id,
                nombreDeudor: detalles.name,
                tipoDePago: detalles.payment_type,
                montoTotal: detalles.total_to_pay,
                pagoInicial: detalles.first_payment,
                balanceActual: detalles.balance,
              })
            }
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={eliminarDeudor}
          >
            <Text style={styles.deleteButtonText}>Eliminar Cliente</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.paymentTitle}>Historial de pagos</Text>

      <View style={styles.paymentItem}>
        <Text style={styles.paymentText}>
          Primer pago: {formatearMonto(detalles.first_payment)}
        </Text>
      </View>

      <FlatList
        data={cobros}
        renderItem={renderPago}
        keyExtractor={(item) => item.id.toString()}
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
  loading: {
    fontSize: 18,
    color: "#000",
  },
  error: {
    fontSize: 18,
    color: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  infoRow2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  infoColumn: {
    flex: 1,
  },
  infoColumn2: {},
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#6c1295",
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  renovacionesContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "start",
    maxWidth: "fit-content",
    marginBottom: 20,
  },
  renovacionesText: {
    fontSize: 16,
  },
  renovacionesButton: {
    marginTop: 8,
    flexDirection: "column",
    alignItems: "start",
    marginLeft: 35,
  },
  renovacionesButtonText: {
    fontSize: 16,
    marginLeft: 5,
    marginVertical: 8,
    fontWeight: "500",
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 12,
    marginVertical: 10,
  },
  paymentItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    // rowGap: 10,
    // gap:50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 16,
    flex: 1,
  },
  noPagos: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#d9534f",
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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

export default DetallesCliente;
