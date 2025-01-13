import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import api from "../../api/axios";
import { TextInput } from "react-native-web";

const EditarCliente = ({ route, navigation }) => {
  const {
    clienteId,
    contrato,
    cobrador,
    actualizarDetalles,
    nombreDeudor,
    montoTotal,
    balance,
  } = route.params; // Recibimos clienteId y contrato
  const [currentCollectorName, setCurrentCollectorName] = useState(""); // Nombre del cobrador actual
  const [newCollectorId, setNewCollectorId] = useState(null); // Nuevo cobrador seleccionado
  const [openDropdown, setOpenDropdown] = useState(false); // Control del dropdown
  const [collectors, setCollectors] = useState([]); // Lista de cobradores
  const [loading, setLoading] = useState(true); // Estado de carga
  const [newRenovationAmount, setNewRenovationAmount] = useState("");
  const [newRenovationPaymentAmount, setNewRenovationPaymentAmount] =
    useState("");
  const [newRenovationFirstPaymentAmount, setNewRenovationFirstPaymentAmount] =
    useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [collectorResponse, collectorsResponse] = await Promise.all([
          api.get(`/cobradores/${cobrador}`),
          api.get("/cobradores"),
        ]);
        setCurrentCollectorName(collectorResponse.data.name);
        setCollectors(
          collectorsResponse.data.map((collector) => ({
            label: collector.name,
            value: collector.id,
          }))
        );
      } catch (error) {
        alert("Error al cargar datos. Por favor, inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cobrador]);

  // Función para cambiar el cobrador
  const cambiarCobrador = async () => {
    if (!newCollectorId) {
      alert("Por favor selecciona un cobrador.");
      return;
    }

    try {
      const response = await api.put("/deudores/cambiar-cobrador", {
        contractNumber: contrato,
        newCollectorId,
      });
      console.log("Cobrador cambiado:", response.data);
      actualizarDetalles(); // Recargar detalles después de la acción
      alert("Cobrador cambiado con éxito");
      navigation.goBack(); // Regresar a la pantalla anterior
    } catch (error) {
      console.error("Error al cambiar cobrador:", error);
      alert("Error al cambiar cobrador");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5d1793" />
        <Text>Cargando información...</Text>
      </View>
    );
  }

  const guardarRenovacion = async () => {
    if (
      !newRenovationAmount ||
      !newRenovationPaymentAmount ||
      !newRenovationFirstPaymentAmount
    ) {
      alert("Por favor completa todos los campos de renovación.");
      return;
    }

    if (
      isNaN(newRenovationAmount) ||
      isNaN(newRenovationPaymentAmount) ||
      isNaN(newRenovationFirstPaymentAmount)
    ) {
      alert("Todos los valores deben ser numéricos.");
      return;
    }

    try {
      const response = await api.put("/deudores/renovar-contrato", {
        deudorId: clienteId, // Cambiado a clienteId para corresponder con el backend
        nuevoMonto: parseFloat(newRenovationAmount),
        nuevoTotalAPagar: parseFloat(newRenovationPaymentAmount),
        nuevoPrimerPago: parseFloat(newRenovationFirstPaymentAmount),
      });
      actualizarDetalles(); // Recargar detalles después de la acción
      alert("Datos guardados con éxito");
      navigation.goBack(); // Regresar a la pantalla anterior
      console.log("Datos Guardados con extito", response.data);
    } catch (error) {
      console.error("Error al guardar datos:", error);
      alert("Error al guardar datos");
    }
  };

  return (
    <View style={styles.container}>
      {/* Cambiar de agente */}
      <View style={styles.cambiarAgente}>
        <Text style={styles.title}>Cambiar el agente de {nombreDeudor}</Text>
        <Text style={styles.info}>
          El agente actual de {nombreDeudor} es:{" "}
          <Text style={styles.bold}>{currentCollectorName}</Text>
        </Text>

        <DropDownPicker
          open={openDropdown}
          value={newCollectorId}
          items={collectors}
          setOpen={setOpenDropdown}
          setValue={setNewCollectorId}
          setItems={setCollectors}
          placeholder="Selecciona un nuevo agente"
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer2}
          dropDownContainerStyle={styles.dropdownContent}
        />

        <Button
          title="Cambiar agente"
          onPress={cambiarCobrador}
          color="#5d1793"
        />

        {/* renovaciones de contrato */}

        <Text style={styles.title}>
          Renovaciones de contrato del cliente{" "}
          <Text style={styles.bold}>{nombreDeudor}</Text>
        </Text>
        <Text style={styles.info}>
          El total a pagar del cliente <Text>{nombreDeudor}</Text> es de{" "}
          {montoTotal}
        </Text>
        <Text style={styles.info}>El balance es {balance}</Text>
        <Text style={styles.info}>El id es {clienteId}</Text>

        {/* textInput para el nuevo monto */}
        <TextInput
          style={styles.textInput}
          placeholder="Nuevo monto de la renovación"
          value={newRenovationAmount}
          onChangeText={setNewRenovationAmount}
        />
        {/* textInput para el nuevo monto a pagar */}
        <TextInput
          style={styles.textInput}
          placeholder="Nuevo Total a pagar de la renovación"
          value={newRenovationPaymentAmount}
          onChangeText={setNewRenovationPaymentAmount}
        />
        {/* textInput para el nuevo primer pago */}
        <TextInput
          style={styles.textInput}
          placeholder="Nuevo primer pago de la renovación"
          value={newRenovationFirstPaymentAmount}
          onChangeText={setNewRenovationFirstPaymentAmount}
        />
        {/* Boton para guardar la renovacion */}
        <Button
          title="Guardar renovación"
          onPress={guardarRenovacion}
          color="#5d1793"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 15,
    color: "#5d1793",
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  dropdownContent: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#5d1793",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f2f2f2",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditarCliente;
