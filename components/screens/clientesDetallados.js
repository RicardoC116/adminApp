import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "../../api/axios";

const ClientesDetallados = ({ route }) => {
  const { deudor } = route.params;
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetallesDeudor = async () => {
      try {
        const response = await axios.get(`/deudores/${deudor.id}`);
        setDetalles(response.data);
        setError(null);
      } catch (error) {
        console.error("Error al cargar los detalles del deudor:", error);
        setError("Error al cargar los datos del cliente");
      } finally {
        setLoading(false);
      }
    };
    fetchDetallesDeudor();
  }, [deudor.id]);

  const formatCurrency = (value) => {
    return `$${parseFloat(value || 0).toFixed(2)}`;
  };

  const formatPhone = (phone) => {
    return phone?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") || "N/A";
  };

  const renderSection = (title, icon, content) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name={icon} size={24} color="#5d1793" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>{content}</View>
    </View>
  );

  const renderDetailItem = (label, value) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5d1793" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={40} color="#ff4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderSection(
        "Información del Cliente",
        "person",
        <>
          {renderDetailItem("Número de Contrato", detalles.contract_number)}
          {renderDetailItem("Nombre", detalles.name)}
          {renderDetailItem("Dirección", detalles.direccion || "N/A")}
          {renderDetailItem("Teléfono", formatPhone(detalles.numero_telefono))}
        </>
      )}

      {renderSection(
        "Detalles del Préstamo",
        "attach-money",
        <>
          {renderDetailItem("Monto Otorgado", formatCurrency(detalles.amount))}
          {renderDetailItem(
            "Total a Pagar",
            formatCurrency(detalles.total_to_pay)
          )}
          {renderDetailItem("Balance Actual", formatCurrency(detalles.balance))}
          {renderDetailItem(
            "Pago Sugerido",
            formatCurrency(detalles.suggested_payment)
          )}
          {renderDetailItem(
            "Primer Pago",
            formatCurrency(detalles.first_payment)
          )}
        </>
      )}

      {renderSection(
        "Información del Aval",
        "contact-page",
        <>
          {renderDetailItem("Nombre del Aval", detalles.aval || "N/A")}
          {renderDetailItem(
            "Teléfono del Aval",
            formatPhone(detalles.aval_phone)
          )}
          {renderDetailItem(
            "Dirección del Aval",
            detalles.aval_direccion || "N/A"
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  sectionContent: {
    paddingHorizontal: 8,
  },
  detailItem: {
    marginVertical: 6,
  },
  detailLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 2,
  },
  detailValue: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ClientesDetallados;
