import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "../../api/axios";
import { useNavigation } from "@react-navigation/native";
import { DiaIcono, SemanaIcono } from "../../components/global/iconos";
import { formatearMonto } from "../../components/global/dinero";
import BusquedaYFiltros from "../../components/global/BusquedaYFiltros"; // Importamos el nuevo componente

const DeudoresScreen = ({ route }) => {
  const { usuario } = route.params;
  const [deudores, setDeudores] = useState([]);
  const [filteredDeudores, setFilteredDeudores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDeudores = async () => {
      try {
        const response = await axios.get(`/deudores/cobrador/${usuario.id}`);
        setDeudores(response.data);
        setFilteredDeudores(response.data);
      } catch (error) {
        console.error("Error al cargar los deudores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeudores();
  }, [usuario.id]);

  // Manejo de búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      applyFilter(selectedFilter, deudores);
    } else {
      const filtered = filteredDeudores.filter(
        (deudor) =>
          deudor.name.toLowerCase().includes(text.toLowerCase()) ||
          String(deudor.contract_number)
            .toLowerCase()
            .includes(text.toLowerCase())
      );
      setFilteredDeudores(filtered);
    }
  };

  // Aplicar filtros
  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    if (filter === "diario") {
      setFilteredDeudores(deudores.filter((d) => d.payment_type === "diario"));
    } else if (filter === "semanal") {
      setFilteredDeudores(deudores.filter((d) => d.payment_type === "semanal"));
    } else if (filter === "liquidados") {
      setFilteredDeudores(deudores.filter((d) => Number(d.balance) === 0));
    } else {
      setFilteredDeudores(deudores);
    }
  };

  const renderDeudor = ({ item }) => (
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
});

export default DeudoresScreen;
