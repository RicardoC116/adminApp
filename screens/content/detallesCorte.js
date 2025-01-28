import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import axios from "../../api/axios";

export default function DetallesCorte({ route }) {
  const { corte, tipo } = route.params;
  const navigation = useNavigation();

  // Función para eliminar el corte
  const handleEliminarCorte = async () => {
    // Mostrar alerta de confirmación antes de eliminar el corte
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este corte?",
      [
        {
          text: "Cancelar",
          style: "cancel", // Cancela la acción si el usuario elige 'Cancelar'
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              // Elimina el corte dependiendo del tipo (diario o semanal)
              const url =
                tipo === "diario"
                  ? `/cortes/diario/${corte.id}`
                  : `/cortes/semanal/${corte.id}`;

              await axios.delete(url); // Realiza la solicitud DELETE

              // Regresa a la pantalla de historial de cortes después de eliminar
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
              value={`$${corte.cobranza_total}`}
            />
            <Detail
              label="Primeros Pagos (Monto):"
              value={`$${corte.primeros_pagos_montos}`}
            />
            <Detail
              label="Deudores Cobrados:"
              value={corte.deudores_cobrados}
            />
            <Detail
              label="Liquidaciones Totales:"
              value={`$${corte.liquidaciones_total}`}
            />
            <Detail
              label="Deudores Liquidados:"
              value={corte.deudores_liquidados}
            />
            <Detail label="No Pagos Totales:" value={corte.no_pagos_total} />
            <Detail label="Créditos Totales:" value={corte.creditos_total} />
            <Detail
              label="Créditos (Monto Total):"
              value={`$${corte.creditos_total_monto}`}
            />
            <Detail
              label="Primeros Pagos (Total):"
              value={corte.primeros_pagos_total}
            />
            <Detail label="Nuevos Deudores:" value={corte.nuevos_deudores} />
            <Detail label="Deudores Totales:" value={corte.deudores_totales} />
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
              label="Deudores Cobrados:"
              value={corte.deudores_cobrados}
            />
            <Detail
              label="Cobranza Total:"
              value={`$${corte.cobranza_total}`}
            />
            <Detail
              label="Nuevos clientes:"
              value={`$${corte.nuevos_deudores}`}
            />
            <Detail
              label="creditos total monto:"
              value={`$${corte.creditos_total_monto}`}
            />
            <Detail
              label="primeros pagos Monto:"
              value={`$${corte.primeros_pagos_Monto}`}
            />
            <Detail
              label="liquidaciones total:"
              value={`$${corte.liquidaciones_total}`}
            />
            <Detail
              label="creditos total:"
              value={`$${corte.creditos_total}`}
            />
            <Detail
              label="primeros pagos total:"
              value={`$${corte.primeros_pagos_total}`}
            />
            <Detail
              label="no pagos total:"
              value={`$${corte.no_pagos_total}`}
            />
            <Detail
              label="Comisión por Cobro:"
              value={`$${corte.comision_cobro}`}
            />
            <Detail
              label="Comision ventas:"
              value={`$${corte.comision_ventas}`}
            />
            <Detail label="gastos:" value={`$${corte.gastos}`} />
            <Detail label="saldo_final:" value={`$${corte.saldo_final}`} />
            <Detail label="total_ingreso:" value={`$${corte.total_ingreso}`} />
            <Detail label="total_gasto:" value={`$${corte.total_gasto}`} />
            <Detail label="total_agente:" value={`$${corte.total_agente}`} />
          </>
        )}
        <Button title="Eliminar corte" onPress={handleEliminarCorte} />
      </View>
    </ScrollView>
  );
}

// Componente reutilizable para los detalles
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
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
});
