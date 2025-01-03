import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import api from "../api/axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import InputWithIcon from "../components/inputWithIcon";

const MainScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [focus, setFocus] = useState(false);
  const navigation = useNavigation();

  // Función para cargar los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/cobradores");
      if (response.data) {
        setUsuarios(response.data);
        setFilteredUsuarios(response.data);
      } else {
        setUsuarios([]);
        setFilteredUsuarios([]);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("No se pudo cargar la lista de usuarios.");
    }
  };

  // Recargar datos al volver a la pantalla principal
  useFocusEffect(
    React.useCallback(() => {
      fetchUsuarios();
    }, [])
  );

  // Manejar la búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = usuarios.filter(
        (usuario) =>
          usuario.name.toLowerCase().includes(text.toLowerCase()) ||
          String(usuario.phone_number)
            .toLowerCase()
            .includes(text.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    } else {
      setFilteredUsuarios(usuarios);
    }
  };

  const handleUserClick = (usuario) => {
    navigation.navigate("DetallesUsuarios", { usuario });
  };

  // Renderizar la lista de usuarios
  const renderUsuario = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserClick(item)}
    >
      <Text className="text-red-600 text-center" style={styles.userText}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <InputWithIcon
        value={searchText}
        onChangeText={handleSearch}
        placeholder="Buscar usuario..."
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        focus={focus}
      />

      {/* Lista de usuarios */}
      <FlatList
        data={filteredUsuarios}
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
