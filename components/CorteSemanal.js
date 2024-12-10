// components/CorteSemanal
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import api from "../api/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CorteSemanal = ({ usuarioId }) => {
  const confirmarCorteSemanal = () => {
    MySwal.fire({
      title: "Crear Corte Semanal",
      html: `
        <label>Fecha de Inicio:</label>
        <input type="date" id="fecha_inicio" class="swal2-input" required>
        <label>Fecha de Fin:</label>
        <input type="date" id="fecha_fin" class="swal2-input" required>
        <label>Comisión de Cobro:</label>
        <input type="number" id="comision_cobro" class="swal2-input" required>
        <label>Comisión de Ventas:</label>
        <input type="number" id="comision_ventas" class="swal2-input" required>
        <label>Gastos:</label>
        <input type="number" id="gastos" class="swal2-input" required>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear Corte",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const fecha_inicio = document.getElementById("fecha_inicio").value;
        const fecha_fin = document.getElementById("fecha_fin").value;
        const comision_cobro = document.getElementById("comision_cobro").value;
        const comision_ventas =
          document.getElementById("comision_ventas").value;
        const gastos = document.getElementById("gastos").value;

        if (
          !fecha_inicio ||
          !fecha_fin ||
          !comision_cobro ||
          !comision_ventas ||
          !gastos
        ) {
          Swal.showValidationMessage("Todos los campos son obligatorios.");
          return false;
        }

        return {
          fecha_inicio,
          fecha_fin,
          comision_cobro,
          comision_ventas,
          gastos,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleCorteSemanal(result.value);
      }
    });
  };

  const handleCorteSemanal = async (data) => {
    try {
      await api.post("/cortes/semanal", {
        collector_id: usuarioId,
        ...data,
      });

      Swal.fire({
        title: "Éxito",
        text: "Corte semanal realizado exitosamente.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error al realizar el corte semanal:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo realizar el corte semanal.",
        icon: "error",
      });
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={confirmarCorteSemanal}>
      <Text style={styles.buttonText}>Corte Semanal</Text>
    </TouchableOpacity>
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
});

export default CorteSemanal;
