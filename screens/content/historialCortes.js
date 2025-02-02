import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "../../api/axios"; // Ruta hacia tu instancia de axios
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

const HistorialCortesScreen = ({ route }) => {
  const { usuario } = route.params; // Recibimos el cobrador.
  const [cortesDiarios, setCortesDiarios] = useState([]);
  const [cortesSemanales, setCortesSemanales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Definimos la función fetchCortes fuera de useEffect para que pueda ser llamada dentro de useFocusEffect
  const fetchCortes = async () => {
    try {
      const [diariosResponse, semanalesResponse] = await Promise.all([
        axios.get(`/cortes/diario/${usuario.id}`),
        axios.get(`/cortes/semanal/${usuario.id}`),
      ]);

      setCortesDiarios(diariosResponse.data.reverse());
      setCortesSemanales(semanalesResponse.data.reverse());
    } catch (error) {
      console.error("Error al cargar los cortes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCortes(); // Cargar los cortes al montar el componente
  }, [usuario.id]);

  // Usamos useFocusEffect para cargar los cortes cada vez que la pantalla se enfoque
  useFocusEffect(
    React.useCallback(() => {
      fetchCortes(); // Vuelve a cargar los cortes cada vez que se enfoque la pantalla
    }, [usuario.id]) // Dependencia en usuario.id para que se recarguen cuando cambie
  );

  // Navegar a los detalles del corte seleccionado
  const handleCortePress = (corte, tipo) => {
    navigation.navigate("DetallesCorte", { corte, tipo });
  };

  // Modifica las funciones de renderizado para pasar el tipo correcto
  const renderCorteDiarioItem = (corte) => (
    <TouchableOpacity
      key={corte.id}
      style={styles.corteItem}
      onPress={() => handleCortePress(corte, "diario")}
    >
      <Text style={styles.corteFecha}>Fecha: {corte.fecha}</Text>
      <Text style={styles.corteMonto}>Monto: ${corte.cobranza_total}</Text>
    </TouchableOpacity>
  );

  const renderCorteSemanalesItem = (corte) => (
    <TouchableOpacity
      key={corte.id}
      style={styles.corteItem}
      onPress={() => handleCortePress(corte, "semanal")}
    >
      <View style={styles.container2}>
        <View>
          <Text style={styles.corteFecha}>Fecha inicio:</Text>
          <Text style={styles.corteMonto}>
            {new Date(corte.fecha_inicio).toLocaleDateString()}
          </Text>
        </View>
        <View>
          <Text style={styles.corteFecha}>Fecha fin:</Text>
          <Text style={styles.corteMonto}>
            {new Date(corte.fecha_fin).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text style={styles.corteFecha}>Monto: $</Text>
      <Text>{corte.cobranza_total}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cortes de {usuario.name}</Text>
      {loading ? (
        <Text style={styles.loading}>Cargando cortes...</Text>
      ) : (
        <>
          <Text style={styles.subtitle}>Cortes Diarios</Text>
          <FlatList
            data={cortesDiarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderCorteDiarioItem(item, "diario")}
          />
        </>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          <Text style={styles.subtitle}>Cortes Semanales</Text>
          <FlatList
            data={cortesSemanales}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderCorteSemanalesItem(item, "semanal")}
          />
        </>
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
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  loading: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  corteItem: {
    // backgroundColor: "#f1f1f1",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  corteFecha: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  corteMonto: {
    fontSize: 14,
    paddingBottom: 5,
    color: "#333",
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 25,
    columnGap: 50,
  },
});

export default HistorialCortesScreen;
