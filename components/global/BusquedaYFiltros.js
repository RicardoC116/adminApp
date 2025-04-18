import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import InputWithIcon from "./inputWithIcon"; // Asegúrate de que la ruta es correcta

const BusquedaYFiltros = ({
  searchText,
  onSearch,
  selectedFilter,
  onFilter,
}) => {
  return (
    <View>
      {/* Barra de búsqueda */}
      <InputWithIcon
        value={searchText}
        onChangeText={onSearch}
        placeholder="Buscar usuario..."
      />

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={
            selectedFilter === null
              ? styles.selectedFilterButton
              : styles.filterButton
          }
          onPress={() => onFilter(null)}
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
          onPress={() => onFilter("diario")}
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
          onPress={() => onFilter("semanal")}
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
          onPress={() => onFilter("liquidados")}
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
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default BusquedaYFiltros;
