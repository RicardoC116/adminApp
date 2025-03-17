import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import api from "../../api/axios";
import { TouchableOpacity } from "react-native";

const AgregarDeudor = () => {
  const [name, setName] = useState("");
  const [contract_number, setContractNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [total_to_pay, setTotalToPay] = useState("");
  const [balance, setBalance] = useState("");
  const [first_payment, setFirstPayment] = useState("");
  const [numeroTelefono, setNumeroTelefono] = useState("");
  const [montoSugerido, setMontoSugerido] = useState("");
  const [tipo, setTipo] = useState(null);
  const [openTipo, setOpenTipo] = useState(false);
  const [itemsTipo, setItemsTipo] = useState([
    { label: "Diario", value: "diario" },
    { label: "Semanal", value: "semanal" },
  ]);
  const [aval, setAval] = useState("");
  const [avalTelefono, setAvalTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [direccionAval, setDireccionAval] = useState("");

  // Estados para cobradores
  const [openCobrador, setOpenCobrador] = useState(false);
  const [cobrador, setCobrador] = useState(null);
  const [itemsCobrador, setItemsCobrador] = useState([]);

  // Cargar cobradores desde la API
  useEffect(() => {
    const fetchCobradores = async () => {
      try {
        const response = await api.get("/cobradores");
        const cobradores = response.data.map((c) => ({
          label: c.name,
          value: c.phone_number,
        }));
        setItemsCobrador(cobradores);
      } catch (error) {
        console.error("Error al cargar cobradores:", error);
      }
    };

    fetchCobradores();
  }, []);

  const handleAddClient = () => {
    if (
      !name ||
      !contract_number ||
      !amount ||
      !total_to_pay ||
      // !balance ||
      !cobrador ||
      !tipo
    ) {
      return Alert.alert(
        "Campos incompletos",
        "Todos los campos son obligatorios.",
        [{ text: "Entendido" }]
      );
    }

    if (!/^\d{10}$/.test(numeroTelefono) && numeroTelefono !== "") {
      return Alert.alert(
        "Número inválido",
        "El número de teléfono debe tener 10 dígitos.",
        [{ text: "OK" }]
      );
    }

    const newClient = {
      contract_number,
      name,
      amount: parseFloat(amount) || 0,
      total_to_pay: parseFloat(total_to_pay) || 0,
      first_payment: parseFloat(first_payment) || 0,
      // balance: parseFloat(balance) || 0,
      numero_telefono: numeroTelefono || null,
      suggested_payment: parseFloat(montoSugerido) || 0,
      phone_number: cobrador,
      payment_type: tipo,
      aval,
      aval_phone: avalTelefono,
      direccion: direccion,
      aval_direccion: direccionAval,
    };

    api
      .post("/deudores", newClient)
      .then(() => {
        Alert.alert(
          "Éxito",
          `El cliente "${name}" fue agregado exitosamente.`,
          [{ text: "OK" }]
        );
        setName("");
        setContractNumber("");
        setAmount("");
        setTotalToPay("");
        setFirstPayment("");
        // setBalance("");
        setNumeroTelefono("");
        setMontoSugerido("");
        setAval("");
        setAvalTelefono("");
        setDireccion("");
        setDireccionAval("");
        setTipo(null);
        setCobrador(null);
      })
      .catch((error) => {
        console.error("Error al agregar deudor:", error);
        Alert.alert(
          "Error",
          "No se pudo agregar el cliente. Intenta nuevamente.",
          [{ text: "OK" }]
        );
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Número de Contrato */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Número de Contrato</Text>
        <TextInput
          value={contract_number}
          onChangeText={setContractNumber}
          style={styles.input}
          keyboardType="numeric"
          // placeholder="Ej. 123456"
        />
      </View>
      {/* Nombre del Cliente */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Nombre del Cliente</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          // placeholder="Ej. Juan Pérez"
        />
      </View>

      {/* Dirección */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Dirección</Text>
        <TextInput
          value={direccion}
          onChangeText={setDireccion}
          style={styles.input}
          // placeholder="Ej. Calle 123"
        />
      </View>

      {/* Monto Otorgado */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Monto Otorgado</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          // placeholder="Ej. 1000"
        />
      </View>

      {/* Total a Pagar */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Total a Pagar</Text>
        <TextInput
          value={total_to_pay}
          onChangeText={setTotalToPay}
          keyboardType="numeric"
          style={styles.input}
          // placeholder="Ej. 1200"
        />
      </View>

      {/* Balance */}
      {/* <View style={styles.inputContainer}>
        <Text style={styles.label}>° Balance</Text>
        <TextInput
          value={balance}
          onChangeText={setBalance}
          keyboardType="numeric"
          style={styles.input}
          // placeholder="Ej. 200"
        />
      </View> */}

      {/* Primer Pago */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Primer Pago</Text>
        <TextInput
          value={first_payment}
          onChangeText={setFirstPayment}
          keyboardType="numeric"
          style={styles.input}
          // placeholder="Ej. 100"
        />
      </View>

      {/* Número de Teléfono */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Número de Teléfono</Text>
        <TextInput
          value={numeroTelefono}
          onChangeText={setNumeroTelefono}
          keyboardType="numeric"
          style={styles.input}
          // placeholder="Ej. 5551234567"
        />
      </View>

      {/* Pago Sugerido */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Pago Sugerido</Text>
        <TextInput
          value={montoSugerido}
          onChangeText={setMontoSugerido}
          keyboardType="numeric"
          style={styles.input}
          // placeholder="Ej. 300"
        />
      </View>

      {/* Aval */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Nombre del Aval</Text>
        <TextInput
          value={aval}
          onChangeText={setAval}
          style={styles.input}
          // placeholder="Ej. María López"
        />
      </View>

      {/* Teléfono del Aval */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Teléfono del Aval</Text>
        <TextInput
          value={avalTelefono}
          onChangeText={setAvalTelefono}
          style={styles.input}
          // placeholder="Ej. 5559876543"
        />
      </View>

      {/* Direccion del aval */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>° Dirección del Aval</Text>
        <TextInput
          value={direccionAval}
          onChangeText={setDireccionAval}
          style={styles.input}
          // placeholder="Ej. Calle 123"
        />
      </View>

      <DropDownPicker
        open={openTipo}
        value={tipo}
        items={itemsTipo}
        setOpen={setOpenTipo}
        setValue={setTipo}
        setItems={setItemsTipo}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        placeholder="Selecciona el tipo de pago"
        modalProps={{ animationType: "fade" }}
        listMode="SCROLLVIEW"
        labelStyle={{
          color: "#333",
        }}
        itemStyle={{
          justifyContent: "flex-start",
          paddingVertical: 10,
        }}
        selectedItemContainerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          backgroundColor: "#E6E6FA",
        }}
        selectedItemLabelStyle={{
          fontWeight: "bold",
          color: "#5d1793",
        }}
        itemSeparatorStyle={{
          height: 1,
          backgroundColor: "#ccc",
          marginVertical: 5,
        }}
      />

      <DropDownPicker
        open={openCobrador}
        value={cobrador}
        items={itemsCobrador}
        setOpen={setOpenCobrador}
        setValue={setCobrador}
        setItems={setItemsCobrador}
        containerStyle={{ marginBottom: 20 }}
        style={styles.dropdown}
        placeholder="Selecciona un agente"
        modalProps={{ animationType: "fade" }}
        listMode="MODAL"
        labelStyle={{
          // fontSize: 16,
          // fontWeight: "bold",
          color: "#333", // Color oscuro para mejor lectura
        }}
        itemStyle={{
          justifyContent: "flex-start",
          fontSize: 50,
          paddingVertical: 10, // Espaciado vertical para mejor separación
        }}
        selectedItemContainerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: "#ccc", // Línea separadora sutil
          backgroundColor: "#E6E6FA", // Un color suave cuando se selecciona un agente
        }}
        selectedItemLabelStyle={{
          fontWeight: "bold",
          color: "#5d1793", // Mismo color que el botón "Agregar Cliente"
        }}
        itemSeparatorStyle={{
          height: 1,
          backgroundColor: "#ccc", // Línea separadora sutil entre elementos
          marginVertical: 5,
        }}
      />

      {/* Botón Personalizado */}
      <TouchableOpacity style={styles.button} onPress={handleAddClient}>
        <Text style={styles.buttonText}>Agregar Cliente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#010101",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
    zIndex: 9999,
  },
  dropdownContainer2: {
    marginBottom: 20,
    zIndex: 2,
  },
  dropdown: {
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#5d1793",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AgregarDeudor;
