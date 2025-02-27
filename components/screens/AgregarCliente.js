import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import api from "../../api/axios";

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
    { label: "Semanal", value: "diario" },
    { label: "Mensual", value: "semanal" },
  ]);

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
      !balance ||
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
      balance: parseFloat(balance) || 0,
      numero_telefono: numeroTelefono || null,
      suggested_payment: parseFloat(montoSugerido) || 0,
      phone_number: cobrador,
      payment_type: tipo,
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
        setBalance("");
        setNumeroTelefono("");
        setMontoSugerido("");
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
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del cliente"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Número de Contrato"
        value={contract_number}
        onChangeText={setContractNumber}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Monto Otorgado"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Total a Pagar"
        value={total_to_pay}
        onChangeText={setTotalToPay}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Balance"
        value={balance}
        onChangeText={setBalance}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Primer Pago"
        value={first_payment}
        onChangeText={setFirstPayment}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Número de Teléfono"
        value={numeroTelefono}
        onChangeText={setNumeroTelefono}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Pago Sugerido"
        value={montoSugerido}
        onChangeText={setMontoSugerido}
        keyboardType="numeric"
        style={styles.input}
      />

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

      <Button
        title="Agregar Cliente"
        onPress={handleAddClient}
        color="#5d1793"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
});

export default AgregarDeudor;
