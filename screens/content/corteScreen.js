import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import api from "../../api/axios";
import CorteDiario from "../../components/screens/CorteDiario";
import CorteSemanal from "../../components/screens/CorteSemanal";
import { formatearMonto } from "../../components/global/dinero";
import PreCorteDiario from "../../components/screens/PreCorteDiario";

const CortesScreen = ({ route }) => {
  const { usuario } = route.params;
  const [ultimoCorteDiario, setUltimoCorteDiario] = useState(null);
  const [ultimoCorteSemanal, setUltimoCorteSemanal] = useState(null);
  const [ultimoPreCorte, setUltimoPreCorte] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [corteDiarioResponse, corteSemanalResponse, preCorteResponse] =
        await Promise.all([
          api.get(`/cortes/diario/${usuario.id}`),
          api.get(`/cortes/semanal/${usuario.id}`),
          api.get(`/cortes/preCorte/${usuario.id}`),
        ]);

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
      setUltimoPreCorte(
        preCorteResponse.data?.length
          ? preCorteResponse.data[preCorteResponse.data.length - 1]
          : null
      );
    } catch (error) {
      console.error("Error al cargar los detalles:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar los detalles del corte.",
        [{ text: "OK" }],
        { cancelable: false }
      );
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
              <View
                key={index}
                style={[
                  styles.card,
                  key === "Saldo Final" && styles.saldoFinalCard,
                ]}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    key === "Saldo Final" && styles.saldoFinalTitle,
                  ]}
                >
                  {key.replace(/_/g, " ")}
                </Text>
                <Text
                  style={[
                    styles.cardValue,
                    key === "Saldo Final" && styles.saldoFInalValue,
                  ]}
                >
                  {value}
                </Text>
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
              "Cobranza Total": `${
                formatearMonto(ultimoCorteDiario.cobranza_total) ?? 0
              }`,
              "CLientes Cobrados": ultimoCorteDiario.deudores_cobrados ?? 0,
              "Liquidaciones Totales": `${
                formatearMonto(ultimoCorteDiario.liquidaciones_total) ?? 0
              }`,
              "Clientes liquidados": ultimoCorteDiario.deudores_liquidados,
              "Créditos Totales": ultimoCorteDiario.creditos_total ?? 0,
              "Créditos Totales Monto":
                formatearMonto(ultimoCorteDiario.creditos_total_monto) ?? 0,
              "Primeros Pagos": `${
                parseFloat(ultimoCorteDiario.primeros_pagos_total) ?? 0
              }`,
              "Primeros Pagos Monto": `${
                formatearMonto(ultimoCorteDiario.primeros_pagos_montos) ?? 0
              }`,
              "No Pagos": ultimoCorteDiario.no_pagos_total ?? 0,
              "Clientes totales": ultimoCorteDiario.deudores_totales,
            }
          : null
        // <Text style={styles.noCorteText}>No hay cortes diarios</Text>
      )}

      <View style={styles.buttonsContainer}>
        <PreCorteDiario
          usuarioId={usuario.id}
          ultimoPreCorte={ultimoPreCorte}
          onCorteRealizado={cargarDatos}
        />

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
              "Cobranza Total": `${
                formatearMonto(ultimoCorteSemanal.cobranza_total) ?? 0
              }`,
              "Liquidaciones Totales": `${
                formatearMonto(ultimoCorteSemanal.liquidaciones_total) ?? 0
              }`,
              "Créditos Totales Monto": `${
                formatearMonto(ultimoCorteSemanal.creditos_total_monto) ?? 0
              }`,
              "Primeros Pagos Monto": `${
                formatearMonto(ultimoCorteSemanal.primeros_pagos_Monto) ?? 0
              }`,
              "Nuevos Créditos": ultimoCorteSemanal.nuevos_deudores ?? 0,
              "Comisión de Cobros": `${
                formatearMonto(ultimoCorteSemanal.comision_cobro) ?? 0
              }`,
              "Comisión de Ventas": `${
                formatearMonto(ultimoCorteSemanal.comision_ventas) ?? 0
              }`,
              Gastos: `${formatearMonto(ultimoCorteSemanal.gastos) ?? 0}`,
              "Total de Ingresos": `${
                formatearMonto(ultimoCorteSemanal.total_ingreso) ?? 0
              }`,
              "Total de Egresos": `${
                formatearMonto(ultimoCorteSemanal.total_gasto) ?? 0
              }`,
              "Saldo Final": `${
                formatearMonto(ultimoCorteSemanal.saldo_final) ?? 0
              }`,
            }
          : null
        // <Text style={styles.noCorteText}>No hay cortes semanales</Text>
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
    backgroundColor: "#002474b8",
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
    color: "#fff",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: Platform.OS === "web" ? 16 : 14,
    textAlign: "center",
    color: "#fff",
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
  saldoFinalCard: {
    backgroundColor: "#AA60C8",
  },
  saldoFinalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  saldoFInalValue: {
    fontSize: 14,
    color: "#fff",
  },
});

export default CortesScreen;
