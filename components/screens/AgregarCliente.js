// AgregarCliebte.js

import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import api from "../../api/axios";

const AgregarDeudor = () => {
  const [name, setName] = useState("");
  const [contract_number, setContract_number] = useState("");
  const [amount, setAmount] = useState("");
  const [total_to_pay, setTotalToPay] = useState("");
  const [balance, setBalance] = useState("");
  const [first_payment, setFirstPayment] = useState("");
  const [tipo, setTipo] = useState(null);
  const [openTipo, setOpenTipo] = useState(false);
  const [itemsTipo, setItemsTipo] = useState([
    { label: "Diario", value: "diario" },
    { label: "Semanal", value: "semanal" },
  ]);

  // Estados para los cobradores
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
    if (name && amount && cobrador) {
      const newClient = {
        contract_number,
        name,
        amount: parseFloat(amount),
        total_to_pay: parseFloat(total_to_pay),
        first_payment: parseFloat(first_payment),
        balance: parseFloat(balance),
        phone_number: cobrador,
        payment_type: tipo,
      };

      api
        .post("/deudores", newClient)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error al agregar deudor:", error);
        });

      setName("");
      setContract_number("");
      setAmount("");
      setTotalToPay("");
      setFirstPayment("");
      setBalance("");
      setTipo("");
      setCobrador(null);
    } else {
      alert("Por favor, completa todos los campos.");
    }
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
        onChangeText={setContract_number}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Monto"
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

      {/* DropDownPicker para el tipo de pago */}
      <DropDownPicker
        open={openTipo}
        value={tipo}
        items={itemsTipo}
        setOpen={setOpenTipo}
        setValue={setTipo}
        setItems={setItemsTipo}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContent}
        labelStyle={styles.dropdownLabel}
        listItemLabelStyle={styles.dropdownItemLabel}
        arrowIconStyle={styles.dropdownArrow}
        placeholder="Selecciona el tipo de pago"
      />

      {/* DropDownPicker para seleccionar cobradores */}
      <DropDownPicker
        open={openCobrador}
        value={cobrador}
        items={itemsCobrador}
        setOpen={setOpenCobrador}
        setValue={setCobrador}
        setItems={setItemsCobrador}
        containerStyle={styles.dropdownContainer2}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContent}
        labelStyle={styles.dropdownLabel}
        listItemLabelStyle={styles.dropdownItemLabel}
        arrowIconStyle={styles.dropdownArrow}
        placeholder="Selecciona a un agentes"
      />

      <Button
        title="Agregar al cliente"
        onPress={handleAddClient}
        color={"#5d1793"}
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
    borderColor: "#ccc",
    zIndex: 3,
  },
  dropdownContainer2: {
    marginBottom: 20,
    borderColor: "#ccc",
    zIndex: 2,
  },
  dropdown: {
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
  },
  dropdownContent: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  dropdownLabel: {
    color: "#000",
    fontSize: 16,
  },
  dropdownItemLabel: {
    color: "#000",
  },
  dropdownArrow: {
    tintColor: "#8967B3",
  },
});

export default AgregarDeudor;
