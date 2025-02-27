import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import api from "../../api/axios";
import * as Print from "expo-print";
import { ImprimirIcono } from "../global/iconos";
import { formatearMonto } from "../global/dinero";

const CorteSemanal = ({ usuarioId, ultimoCorteSemanal, onCorteRealizado }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [comisionCobro, setComisionCobro] = useState("");
  const [comisionVentas, setComisionVentas] = useState("");
  const [gastos, setGastos] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCalendarOpen2, setIsCalendarOpen2] = useState(false);
  const [preCorte, setPreCorte] = useState(null);

  const handlePreCorteSemanal = async () => {
    if (!fechaInicio || !fechaFin) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await api.post("/cortes/semanal/preCorte", {
        collector_id: usuarioId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });

      setPreCorte(response.data.data);
      setModalVisible(false); // Cerrar el modal de entrada de datos
    } catch (error) {
      console.error("Error al realizar el pre-corte semanal:", error);
      Alert.alert("Error", "No se pudo realizar el pre-corte semanal.");
    }
  };

  const handleConfirmarCorteSemanal = async () => {
    try {
      const response = await api.post(
        `/cortes/semanal/preCorte/${preCorte.id}`,
        {
          comision_cobro: comisionCobro, // Enviar en snake_case
          comision_ventas: comisionVentas,
          gastos: gastos,
        } // Enviar datos al backend
      );

      Alert.alert("Éxito", "Corte semanal confirmado exitosamente.");
      onCorteRealizado();
      setPreCorte(null); // Limpiar el pre-corte después de confirmar
    } catch (error) {
      console.error("Error al confirmar el corte semanal:", error);
      Alert.alert("Error", "No se pudo confirmar el corte semanal.");
    }
  };

  const handleCancelarPreCorte = async () => {
    try {
      if (!preCorte?.id) {
        Alert.alert("Error", "No se pudo encontrar el pre-corte.");
        return;
      }
      await api.delete(`/cortes/semanal/preCorte/${preCorte.id}`);
      setPreCorte(null); // Limpiar el pre-corte después de cancelar
    } catch (error) {
      console.error("Error al cancelar el pre-corte semanal:", error);
      Alert.alert("Error", "No se pudo cancelar el pre-corte semanal.");
    }
  };

  const imprimirDetalles = () => {
    const contenido = `
    <html>
       <head>
         <style>
           body {
             font-family: Arial, sans-serif;
             padding: 20px;
             color: #000;
           }
           h1, h2 {
             color: #444;
             text-align: center;
           }
           table {
             width: 100%;
             border-collapse: collapse;
             margin: 20px 0;
           }
           th, td {
             border: 1px solid #ddd;
             padding: 10px;
             text-align: left;
           }
           th {
             background-color: #f4f4f4;
           }
           .info-section {
             margin-bottom: 20px;
           }
         </style>
       </head>
       <body>
         <h1>Detalles del Corte Semanal</h1>
         <h2>Información General</h2>
   
         <div class="info-section">
           <table>
             <tbody>

       <tr><th>Fecha Inicio</th><td>${new Date(
         ultimoCorteSemanal.fecha_inicio
       ).toLocaleDateString()}</td></tr>
       <tr><th>Fecha Fin</th><td>${new Date(
         ultimoCorteSemanal.fecha_fin
       ).toLocaleDateString()}</td></tr>
       <tr><th>Clientes Cobrados</th><td>${
         ultimoCorteSemanal.deudores_cobrados
       }</td></tr>
       <tr><th>Cobranza Total</th><td>${formatearMonto(
         ultimoCorteSemanal.cobranza_total
       )}</td></tr>
       <tr><th>Nuevos Clientes</th><td>${
         ultimoCorteSemanal.nuevos_deudores
       }</td></tr>
       <tr><th>Créditos Total Monto</th><td>${formatearMonto(
         ultimoCorteSemanal.creditos_total_monto
       )}</td></tr>
       <tr><th>Primeros Pagos Monto</th><td>${formatearMonto(
         ultimoCorteSemanal.primeros_pagos_Monto
       )}</td></tr>
       <tr><th>Liquidaciones Total Monto</th><td>${formatearMonto(
         ultimoCorteSemanal.liquidaciones_total
       )}</td></tr>
       <tr><th>Créditos Total</th><td>${
         ultimoCorteSemanal.creditos_total
       }</td></tr>
       <tr><th>Primeros Pagos Total</th><td>${parseFloat(
         ultimoCorteSemanal.primeros_pagos_total
       )}</td></tr>
       <tr><th>No Pagos Total</th><td>${
         ultimoCorteSemanal.no_pagos_total
       }</td></tr>
       <tr><th>Comisión por Cobro</th><td>${formatearMonto(
         ultimoCorteSemanal.comision_cobro
       )}</td></tr>
       <tr><th>Comisión Ventas</th><td>${formatearMonto(
         ultimoCorteSemanal.comision_ventas
       )}</td></tr>
       <tr><th>Gastos</th><td>${formatearMonto(
         ultimoCorteSemanal.gastos
       )}</td></tr>
       <tr><th>Saldo Final</th><td>${formatearMonto(
         ultimoCorteSemanal.saldo_final
       )}</td></tr>
       <tr><th>Total Ingreso</th><td>${formatearMonto(
         ultimoCorteSemanal.total_ingreso
       )}</td></tr>
       <tr><th>Total Gastos</th><td>${formatearMonto(
         ultimoCorteSemanal.total_gasto
       )}</td></tr>
       <tr><th>Total Agente</th><td>${formatearMonto(
         ultimoCorteSemanal.total_agente
       )}</td></tr>

             </tbody>
           </table>
         </div>
       </body>
     </html>
   `;

    Print.printAsync({
      html: contenido,
    });
  };

  return (
    <View>
      {/* Botón para abrir el modal */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Corte Semanal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imprimir} onPress={imprimirDetalles}>
        <Text style={styles.imprimirTexto}>
          <ImprimirIcono size={24} />
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Pre-Corte Semanal</Text>

            {/* Campos para el pre-corte */}
            <TouchableOpacity
              onPress={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <Text style={styles.input}>
                {fechaInicio
                  ? `Fecha Inicio: ${fechaInicio}`
                  : "Selecciona la Fecha de Inicio"}
              </Text>
            </TouchableOpacity>
            {isCalendarOpen && (
              <Calendar
                onDayPress={(day) => {
                  setFechaInicio(day.dateString);
                  setIsCalendarOpen(false);
                }}
                markedDates={{
                  [fechaInicio]: { selected: true, selectedColor: "green" },
                }}
                monthFormat={"yyyy MM"}
              />
            )}

            <TouchableOpacity
              onPress={() => setIsCalendarOpen2(!isCalendarOpen2)}
            >
              <Text style={styles.input}>
                {fechaFin
                  ? `Fecha Fin: ${fechaFin}`
                  : "Selecciona la Fecha de Fin"}
              </Text>
            </TouchableOpacity>
            {isCalendarOpen2 && (
              <Calendar
                onDayPress={(day) => {
                  setFechaFin(day.dateString);
                  setIsCalendarOpen2(false);
                }}
                markedDates={{
                  [fechaFin]: { selected: true, selectedColor: "green" },
                }}
                monthFormat={"yyyy MM"}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handlePreCorteSemanal}
              >
                <Text style={styles.confirmButtonText}>Crear Pre-Corte</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para confirmar el pre-corte */}
      {preCorte && (
        // CorteSemanal.js (modal de confirmación)
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!preCorte}
          onRequestClose={() => setPreCorte(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Corte Semanal</Text>

              {/* Mostrar datos del pre-corte */}
              <Text>
                Cobranza Total: {formatearMonto(preCorte.cobranza_total)}
              </Text>
              <Text>Creditos Realizado: {preCorte.creditos_total}</Text>

              {/* Campos para comisiones y gastos */}
              <TextInput
                placeholder="Comisión de Cobro"
                style={styles.input}
                keyboardType="numeric"
                value={comisionCobro}
                onChangeText={setComisionCobro}
              />
              <TextInput
                placeholder="Comisión de Ventas"
                style={styles.input}
                keyboardType="numeric"
                value={comisionVentas}
                onChangeText={setComisionVentas}
              />
              <TextInput
                placeholder="Gastos"
                style={styles.input}
                keyboardType="numeric"
                value={gastos}
                onChangeText={setGastos}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmarCorteSemanal} // Enviar comisiones y gastos aquí
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelarPreCorte}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
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
    justifyContent: "space-around",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CorteSemanal;
