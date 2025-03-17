import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "../../api/axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  DiaIcono,
  ImprimirIcono,
  SemanaIcono,
} from "../../components/global/iconos";
import { formatearMonto } from "../../components/global/dinero";
import BusquedaYFiltros from "../../components/global/BusquedaYFiltros";
import { DateTime } from "luxon";
import * as Print from "expo-print";

const DeudoresScreen = ({ route }) => {
  const { usuario } = route.params;
  const [deudores, setDeudores] = useState([]);
  const [filteredDeudores, setFilteredDeudores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const navigation = useNavigation();
  const [clientesSemanaActual, setClientesSemanaActual] = useState([]);

  const fetchDeudores = async () => {
    try {
      const response = await axios.get(`/deudores/cobrador/${usuario.id}`);
      setDeudores(response.data.reverse());
      setFilteredDeudores(response.data);
    } catch (error) {
      console.error("Error al cargar los deudores:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDeudores();
    }, [usuario.id])
  );

  // Actualizar los pagos cuando cambien los deudores
  useEffect(() => {
    if (deudores.length > 0) {
      obtenerCobrosSemana();
    }
  }, [deudores]);

  // Manejo de búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      applyFilter(selectedFilter);
    } else {
      const filtered = deudores.filter(
        (deudor) =>
          deudor.name.toLowerCase().includes(text.toLowerCase()) ||
          String(deudor.contract_number)
            .toLowerCase()
            .includes(text.toLowerCase())
      );
      setFilteredDeudores(filtered);
    }
  };

  const obtenerCobrosSemana = async () => {
    try {
      const hoy = DateTime.now().setZone("America/Mexico_City").toISODate();
      const response = await axios.get(
        `/cobros/semanaId?fecha=${hoy}&collector_id=${usuario.id}`
      );

      const cobrosSemana = response.data.cobros;

      const clientesConInfo = cobrosSemana.map((pago) => {
        const deudor = deudores.find((d) => d.id === pago.debtor_id);
        return {
          contrato: deudor?.contract_number || "N/A",
          nombre: deudor?.name || "Cliente no encontrado",
          monto: pago.amount,
          fecha: DateTime.fromISO(pago.payment_date).toFormat(
            "dd/MM/yyyy HH:mm"
          ),
        };
      });

      setClientesSemanaActual(clientesConInfo);
    } catch (error) {
      console.error("Error al obtener cobros semanales:", error);
    }
  };
  const handleImprimirLista = async () => {
    if (clientesSemanaActual.length === 0) {
      alert("No hay pagos registrados hoy");
      return;
    }

    try {
      const htmlContent = generarHTMLParaImpresion(clientesSemanaActual);

      // Generar PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 595, // Ancho A4 en puntos (210mm)
        height: 842, // Alto A4 en puntos (297mm)
        base64: false,
      });

      // Imprimir directamente (opcional)
      await Print.printAsync({
        uri,
        printerUrl: "auto", // Usar impresora por defecto
      });
    } catch (error) {
      console.error("Error al imprimir:", error);
      alert("Error al generar el reporte");
    }
  };

  const generarHTMLParaImpresion = (clientes) => {
    const totalRecaudado = clientes.reduce(
      (sum, cliente) => sum + parseFloat(cliente.monto),
      0
    );

    return `
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif;
              margin: 1cm;
              font-size: 10pt;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              padding: 6px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
            .total {
              font-weight: bold;
              background-color: #e9ecef;
            }
          </style>
        </head>
        <body>
          <h3 style="margin-bottom: 5px;">Agente: ${usuario.name}</h3>
          <p style="margin-bottom: 15px;">Periodo: ${DateTime.now().toFormat(
            "dd/MM/yyyy"
          )}</p>
          
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Contrato</th>
                <th>Nombre</th>
                <th>Monto</th>
                <th>Fecha Pago</th>
              </tr>
            </thead>
            <tbody>
              ${clientes
                .map(
                  (cliente, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${cliente.contrato}</td>
                  <td>${cliente.nombre}</td>
                  <td>${formatearMonto(cliente.monto)}</td>
                  <td>${cliente.fecha}</td>
                </tr>
              `
                )
                .join("")}
              <tr class="total">
                <td colspan="3">TOTAL</td>
                <td colspan="2">${formatearMonto(totalRecaudado)}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  // Aplicar filtros
  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    let filtered = deudores;

    if (filter === "diario") {
      filtered = deudores.filter((d) => d.payment_type === "diario");
    } else if (filter === "semanal") {
      filtered = deudores.filter((d) => d.payment_type === "semanal");
    } else if (filter === "liquidados") {
      filtered = deudores.filter((d) => Number(d.balance) === 0);
    }

    // Aplica la búsqueda al conjunto filtrado
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (deudor) =>
          deudor.name.toLowerCase().includes(searchText.toLowerCase()) ||
          String(deudor.contract_number)
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    setFilteredDeudores(filtered);
  };

  const deudoresActivos = deudores.filter((d) => Number(d.balance) > 0);

  const renderDeudor = ({ item }) => (
    <View
      style={[
        styles.containerList,
        Number(item.balance) === 0 && styles.liquidadoBackground, //Liquidaciones
        clientesSemanaActual.some((pago) => pago.debtor_id === item.id) &&
          styles.pagadoHoyBackground, //Pagos de hoy
        // clientesQuePagaronHoy.has(item.id) && styles.pagadoHoyBackground, //Pagos de hoy
      ]}
    >
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
    </View>
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

      <Text style={styles.text}>
        Clientes Activos Totales: {deudoresActivos.length}
      </Text>

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

      <TouchableOpacity style={styles.fab} onPress={handleImprimirLista}>
        <Text style={styles.fabText}>
          <ImprimirIcono size={22} color={"#ffffff"} />
        </Text>
      </TouchableOpacity>
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
  containerList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  liquidadoBackground: {
    backgroundColor: "#d4edda",
  },
  pagadoHoyBackground: {
    backgroundColor: "#ffeb3b",
  },
  text: {
    padding: 5,
    textAlign: "end",
    marginRight: 45,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  printButton: {
    marginRight: 15,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  printButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#00879E",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fabText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DeudoresScreen;
