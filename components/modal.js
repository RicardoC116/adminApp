import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "../api/axios";
import { formatearMonto } from "./dinero";

const RenovacionesModal = ({ visible, onClose, clienteId }) => {
  const [contratos, setContratos] = useState([]);

  // Cargar los detalles del cliente
  useEffect(() => {
    const fetchContratoCliente = async () => {
      try {
        const response = await axios.get(`deudores/contratos/${clienteId}`);
        setContratos(response.data);
      } catch (error) {
        console.error("Error al cargar los contratos:", error);
      }
    };

    fetchContratoCliente();
  }, [clienteId]);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Contratos del cliente</Text>
          {contratos.length > 0 ? (
            <FlatList
              data={contratos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.contractItem}>
                  <Text style={styles.contractText}>
                    Número de contrato: {item.contract_number}
                  </Text>

                  <Text style={styles.contractText}>
                    Monto: {formatearMonto(item.amount)}
                  </Text>
                  <Text style={styles.contractText}>
                    Primer pago: {formatearMonto(item.first_payment)}
                  </Text>
                  <Text style={styles.contractText}>
                    Fecha de inicio:{" "}
                    {new Date(item.fecha_inicio).toLocaleDateString()}
                  </Text>
                  <Text style={styles.contractText}>
                    Fecha final: {new Date(item.fecha_fin).toLocaleDateString()}
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noContracts}>No se encontraron contratos.</Text>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#6c1295",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  contractItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  contractText: {
    fontSize: 16,
  },
  noContracts: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default RenovacionesModal;
