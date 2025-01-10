import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Swal from "sweetalert2";
import axios from "../api/axios";
import { formatearMonto } from "../components/dinero";

const CONTRASENA_LOCAL = "serpiente79"; // Contraseña preestablecida

const AdminActions = ({ cobroId, amount, actualizarDetalles }) => {
  // Verificar contraseña
  const verificarContraseña = async () => {
    const { value: password } = await Swal.fire({
      title: "Verificación requerida",
      input: "password",
      inputLabel: "Ingresa tu contraseña",
      inputPlaceholder: "Contraseña",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      preConfirm: (password) => {
        if (!password) {
          Swal.showValidationMessage("Debes ingresar una contraseña.");
        }
        return password;
      },
    });

    if (!password) return null;

    // Validación local de la contraseña
    if (password === CONTRASENA_LOCAL) {
      return true;
    } else {
      Swal.fire("Error", "Contraseña incorrecta.", "error");
      return false;
    }
  };

  const eliminarCobro = async () => {
    const autorizado = await verificarContraseña();
    if (!autorizado) return;

    Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará el cobro de manera permanente, el monto actual es ${formatearMonto(
        amount
      )}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/cobros/eliminar/${cobroId}`);
          Swal.fire("Eliminado", response.data.message, "success");
          actualizarDetalles();
        } catch (error) {
          console.error("Error al eliminar el cobro:", error);
          Swal.fire("Error", "No se pudo eliminar el cobro.", "error");
        }
      }
    });
  };

  const modificarCobro = async () => {
    const autorizado = await verificarContraseña();
    if (!autorizado) return;

    Swal.fire({
      title: `Modificar Cobro (Monto actual ${formatearMonto(amount)})`,
      html: `
        <input type="number" id="nuevoMonto" class="swal2-input" placeholder="Nuevo Monto">
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nuevoMonto = document.getElementById("nuevoMonto").value;
        if (!nuevoMonto || nuevoMonto <= 0) {
          Swal.showValidationMessage("El monto debe ser mayor a 0.");
          return;
        }
        return { nuevoMonto };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put("/cobros/modificar", {
            cobro_id: cobroId,
            nuevo_monto: parseFloat(result.value.nuevoMonto),
          });
          Swal.fire("Modificado", response.data.message, "success");
          actualizarDetalles();
        } catch (error) {
          console.error("Error al modificar el cobro:", error);
          Swal.fire("Error", "No se pudo modificar el cobro.", "error");
        }
      }
    });
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
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AdminActions;
