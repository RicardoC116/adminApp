import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import axios from "../../api/axios";
import { formatearMonto } from "../global/dinero";

// const CONTRASENA_LOCAL = "serpiente79";

const AdminActions = ({
  cobroId,
  amount,
  actualizarDetalles,
  isAutorizado,
  verificarContraseña,
  handleConfirmPassword,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nuevoMonto, setNuevoMonto] = useState("");

  const eliminarCobro = async () => {
    if (!isAutorizado) {
      verificarContraseña();
      return;
    }

    Alert.alert(
      "¿Estás seguro?",
      `Esta acción eliminará el cobro de manera permanente, el monto actual es ${formatearMonto(
        amount
      )}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, eliminar",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `/cobros/eliminar/${cobroId}`
              );
              Alert.alert("Eliminado", response.data.message, [
                { text: "OK", onPress: actualizarDetalles },
              ]);
            } catch (error) {
              console.error("Error al eliminar el cobro:", error);
              Alert.alert("Error", "No se pudo eliminar el cobro.");
            }
          },
        },
      ]
    );
  };

  const modificarCobro = () => {
    if (!isAutorizado) {
      verificarContraseña();
      return;
    }
    setIsModalVisible(true);
  };

  const guardarNuevoMonto = async () => {
    if (!nuevoMonto || nuevoMonto <= 0) {
      Alert.alert("Error", "El monto debe ser mayor a 0.");
      return;
    }

    try {
      const response = await axios.put("/cobros/modificar", {
        cobro_id: cobroId,
        nuevo_monto: parseFloat(nuevoMonto),
      });
      Alert.alert("Modificado", response.data.message, [
        { text: "OK", onPress: actualizarDetalles },
      ]);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error al modificar el cobro:", error);
      Alert.alert("Error", "No se pudo modificar el cobro.");
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={modificarCobro}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={eliminarCobro}
      >
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>

      {/* Modal para modificar el monto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Modificar Cobro (Monto actual: {formatearMonto(amount)})
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nuevo Monto"
              keyboardType="numeric"
              value={nuevoMonto}
              onChangeText={setNuevoMonto}
            />
            <TouchableOpacity
              style={[styles.buttonModal, styles.confirmButton]}
              onPress={guardarNuevoMonto}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonModal, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonModal: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#d9534f",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
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
});

export default AdminActions;
