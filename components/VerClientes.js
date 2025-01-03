import { useFocusEffect } from "@react-navigation/native";
import axios from "../api/axios";
import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import InputWithIcon from "./inputWithIcon";
import { ClientesIcono } from "./iconos";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

const VerClientesScreen = ({ navigation }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchClientes = async () => {
        setLoading(true);
        try {
          const response = await axios.get("/deudores");
          setClientes(response.data);
          setFilteredUsuarios(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchClientes();
    }, [])
  );

  // Manejar la búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredUsuarios(clientes);
    } else {
      const filtered = clientes.filter(
        (cliente) =>
          cliente.name.toLowerCase().includes(text.toLowerCase()) ||
          String(cliente.contract_number)
            .toLowerCase()
            .includes(text.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    }
  };

  const renderclientes = ({ item }) => (
    <View style={styles.containerList}>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("DetallesClientes", { clienteId: item.id })
        }
      >
        <ClientesIcono size={25} color="#000000" />
        <Text style={styles.buttonText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando detalles del deudor...</Text>
      </View>
    );
  }

  if (clientes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No hay clientes.</Text>
      </View>
    );
  }

  return (

          <View style={styles.container2}>
            <InputWithIcon
              value={searchText}
              onChangeText={handleSearch}
              placeholder="Buscar usuario..."
            />
            <Text style={styles.text}>Clientes totales: {clientes.length}</Text>
            <FlatList
              data={filteredUsuarios}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderclientes}
              contentContainerStyle={styles.listContent}
            />
          </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    fontSize: 18,
    color: "#000",
  },
  error: {
    fontSize: 18,
    color: "#000",
  },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  containerList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    marginLeft: 20,
    fontSize: 18,
    color: "#333",
  },
  listContent: {
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  text: {
    padding: 5,
    textAlign: "end",
    marginRight: 45,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 500,
  },
});

export default VerClientesScreen;
