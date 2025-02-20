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

  const handleCorteSemanal = async () => {
    if (
      !fechaInicio ||
      !fechaFin ||
      !comisionCobro ||
      !comisionVentas ||
      !gastos
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await api.post("/cortes/semanal", {
        collector_id: usuarioId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        comision_cobro: comisionCobro,
        comision_ventas: comisionVentas,
        gastos,
      });

      // Si todo es exitoso, mostramos una alerta de éxito
      Alert.alert("Éxito", "Corte semanal realizado exitosamente.");
      onCorteRealizado();
      setModalVisible(false); // Cerrar el modal después de guardar
    } catch (error) {
      console.error("Error al realizar el corte semanal:", error);

      // Comprobamos si el error es un 409 (rango de fechas ya cubierto)
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data.error;
        const rangoExistente = error.response.data.rangoExistente;
        Alert.alert(
          "Error",
          `${errorMessage}\nFecha inicio: ${rangoExistente.fecha_inicio}\nFecha fin: ${rangoExistente.fecha_fin}`
        );
      } else if (error.response && error.response.status === 404) {
        Alert.alert(
          "Error",
          error.response.data.error ||
            "No se encontraron cortes diarios en este rango."
        );
      } else {
        // Si es otro tipo de error, mostramos un mensaje genérico
        Alert.alert("Error", "No se pudo realizar el corte semanal.");
      }
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
            <Text style={styles.modalTitle}>Crear Corte Semanal</Text>

            {/* Mostrar la fecha seleccionada en un "input" */}
            <TouchableOpacity
              onPress={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <Text style={styles.input}>
                {fechaInicio
                  ? `Fecha Inicio: ${fechaInicio}`
                  : "Selecciona la Fecha de Inicio"}
              </Text>
            </TouchableOpacity>
            {/* Mostrar el calendario solo cuando el estado isCalendarOpen sea true */}
            {isCalendarOpen && (
              <Calendar
                onDayPress={(day) => {
                  setFechaInicio(day.dateString);
                  setIsCalendarOpen(false); // Cerrar el calendario después de seleccionar la fecha
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
            {/* Mostrar el calendario solo cuando el estado isCalendarOpen sea true */}
            {isCalendarOpen2 && (
              <Calendar
                onDayPress={(day) => {
                  setFechaFin(day.dateString);
                  setIsCalendarOpen2(false); // Cerrar el calendario después de seleccionar la fecha
                }}
                markedDates={{
                  [fechaFin]: { selected: true, selectedColor: "green" },
                }}
                monthFormat={"yyyy MM"}
              />
            )}

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
                onPress={handleCorteSemanal}
              >
                <Text style={styles.confirmButtonText}>Crear Corte</Text>
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
