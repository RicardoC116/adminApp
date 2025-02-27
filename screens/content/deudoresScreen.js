import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "../../api/axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { DiaIcono, SemanaIcono } from "../../components/global/iconos";
import { formatearMonto } from "../../components/global/dinero";
import BusquedaYFiltros from "../../components/global/BusquedaYFiltros";
import { DateTime } from "luxon";

const DeudoresScreen = ({ route }) => {
  const { usuario } = route.params;
  const [deudores, setDeudores] = useState([]);
  const [filteredDeudores, setFilteredDeudores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const navigation = useNavigation();
  const [clientesQuePagaronHoy, setClientesQuePagaronHoy] = useState(new Set());

  const fetchDeudores = async () => {
    try {
      const response = await axios.get(`/deudores/cobrador/${usuario.id}`);
      setDeudores(response.data);
      setFilteredDeudores(response.data);

      await obtenerPagosDelDia();
    } catch (error) {
      console.error("Error al cargar los deudores:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDeudores();
    }, [usuario.id])
  );

  // Manejo de búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      applyFilter(selectedFilter);
    } else {
      const filtered = deudores.filter(
        (deudor) =>
          deudor.name.toLowerCase().includes(text.toLowerCase()) ||
          String(deudor.contract_number)
            .toLowerCase()
            .includes(text.toLowerCase())
      );
      setFilteredDeudores(filtered);
    }
  };

  const obtenerPagosDelDia = async () => {
    try {
      const hoy = DateTime.now().setZone("America/Mexico_City").toISODate();

      const response = await axios.get(`/cobros/dia?fecha=${hoy}`);

      const pagosHoy = response.data.cobros;

      const clientesUnicos = new Set(pagosHoy.map((pago) => pago.debtor_id));
      setClientesQuePagaronHoy(clientesUnicos);
    } catch (error) {
      console.error("Error al obtener pagos del dia", error);
    }
  };

  // Aplicar filtros
  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    let filtered = deudores;

    if (filter === "diario") {
      filtered = deudores.filter((d) => d.payment_type === "diario");
    } else if (filter === "semanal") {
      filtered = deudores.filter((d) => d.payment_type === "semanal");
    } else if (filter === "liquidados") {
      filtered = deudores.filter((d) => Number(d.balance) === 0);
    }

    // Aplica la búsqueda al conjunto filtrado
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (deudor) =>
          deudor.name.toLowerCase().includes(searchText.toLowerCase()) ||
          String(deudor.contract_number)
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    setFilteredDeudores(filtered);
  };

  const deudoresActivos = deudores.filter((d) => Number(d.balance) > 0);

  const renderDeudor = ({ item }) => (
    <View
      style={[
        styles.containerList,
        Number(item.balance) === 0 && styles.liquidadoBackground, //Liquidaciones
        clientesQuePagaronHoy.has(item.id) && styles.pagadoHoyBackground, //Pagos de hoy
      ]}
    >
      <TouchableOpacity
        style={styles.deudorItem}
        onPress={() => navigation.navigate("DetallesDeudor", { deudor: item })}
      >
        <View style={styles.iconContainer}>
          {item.payment_type === "semanal" ? (
            <SemanaIcono size={25} color={"#000000"} />
          ) : (
            <DiaIcono size={25} color={"#000000"} />
          )}
        </View>
        <View style={styles.deudorInfo}>
          <Text style={styles.deudorName}>{item.name}</Text>
          <Text style={styles.deudorMonto}>
            Total a pagar: {formatearMonto(item.total_to_pay)}
          </Text>
          <Text style={styles.deudorMonto}>
            Balance: {formatearMonto(item.balance)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes de {usuario.name}</Text>

      {/* Barra de búsqueda y filtros */}
      <BusquedaYFiltros
        searchText={searchText}
        onSearch={handleSearch}
        selectedFilter={selectedFilter}
        onFilter={applyFilter}
      />

      <Text style={styles.text}>
        Clients Activos Totales: {deudoresActivos.length}
      </Text>

      {loading ? (
        <Text style={styles.loading}>Cargando deudores...</Text>
      ) : filteredDeudores.length === 0 ? (
        <Text style={styles.noDeudores}>No hay clientes asociados.</Text>
      ) : (
        <FlatList
          data={filteredDeudores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeudor}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    fontSize: 16,
  },
  deudorItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 15, // Espacio entre el icono y el texto
  },
  deudorInfo: {
    flex: 1, // Hace que el texto ocupe el espacio restante
  },
  deudorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  deudorMonto: {
    fontSize: 16,
    color: "#333",
  },
  noDeudores: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  containerList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  liquidadoBackground: {
    backgroundColor: "#d4edda",
  },
  pagadoHoyBackground: {
    backgroundColor: "#ffeb3b",
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
});

export default DeudoresScreen;
