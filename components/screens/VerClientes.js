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
  const [clientesQuePagaronSemana, setClientesQuePagaronSemana] = useState(
    new Set()
  );

  useFocusEffect(
    useCallback(() => {
      const fetchClientes = async () => {
        setLoading(true);
        try {
          const response = await axios.get("/deudores");
          const clientesInvertidos = response.data.reverse();
          setClientes(clientesInvertidos);
          setFilteredUsuarios(clientesInvertidos);

          await obtenerPagosDelPeriodo();
          // await obtenerPagosDelDia();
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchClientes();
    }, [])
  );

  // Chilac
  const obtenerPagosDelPeriodo = async () => {
    try {
      const collector_id = await AsyncStorage.getItem("collector_id");
      const hoy = DateTime.now().setZone("America/Mexico_City").toISODate();

      // obtenemos los pagos del dia (Clientes Diarios)
      const responseDia = await axios.get(`/cobros/dia?fecha=${hoy}`);
      const pagosHoy = responseDia.data.cobros;
      const clientesUnicosDia = new Set(pagosHoy.map((pago) => pago.debtor_id));
      setClientesQuePagaronHoy(clientesUnicosDia);

      // obtenemos los pagos de la semana (Clientes Semanales)
      const responseSemana = await axios.get(
        `/cobros/lunesDomingo?fecha=${hoy}`
      );
      const pagosSemana = responseSemana.data.cobros;
      const clientesUnicosSemana = new Set(
        pagosSemana.map((pago) => pago.debtor_id)
      );
      setClientesQuePagaronSemana(clientesUnicosSemana);
    } catch (error) {
      console.error("Error al obtener pagos del periodo", error);
    }
  };

  // San jose
  // const obtenerPagosDelPeriodo = async () => {
  //   try {
  //     const collector_id = await AsyncStorage.getItem("collector_id");

  //     const hoy = DateTime.now().setZone("America/Mexico_City").toISODate();

  //     // obtenemos los pagos del dia
  //     const responseDia = await axios.get(`/cobros/dia?fecha=${hoy}`);
  //     const pagosHoy = responseDia.data.cobros;
  //     const clientesUnicosDia = new Set(pagosHoy.map((pago) => pago.debtor_id));
  //     setClientesQuePagaronHoy(clientesUnicosDia);

  //     // obtenemos los pagos de la semana
  //     const responseSemana = await axios.get(
  //       `/cobros/lunesDomingo?fecha=${hoy}`
  //     );

  //     const pagosSemana = responseSemana.data.cobros;
  //     const clientesUnicosSemana = new Set(
  //       pagosSemana.map((pago) => pago.debtor_id)
  //     );
  //     setClientesQuePagaronSemana(clientesUnicosSemana);
  //   } catch (error) {
  //     console.error("Error al obtener pagos del periodo", error);
  //   }
  // };

  // Virsac
  // const obtenerPagosDelPeriodo = async () => {
  //   try {
  //     const collector_id = await AsyncStorage.getItem("collector_id");
  //     const hoy = DateTime.now().setZone("America/Mexico_City").toISODate();

  //     // obtenemos los pagos del dia (Clientes Diarios)
  //     const responseDia = await axios.get(`/cobros/dia?fecha=${hoy}`);
  //     const pagosHoy = responseDia.data.cobros;
  //     const clientesUnicosDia = new Set(pagosHoy.map((pago) => pago.debtor_id));
  //     setClientesQuePagaronHoy(clientesUnicosDia);

  //     // obtenemos los pagos de la semana (Clientes Semanales)
  //     const responseSemana = await axios.get(
  //       `/cobros/juevesMiercoles?fecha=${hoy}`
  //     );
  //     const pagosSemana = responseSemana.data.cobros;
  //     const clientesUnicosSemana = new Set(
  //       pagosSemana.map((pago) => pago.debtor_id)
  //     );
  //     setClientesQuePagaronSemana(clientesUnicosSemana);
  //   } catch (error) {
  //     console.error("Error al obtener pagos del periodo", error);
  //   }
  // };

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

  const renderclientes = ({ item }) => {
    const esDiario = item.payment_type === "diario";
    const esSemanal = item.payment_type === "semanal";
    const pagosHoy = clientesQuePagaronHoy.has(item.id);
    const pagosSemana = clientesQuePagaronSemana.has(item.id);

    return (
      <View
        style={[
          styles.containerList,
          Number(item.balance) === 0 && styles.liquidadoBackground, //Liquidaciones
          // Virsac y san jose
          // clientesQuePagaronHoy.has(item.id) && styles.pagadoHoyBackground, //Pagos de hoy
          // clientesQuePagaronSemana.has(item.id) &&
          //   styles.pagadoSemanaBackground, //Pagos de la semana
          // -------------------------
          // Chilac
          // esDiario && pagosHoy && styles.pagadoHoyBackground, // Pagos de hoy
          // esSemanal && pagosSemana && styles.pagadoSemanaBackground, // Pagos de la semana
          pagosSemana && styles.pagadoSemanaBackground, // Pagos de la semana
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("DetallesClientes", { clienteId: item.id })
          }
        >
          {/* San Jose y virsac */}
          {/* {item.payment_type === "semanal" ? (
            <SemanaIcono size={25} color={"#4f709C"} />
          ) : (
            <DiaIcono size={25} color={"#fada7a"} />
          )} */}
          {/* Chilac */}
          {esSemanal ? (
            <SemanaIcono size={25} color={"#4f709C"} />
          ) : (
            <DiaIcono size={25} color={"#fada7a"} />
          )}

          <Text style={styles.buttonText}>{item.name}</Text>
          {/* Chilac */}
          {/* {esSemanal && pagosSemana && (
            <Text style={styles.semanaBadge}>Pagado</Text>
          )}
          {esDiario && pagosHoy && (
            <Text style={styles.semanaBadge}>Pagado Hoy</Text>
          )} */}
          {/* San Jose y Virsac */}
          {clientesQuePagaronSemana.has(item.id) && (
            <Text style={styles.semanaBadge}>Pagado</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando detalles del Cliente...</Text>
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
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  pagadoSemanaBackground: {
    backgroundColor: "#e3f2fd",
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  diaBadge: {
    margin: "auto",
    backgroundColor: "#7f9f80",
    color: "#333",
    padding: 4,
    borderRadius: 4,
    fontSize: 14,
  },
  semanaBadge: {
    margin: "auto",
    backgroundColor: "#2196f3",
    color: "#fff",
    padding: 4,
    borderRadius: 4,
    fontSize: 14,
  },
});

export default VerClientesScreen;
