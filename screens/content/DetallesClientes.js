import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "../../api/axios";

import { formatearMonto } from "../../components/global/dinero";
import { useFocusEffect } from "@react-navigation/native";
import { RenovacionIcono } from "../../components/global/iconos";
import AdminActions from "../../components/screens/admin";
import RenovacionesModal from "../../components/global/modal";

const DetallesCliente = ({ route, navigation }) => {
  const { clienteId } = route.params;
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cobros, setCobros] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal

  // Función para abrir el modal
  const abrirModal = () => {
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false);
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
      setCobros(response.data);
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

  // Regargar los detalles al volver a la pantalla
  useFocusEffect(
    React.useCallback(() => {
      cargarDetallesCliente();
    }, [clienteId])
  );

  // Recargar los detalles al volver a la pantallaa de los historiales de pago
  useFocusEffect(
    useCallback(() => {
      cargarHistorialPagos();
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
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de {detalles.name}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.detailText}>
            Tipo de pago: {detalles.payment_type}
          </Text>
          <Text style={styles.detailText}>
            Total a pagar: {formatearMonto(detalles.total_to_pay)}
          </Text>
          <Text style={styles.detailText}>
            Balance: {formatearMonto(detalles.balance)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditarCliente", {
              clienteId,
              contrato: detalles.contract_number,
              cobrador: detalles.collector_id,
              actualizarDetalles: actualizarDetalles,
              nombreDeudor: detalles.name,
              montoTotal: detalles.total_to_pay,
              balance: detalles.balance,
            })
          }
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.renovacionesContainer}>
        <Text style={styles.renovacionesText}>
          Renovaciones: {detalles.renovaciones}
        </Text>
        <TouchableOpacity
          style={styles.renovacionesButton}
          onPress={abrirModal}
        >
          <RenovacionIcono size={22} color={"#6c1295"} />
          <Text style={styles.renovacionesButtonText}>Ver</Text>
        </TouchableOpacity>
      </View>

      <RenovacionesModal
        visible={modalVisible}
        onClose={cerrarModal}
        clienteId={clienteId}
      />

      <Text style={styles.paymentTitle}>Historial de pagos</Text>

      <View style={styles.paymentItem}>
        <Text style={styles.paymentText}>
          Primer pago: {formatearMonto(detalles.first_payment)}
        </Text>
      </View>

      <FlatList
        data={cobros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPago}
        ListEmptyComponent={
          <Text style={styles.noPagos}>No hay pagos registrados.</Text>
        }
        contentContainerStyle={styles.listContent}
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
  infoColumn: {
    flex: 1,
  },
  detailText: {
    fontSize: 16,
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
  },
  renovacionesContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "fit-content",
    marginBottom: 20,
  },
  renovacionesText: {
    fontSize: 16,
  },
  renovacionesButton: {
    marginTop: 8,
    flexDirection: "column",
    alignItems: "center",
  },
  renovacionesButtonText: {
    fontSize: 16,
    marginLeft: 5,
    marginVertical: 8,
    fontWeight: 500,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 16,
  },
  noPagos: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default DetallesCliente;
