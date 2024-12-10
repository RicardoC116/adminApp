import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import api from "../api/axios";
import Swal from "sweetalert2";

const CorteDiario = ({ usuarioId, ultimoCorte, onCorteRealizado }) => {
  const confirmarCorteDiario = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas realizar el corte diario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCorteDiario();
      }
    });
  };

  const handleCorteDiario = async () => {
    // Validar si ya se hizo un corte en el día actual
    if (
      ultimoCorte &&
      new Date(ultimoCorte.fecha).toISOString().split("T")[0] ===
        new Date().toISOString().split("T")[0]
    ) {
      Swal.fire({
        title: "Aviso",
        text: "Ya se ha registrado un corte para este día.",
        icon: "warning",
      });
      return;
    }

    try {
      const response = await api.post("/cortes/diario", {
        collector_id: usuarioId,
      });

      Swal.fire({
        title: "Éxito",
        text: "Corte diario realizado exitosamente.",
        icon: "success",
      });

      if (onCorteRealizado) onCorteRealizado();
    } catch (error) {
      console.error("Error al realizar el corte diario:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo realizar el corte diario.",
        icon: "error",
      });
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={confirmarCorteDiario}>
      <Text style={styles.buttonText}>Corte Diario</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
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

export default CorteDiario;
