// DetallesUsuarios.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserModal from "../components/screens/userModal";
import Swal from "sweetalert2";
import api from "../api/axios";

const DetallesUsuariosScreen = ({ route }) => {
  const { usuario } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState(false);

  const abrirModal = () => {
    setModalVisible(true);
  };
  const cerrarModal = () => {
    setModalVisible(false);
  };

  const handleDelete = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/cobradores/${usuario.id}`);
          Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
        } catch (error) {
          console.error(
            "Error al eliminar usuario:",
            error.response?.data || error.message
          );
          Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        }
      }
    });
  };

  const handleNavigateToCortes = () => {
    navigation.navigate("Cortes", { usuario });
  };

  const handleNavigateToCortesAgente = () => {
    navigation.navigate("CortesAgente", { usuario });
  };

  const handleNavigateToDeudores = () => {
    navigation.navigate("Deudores", { usuario });
  };

  const handleNavigateToHistorial = () => {
    navigation.navigate("HistorialCortes", { usuario });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opciones de {usuario.name}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={handleNavigateToCortes}
        >
          <Text style={styles.buttonText}>Realizar Cortes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={handleNavigateToCortesAgente}
        >
          <Text style={styles.buttonText}>Cortes Agente</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateToDeudores}
      >
        <Text style={styles.buttonText}>Ver Deudores</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleNavigateToHistorial}
      >
        <Text style={styles.buttonText}>Historial de Cortes</Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.smallButton} onPress={abrirModal}>
          <Text style={styles.buttonText}>Editar Agente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
      <UserModal
        visible={modalVisible}
        onClose={cerrarModal}
        usuario={usuario}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f1f1",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#002474d4",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  smallButton: {
    backgroundColor: "#002474d4",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 5,
    alignItems: "center",
    flex: 1,
  },
});

export default DetallesUsuariosScreen;
