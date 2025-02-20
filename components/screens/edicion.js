import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../api/axios";
import { capitalizeFirstLetter } from "../global/letras";
import { formatearMonto } from "../global/dinero";

const EditarCliente = ({ route, navigation }) => {
  const {
    clienteId,
    contrato,
    cobrador,
    nombreDeudor,
    tipoDePago,
    pagoInicial,
    montoTotal,
    balanceActual,
  } = route.params;
  const [currentCollectorName, setCurrentCollectorName] = useState("");
  const [currentCollectorNumber, setCurrentCollectorNumber] = useState("");
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState("");
  const [loading, setLoading] = useState(false);

  const [contractNumber, setContractNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [totalToPay, setTotalToPay] = useState("");
  const [firstPayment, setFirstPayment] = useState("");
  const [balance, setBalance] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [nombreCliente, setNombreDeudor] = useState(nombreDeudor || "");
  const [NumeroTelefono, setNumeroDeTelefono] = useState("");
  const [MontoSugerido, setMontoSugerido] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectorsResponse, collectorNameResponse] = await Promise.all([
          api.get("/cobradores"),
          api.get(`/cobradores/${cobrador}`),
        ]);
        setCollectors(collectorsResponse.data);
        setCurrentCollectorName(collectorNameResponse.data.name);
        setCurrentCollectorNumber(collectorNameResponse.data.phone_number);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Alert.alert("Error", "No se pudieron cargar los datos.");
      }
    };
    fetchData();
  }, [cobrador]);

  const handleChangeCollector = async () => {
    if (!selectedCollector) {
      Alert.alert("Advertencia", "Por favor selecciona un cobrador.");
      return;
    }
    if (selectedCollector === cobrador) {
      Alert.alert(
        "Advertencia",
        "El cobrador seleccionado es el mismo que el actual."
      );
      return;
    }
    setLoading(true);
    try {
      const response = await api.put("/deudores/cambiar-cobrador", {
        contractNumber: contrato,
        newCollectorId: selectedCollector,
      });
      Alert.alert("Éxito", response.data.message);
      navigation.goBack();
    } catch (error) {
      console.error("Error al cambiar el cobrador:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Ocurrió un error al cambiar el cobrador."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRenewContract = async () => {
    if (
      !contractNumber ||
      !amount ||
      !totalToPay ||
      !firstPayment ||
      !balance ||
      !paymentType
    ) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/deudores", {
        contract_number: contractNumber,
        name: nombreDeudor,
        amount: parseFloat(amount) || 0,
        total_to_pay: parseFloat(totalToPay) || 0,
        first_payment: parseFloat(firstPayment) || 0,
        balance: parseFloat(balance) || 0,
        numero_telefono: NumeroTelefono || null,
        suggested_payment: parseFloat(MontoSugerido) || 0,
        phone_number: currentCollectorNumber,
        payment_type: paymentType,
      });

      Alert.alert("Éxito", "El contrato se renovó exitosamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al renovar contrato:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Ocurrió un error al renovar el contrato."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async () => {
    setLoading(true);
    try {
      // Crear el payload (como ya lo tienes)
      const payload = {
        contract_number: contractNumber || undefined,
        name: nombreCliente || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        total_to_pay: totalToPay ? parseFloat(totalToPay) : undefined,
        first_payment: firstPayment ? parseFloat(firstPayment) : undefined,
        balance: balance ? parseFloat(balance) : undefined,
        collector_id: selectedCollector || undefined,
        payment_type: paymentType || undefined,
        numero_telefono: NumeroTelefono || undefined,
        suggested_payment: MontoSugerido
          ? parseFloat(MontoSugerido)
          : undefined,
      };

      // Limpiar campos undefined
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      // Hacer la solicitud PUT
      const response = await api.put(`/deudores/${clienteId}`, payload);

      // Si todo sale bien
      Alert.alert("Éxito", "Datos actualizados correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar cliente:", error);

      // Manejar errores específicos del backend
      const errorMessage = error.response?.data?.error || "Error desconocido";

      if (errorMessage.includes("balance no puede superar")) {
        Alert.alert("❌ Error", "⚠️ El balance supera el total a pagar");
      } else if (errorMessage.includes("valores no pueden ser negativos")) {
        Alert.alert("❌ Error", "🚫 Los valores no pueden ser negativos");
      } else {
        Alert.alert("❌ Error", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar a {nombreDeudor}</Text>

      {/* Informacion actual */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Actual</Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Agente Actual:</Text>{" "}
          {currentCollectorName}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Número de Contrato:</Text> {contrato}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Tipo de pago:</Text>{" "}
          {capitalizeFirstLetter(tipoDePago)}
        </Text>
      </View>

      {/* Cambiar agente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cambiar Agente</Text>
        <Picker
          selectedValue={selectedCollector}
          onValueChange={(itemValue) => setSelectedCollector(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona un Agente" value="" />
          {collectors.map((collector) => (
            <Picker.Item
              key={collector.id}
              label={collector.name}
              value={collector.id}
            />
          ))}
        </Picker>

        <TouchableOpacity
          style={[
            styles.button,
            loading ? styles.buttonDisabled : styles.buttonEnabled,
          ]}
          onPress={handleChangeCollector}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cambiar Agente</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Renovar Contrato */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Renovar Contrato</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de Contrato"
          keyboardType="numeric"
          value={contractNumber}
          onChangeText={setContractNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Monto Otorgado"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Total a Pagar"
          keyboardType="numeric"
          value={totalToPay}
          onChangeText={setTotalToPay}
        />
        <TextInput
          style={styles.input}
          placeholder="Balance"
          keyboardType="numeric"
          value={balance}
          onChangeText={setBalance}
        />
        <TextInput
          style={styles.input}
          placeholder="Primer Pago"
          keyboardType="numeric"
          value={firstPayment}
          onChangeText={setFirstPayment}
        />
        <TextInput
          style={styles.input}
          placeholder="Numero de telefono"
          keyboardType="numeric"
          value={NumeroTelefono}
          onChangeText={setNumeroDeTelefono}
        />
        <TextInput
          style={styles.input}
          placeholder="Monto Sugerido"
          keyboardType="numeric"
          value={MontoSugerido}
          onChangeText={setMontoSugerido}
        />

        <Picker
          selectedValue={paymentType}
          onValueChange={(itemValue) => setPaymentType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona el Tipo de Pago" value="" />
          <Picker.Item label="Diario" value="diario" />
          <Picker.Item label="Semanal" value="semanal" />
        </Picker>

        <TouchableOpacity
          style={[
            styles.button,
            loading ? styles.buttonDisabled : styles.buttonEnabled,
          ]}
          onPress={handleRenewContract}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Renovar Contrato</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modificar cliente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modificar Cliente</Text>

        <Text style={styles.text}>
          <Text style={styles.label}>Total a Pagar:</Text>{" "}
          {formatearMonto(montoTotal)}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Primer Pago:</Text>{" "}
          {formatearMonto(pagoInicial)}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Balance:</Text>{" "}
          {formatearMonto(balanceActual)}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Número de Contrato"
          keyboardType="numeric"
          value={contractNumber}
          onChangeText={setContractNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre del Deudor"
          value={nombreCliente}
          onChangeText={(value) => setNombreDeudor(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Monto Otorgado"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Total a Pagar"
          keyboardType="numeric"
          value={totalToPay}
          onChangeText={setTotalToPay}
        />
        <TextInput
          style={styles.input}
          placeholder="Primer Pago"
          keyboardType="numeric"
          value={firstPayment}
          onChangeText={setFirstPayment}
        />
        <TextInput
          style={styles.input}
          placeholder="Balance"
          keyboardType="numeric"
          value={balance}
          onChangeText={setBalance}
        />
        <TextInput
          style={styles.input}
          placeholder="Numero de telefono"
          keyboardType="numeric"
          value={NumeroTelefono}
          onChangeText={setNumeroDeTelefono}
        />
        <TextInput
          style={styles.input}
          placeholder="Monto Sugerido"
          keyboardType="numeric"
          value={MontoSugerido}
          onChangeText={setMontoSugerido}
        />
        <Picker
          selectedValue={paymentType}
          onValueChange={(itemValue) => setPaymentType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona el Tipo de Pago" value="" />
          <Picker.Item label="Diario" value="diario" />
          <Picker.Item label="Semanal" value="semanal" />
        </Picker>

        <TouchableOpacity
          style={[
            styles.button,
            loading ? styles.buttonDisabled : styles.buttonEnabled,
          ]}
          onPress={handleUpdateClient}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Actualizar Cliente</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  text: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  picker: {
    height: 50,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#002474d4",
  },
  buttonDisabled: {
    backgroundColor: "#b0c4de",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
});

export default EditarCliente;
