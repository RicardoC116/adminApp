import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "../../api/axios";
import { formatearMonto } from "../../components/global/dinero";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { ImprimirIcono } from "../../components/global/iconos";

export default function DetallesCorte({ route }) {
  const { corte, tipo } = route.params;
  const navigation = useNavigation();

  // Función para eliminar el corte
  const handleEliminarCorte = async () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este corte?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const url =
                tipo === "diario"
                  ? `/cortes/diario/${corte.id}`
                  : `/cortes/semanal/${corte.id}`;

              await axios.delete(url);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Error al eliminar el corte");
              console.error("Error al eliminar el corte:", error);
            }
          },
        },
      ]
    );
  };

  // Función para generar el PDF
  const generarPDF = async () => {
    let contenidoHTML = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        h1, h2 {
          color: #444;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        .info-section {
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Detalles del Corte ${tipo === "diario" ? "Diario" : "Semanal"}</h1>
      <h2>Información General</h2>

      <div class="info-section">
        <table>
          <tbody>
`;

    if (tipo === "diario") {
      contenidoHTML += `
    <tr><th>Fecha</th><td>${new Date(
      corte.fecha
    ).toLocaleDateString()}</td></tr>
    <tr><th>Cobranza Total</th><td>${formatearMonto(
      corte.cobranza_total
    )}</td></tr>
    <tr><th>Primeros Pagos (Monto)</th><td>${formatearMonto(
      corte.primeros_pagos_montos
    )}</td></tr>
    <tr><th>Clientes Cobrados</th><td>${corte.deudores_cobrados}</td></tr>
    <tr><th>Liquidaciones Totales</th><td>${formatearMonto(
      corte.liquidaciones_total
    )}</td></tr>
    <tr><th>Clientes Liquidados</th><td>${corte.deudores_liquidados}</td></tr>
    <tr><th>No Pagos Totales</th><td>${corte.no_pagos_total}</td></tr>
    <tr><th>Créditos Totales</th><td>${corte.creditos_total}</td></tr>
    <tr><th>Créditos (Monto Total)</th><td>${formatearMonto(
      corte.creditos_total_monto
    )}</td></tr>
    <tr><th>Primeros Pagos (Total)</th><td>${parseFloat(
      corte.primeros_pagos_total
    )}</td></tr>
    <tr><th>Nuevos Clientes</th><td>${corte.nuevos_deudores}</td></tr>
    <tr><th>Clientes Totales</th><td>${corte.deudores_totales}</td></tr>
  `;
    } else {
      contenidoHTML += `
    <tr><th>Fecha Inicio</th><td>${new Date(
      corte.fecha_inicio
    ).toLocaleDateString()}</td></tr>
    <tr><th>Fecha Fin</th><td>${new Date(
      corte.fecha_fin
    ).toLocaleDateString()}</td></tr>
    <tr><th>Clientes Cobrados</th><td>${corte.deudores_cobrados}</td></tr>
    <tr><th>Cobranza Total</th><td>${formatearMonto(
      corte.cobranza_total
    )}</td></tr>
    <tr><th>Nuevos Clientes</th><td>${corte.nuevos_deudores}</td></tr>
    <tr><th>Créditos Total Monto</th><td>${formatearMonto(
      corte.creditos_total_monto
    )}</td></tr>
    <tr><th>Primeros Pagos Monto</th><td>${formatearMonto(
      corte.primeros_pagos_Monto
    )}</td></tr>
    <tr><th>Liquidaciones Total Monto</th><td>${formatearMonto(
      corte.liquidaciones_total
    )}</td></tr>
    <tr><th>Créditos Total</th><td>${corte.creditos_total}</td></tr>
    <tr><th>Primeros Pagos Total</th><td>${parseFloat(
      corte.primeros_pagos_total
    )}</td></tr>
    <tr><th>No Pagos Total</th><td>${corte.no_pagos_total}</td></tr>
    <tr><th>Comisión por Cobro</th><td>${formatearMonto(
      corte.comision_cobro
    )}</td></tr>
    <tr><th>Comisión Ventas</th><td>${formatearMonto(
      corte.comision_ventas
    )}</td></tr>
    <tr><th>Gastos</th><td>${formatearMonto(corte.gastos)}</td></tr>
    <tr><th>Saldo Final</th><td>${formatearMonto(corte.saldo_final)}</td></tr>
    <tr><th>Total Ingreso</th><td>${formatearMonto(
      corte.total_ingreso
    )}</td></tr>
    <tr><th>Total Gastos</th><td>${formatearMonto(corte.total_gasto)}</td></tr>
    <tr><th>Total Agente</th><td>${formatearMonto(corte.total_agente)}</td></tr>
  `;
    }

    contenidoHTML += `
          </tbody>
        </table>
      </div>
    </body>
  </html>
`;

    try {
      Print.printAsync({ html: contenidoHTML });
    } catch (error) {
      console.log("Error al generar el PDF");
      Alert.alert("Error", "No se pudo generar el PDF");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Detalles del Corte {tipo === "diario" ? "Diario" : "Semanal"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información General</Text>
        {tipo === "diario" ? (
          <>
            <Detail
              label="Fecha:"
              value={new Date(corte.fecha).toLocaleDateString()}
            />

            <Detail
              label="Cobranza Total:"
              value={`${formatearMonto(corte.cobranza_total)}`}
            />
            <Detail
              label="Primeros Pagos (Monto):"
              value={`${formatearMonto(corte.primeros_pagos_montos)}`}
            />
            <Detail
              label="Clientes Cobrados:"
              value={corte.deudores_cobrados}
            />
            <Detail
              label="Liquidaciones Totales:"
              value={`${formatearMonto(corte.liquidaciones_total)}`}
            />
            <Detail
              label="Clientes Liquidados:"
              value={corte.deudores_liquidados}
            />
            <Detail label="No Pagos Totales:" value={corte.no_pagos_total} />
            <Detail label="Créditos Totales:" value={corte.creditos_total} />
            <Detail
              label="Créditos (Monto Total):"
              value={`${formatearMonto(corte.creditos_total_monto)}`}
            />
            <Detail
              label="Primeros Pagos (Total):"
              value={parseFloat(corte.primeros_pagos_total)}
            />
            <Detail label="Nuevos Clientes:" value={corte.nuevos_deudores} />
            <Detail label="Clientes Totales:" value={corte.deudores_totales} />
          </>
        ) : (
          <>
            <Detail
              label="Fecha Inicio:"
              value={new Date(corte.fecha_inicio).toLocaleDateString()}
            />
            <Detail
              label="Fecha Fin:"
              value={new Date(corte.fecha_fin).toLocaleDateString()}
            />
            <Detail
              label="Clientes Cobrados:"
              value={corte.deudores_cobrados}
            />
            <Detail
              label="Cobranza Total:"
              value={`${formatearMonto(corte.cobranza_total)}`}
            />
            <Detail
              label="Nuevos Clientes:"
              value={`${corte.nuevos_deudores}`}
            />
            <Detail
              label="Creditos Total Monto:"
              value={`${formatearMonto(corte.creditos_total_monto)}`}
            />
            <Detail
              label="Primeros Pagos Monto:"
              value={`${formatearMonto(corte.primeros_pagos_Monto)}`}
            />
            <Detail
              label="Liquidaciones Total Monto:"
              value={`${formatearMonto(corte.liquidaciones_total)}`}
            />
            <Detail label="Creditos total:" value={`${corte.creditos_total}`} />
            <Detail
              label="Primeros pagos total:"
              value={`${parseFloat(corte.primeros_pagos_total)}`}
            />
            <Detail label="No pagos total:" value={`${corte.no_pagos_total}`} />
            <Detail
              label="Comisión por Cobro:"
              value={`${formatearMonto(corte.comision_cobro)}`}
            />
            <Detail
              label="Comision ventas:"
              value={`${formatearMonto(corte.comision_ventas)}`}
            />
            <Detail label="Gastos:" value={`${formatearMonto(corte.gastos)}`} />
            <Detail
              label="Saldo Final:"
              value={`${formatearMonto(corte.saldo_final)}`}
            />
            <Detail
              label="Total Ingreso:"
              value={`${formatearMonto(corte.total_ingreso)}`}
            />
            <Detail
              label="Total Egresos:"
              value={`${formatearMonto(corte.total_gasto)}`}
            />
            <Detail
              label="Total Agente:"
              value={`${formatearMonto(corte.total_agente)}`}
            />
          </>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            marginTop: 20,
          }}
        >
          {/* Botón de eliminar */}
          <TouchableOpacity
            onPress={handleEliminarCorte}
            style={{
              backgroundColor: "#ff4d4d",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Eliminar Corte
            </Text>
          </TouchableOpacity>

          {/* Botón de imprimir */}
          <TouchableOpacity
            onPress={generarPDF}
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            <ImprimirIcono size={24} color={"#000"} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const Detail = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: 17,
    color: "#555",
    fontWeight: "800",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
});
