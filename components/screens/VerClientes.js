import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../api/axios";
import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import InputWithIcon from "../global/inputWithIcon";
import { ClientesIcono, DiaIcono, SemanaIcono } from "../global/iconos";
import { DateTime } from "luxon";

const VerClientesScreen = ({ navigation }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [clientesQuePagaronHoy, setClientesQuePagaronHoy] = useState(new Set());

  useFocusEffect(
    useCallback(() => {
      const fetchClientes = async () => {
        setLoading(true);
        try {
          const response = await axios.get("/deudores");
          const clientesInvertidos = response.data.reverse();
          setClientes(clientesInvertidos);
          setFilteredUsuarios(clientesInvertidos);

          await obtenerPagosDelDia();
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchClientes();
    }, [])
  );

  const obtenerPagosDelDia = async () => {
    try {
      // const hoy = new Date().toISOString().split("T")[0];
      const hoy = DateTime.now().setZone("America/Mexico_City").toISODate();

      // Verificar si hay datos en AsyncStorage
      const pagosGuardados = await AsyncStorage.getItem("pagosHoy");
      if (pagosGuardados) {
        const { fecha, pagos } = JSON.parse(pagosGuardados);
        if (fecha === hoy) {
          setClientesQuePagaronHoy(new Set(pagos));
          return;
        }
      }

      // Si no hay datos guardados o la fecha es diferente, obtener desde la API
      const response = await axios.get(`/cobros/dia?fecha=${hoy}`);
      const pagosHoy = response.data.cobros.map((pago) => pago.debtor_id);

      // const pagosHoy = response.data.map((pago) => pago.debtor_id);

      // Guardar en AsyncStorage
      await AsyncStorage.setItem(
        "pagosHoy",
        JSON.stringify({ fecha: hoy, pagos: pagosHoy })
      );

      setClientesQuePagaronHoy(new Set(pagosHoy));
    } catch (error) {
      console.error("Error al obtener pagos del día", error);
    }
  };

  // Manejar la búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      applyFilter(selectedFilter, clientes); // Restablece la lista con el filtro seleccionado
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

  // Aplicar filtro por tipo (Diario, Semanal o Liquidados)
  const applyFilter = (filter, clientes) => {
    setSelectedFilter(filter);
    if (filter === "diario") {
      const diarios = clientes.filter(
        (cliente) => cliente.payment_type === "diario"
      );
      setFilteredUsuarios(diarios);
    } else if (filter === "semanal") {
      const semanales = clientes.filter(
        (cliente) => cliente.payment_type === "semanal"
      );
      setFilteredUsuarios(semanales);
    } else if (filter === "liquidados") {
      const liquidados = clientes.filter(
        (cliente) => Number(cliente.balance) === 0
      );
      setFilteredUsuarios(liquidados);
    } else {
      setFilteredUsuarios(clientes); // Mostrar todos si no hay filtro
    }
  };

  const renderclientes = ({ item }) => (
    <View
      style={[
        styles.containerList,
        Number(item.balance) === 0 && styles.liquidadoBackground, //Liquidaciones
        clientesQuePagaronHoy.has(item.id) && styles.pagadoHoyBackground, //Pagos de hoy
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("DetallesClientes", { clienteId: item.id })
        }
      >
        {item.payment_type === "semanal" ? (
          <SemanaIcono size={25} color={"#000000"} />
        ) : (
          <DiaIcono size={25} color={"#000000"} />
        )}
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

  const clientesActivos = clientes.filter(
    (cliente) => Number(cliente.balance) > 0
  );

  return (
    <View style={styles.container2}>
      {clientes.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            Aún no hay clientes disponibles.
          </Text>
        </View>
      ) : (
        <>
          <InputWithIcon
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Buscar usuario..."
          />
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={
                selectedFilter === null
                  ? styles.selectedFilterButton
                  : styles.filterButton
              }
              onPress={() => applyFilter(null, clientes)}
            >
              <Text
                style={
                  selectedFilter === null
                    ? styles.selectedFilterText
                    : styles.filterText
                }
              >
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedFilter === "diario"
                  ? styles.selectedFilterButton
                  : styles.filterButton
              }
              onPress={() => applyFilter("diario", clientes)}
            >
              <Text
                style={
                  selectedFilter === "diario"
                    ? styles.selectedFilterText
                    : styles.filterText
                }
              >
                Semanal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedFilter === "semanal"
                  ? styles.selectedFilterButton
                  : styles.filterButton
              }
              onPress={() => applyFilter("semanal", clientes)}
            >
              <Text
                style={
                  selectedFilter === "semanal"
                    ? styles.selectedFilterText
                    : styles.filterText
                }
              >
                Mensual
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedFilter === "liquidados"
                  ? styles.selectedFilterButton
                  : styles.filterButton
              }
              onPress={() => applyFilter("liquidados", clientes)}
            >
              <Text
                style={
                  selectedFilter === "liquidados"
                    ? styles.selectedFilterText
                    : styles.filterText
                }
              >
                Liquidados
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.text}>
            Clientes activos totales: {clientesActivos.length}
          </Text>
          <FlatList
            data={filteredUsuarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderclientes}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
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
    padding: 10,
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "italic",
    color: "#999",
    textAlign: "center",
  },
  text: {
    padding: 5,
    textAlign: "end",
    marginRight: 45,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 15,
  },
  filterButton: {
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    paddingVertical: 5,
  },
  selectedFilterButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingVertical: 5,
  },
  filterText: {
    fontSize: 16,
    color: "#777",
  },
  selectedFilterText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  liquidadoBackground: {
    backgroundColor: "#d4edda",
  },
  pagadoHoyBackground: {
    backgroundColor: "#ffeb3b",
  },
});

export default VerClientesScreen;
