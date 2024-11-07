import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import api from "../api/axios";
import { useNavigation } from "@react-navigation/native";

const MainScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigation = useNavigation();

  // Fuincion para el back
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/cobradores");
        if (response.data) {
          setUsuarios(response.data);
        } else {
          setUsuarios([]); // Manejar si la respuesta no tiene datos
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        Alert.alert("Error", "No se pudo cargar la lista de usuarios.");
      }
    };

    fetchUsuarios();
  }, []);

  const handleUserClick = (usuario) => {
    navigation.navigate("DetallesUsuarios", { usuario });
  };

  // Renderizar la lista de usuarios
  const renderUsuario = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserClick(item)}
    >
      <Text style={styles.userText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 16,
  },
});

export default MainScreen;
