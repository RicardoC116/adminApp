import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import api from "../../api/axios";
import { DateTime } from "luxon";
import { PreCorteIcono } from "../global/iconos";
import { useNavigation } from "@react-navigation/native";

const PreCorteDiario = ({ usuarioId, ultimoPreCorte, onPreCorteRealizado }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [ventanillaId, setVentanillaId] = useState("");
  const [agente, setAgente] = useState("");
  const navigation = useNavigation();

  const confirmarPreCorte = () => {
    setModalVisible(true);
  };

  const handlePreCorte = async () => {
    if (!ventanillaId.trim() || !agente.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      // Fecha actual con zona horaria correcta
      const fechaActual = DateTime.now().setZone("America/Mexico_City").toISO();

      const response = await api.post("/cortes/registrar", {
        collector_id: usuarioId,
        ventanilla_id: ventanillaId,
        agente: agente,
        fecha: fechaActual, // ✅ Enviar la fecha actual correctamente
      });

      Alert.alert("Éxito", "Pre-Corte registrado exitosamente.");
      setModalVisible(false);
      setVentanillaId("");
      setAgente("");

      if (onPreCorteRealizado) onPreCorteRealizado();
    } catch (error) {
      console.error("Error al registrar el pre-corte:", error);
      Alert.alert("Error", "No se pudo registrar el pre-corte.");
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={confirmarPreCorte}>
        <Text style={styles.buttonText}>Registrar Pre-Corte</Text>
      </TouchableOpacity>

      {/*  */}
      <TouchableOpacity
        style={styles.imprimir}
        onPress={() => navigation.navigate("Precortes", { usuarioId })}
      >
        <Text style={styles.imprimirTexto}>
          <PreCorteIcono color={"#000"} size={24} />
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Datos del Pre-Corte</Text>

            <TextInput
              style={styles.input}
              placeholder="Ventanilla ID"
              keyboardType="numeric"
              value={ventanillaId}
              onChangeText={setVentanillaId}
            />

            <TextInput
              style={styles.input}
              placeholder="Agente"
              value={agente}
              onChangeText={setAgente}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handlePreCorte}
              >
                <Text style={styles.buttonText}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  imprimir: {
    backgroundColor: "#fff",
    padding: 5,
  },
  imprimirTexto: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
  },
});

export default PreCorteDiario;
