import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import api from "../../api/axios";
import Swal from "sweetalert2";
import CorteDiario from "../../components/CorteDiario";
import CorteSemanal from "../../components/CorteSemanal";

const CortesScreen = ({ route }) => {
  const { usuario } = route.params;
  const [ultimoCorteDiario, setUltimoCorteDiario] = useState(null);
  const [ultimoCorteSemanal, setUltimoCorteSemanal] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [corteDiarioResponse, corteSemanalResponse] = await Promise.all([
        api.get(`/cortes/diario/${usuario.id}`),
        api.get(`/cortes/semanal/${usuario.id}`),
      ]);
      console.log(usuario.id);

      setUltimoCorteDiario(
        corteDiarioResponse.data?.length
          ? corteDiarioResponse.data[corteDiarioResponse.data.length - 1]
          : null
      );
      setUltimoCorteSemanal(
        corteSemanalResponse.data?.length
          ? corteSemanalResponse.data[corteSemanalResponse.data.length - 1]
          : null
      );
    } catch (error) {
      console.error("Error al cargar los detalles:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los detalles del corte.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [usuario.id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando detalles del cobrador...</Text>
      </View>
    );
  }

  const renderData = (title, data) => {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        {data ? (
          <View style={styles.dataContainer}>
            {Object.entries(data).map(([key, value], index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{key.replace(/_/g, " ")}</Text>
                <Text style={styles.cardValue}>{value}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noCorteText}>
            Aún no hay registros disponibles.
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={{ fontSize: 22, textAlign: "center", fontWeight: "bold" }}>
        Detalles de {usuario.name}
      </Text>
      {renderData(
        "Corte Diario",
        ultimoCorteDiario
          ? {
              "Cobranza Total": `$${ultimoCorteDiario.cobranza_total ?? 0}`,
              "CLientes Cobrados": ultimoCorteDiario.deudores_cobrados ?? 0,
              "Liquidaciones Totales": `$${
                ultimoCorteDiario.liquidaciones_total ?? 0
              }`,
              "Clientes liquidados": ultimoCorteDiario.deudores_liquidados,
              "Créditos Totales": ultimoCorteDiario.creditos_total ?? 0,
              "No Pagos": ultimoCorteDiario.no_pagos_total ?? 0,
              "Primeros Pagos": `$${
                ultimoCorteDiario.primeros_pagos_total ?? 0
              }`,
              "Clientes totales": ultimoCorteDiario.deudores_totales,
            }
          : null
      )}

      <View style={styles.buttonsContainer}>
        <CorteDiario
          usuarioId={usuario.id}
          ultimoCorteDiario={ultimoCorteDiario}
          onCorteRealizado={cargarDatos}
          nombre={usuario.name}
        />
        <CorteSemanal
          usuarioId={usuario.id}
          onCorteRealizado={cargarDatos}
          ultimoCorteSemanal={ultimoCorteSemanal}
          nombre={usuario.name}
        />
      </View>

      {renderData(
        "Corte Semanal",
        ultimoCorteSemanal
          ? {
              "Corte Inicio": ultimoCorteSemanal.fecha_inicio
                ? new Date(ultimoCorteSemanal.fecha_inicio).toLocaleDateString()
                : "Sin fecha",
              "Corte Fin": ultimoCorteSemanal.fecha_fin
                ? new Date(ultimoCorteSemanal.fecha_fin).toLocaleDateString()
                : "Sin fecha",
              "Cobranza Total": `$${ultimoCorteSemanal.cobranza_total ?? 0}`,
              "Liquidaciones Totales": `$${
                ultimoCorteSemanal.liquidaciones_total ?? 0
              }`,
              "Créditos Totales": `$${
                ultimoCorteSemanal.creditos_total_monto ?? 0
              }`,
              "Primeros Pagos": `$${
                ultimoCorteSemanal.primeros_pagos_total ?? 0
              }`,
              "Nuevos Créditos": ultimoCorteSemanal.nuevos_deudores ?? 0,
              "Comisión de Cobros": `$${
                ultimoCorteSemanal.comision_cobro ?? 0
              }`,
              "Comisión de Ventas": `$${
                ultimoCorteSemanal.comision_ventas ?? 0
              }`,
              Gastos: `$${ultimoCorteSemanal.gastos ?? 0}`,
              "Total de Ingresos": `$${ultimoCorteSemanal.total_ingreso ?? 0}`,
              "Total de EGESOS": `$${ultimoCorteSemanal.total_gasto ?? 0}`,
              "Saldo Final": `$${ultimoCorteSemanal.saldo_final ?? 0}`,
            }
          : null
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  dataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 25,
    columnGap: 10,
    // gap: 10,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  card: {
    backgroundColor: "#e8c4ff66",
    borderRadius: 8,
    padding: 10,
    width: "48%",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: Platform.OS === "web" ? 18 : 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000025",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: Platform.OS === "web" ? 16 : 14,
    textAlign: "center",
    color: "#000025",
  },
  noCorteText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default CortesScreen;
