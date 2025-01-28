import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../api/axios";
import * as Print from "expo-print";

import { ImprimirIcono } from "../../components/global/iconos";

const CorteAgenteScreen = ({ route }) => {
  const { usuario } = route.params;
  const [corteAgente, setCorteAgente] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarCorteAgente = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/cortes/semanal/${usuario.id}`);
      console.log("Respuesta del backend:", response.data);

      if (response.data.length > 0) {
        const datosOrdenados = response.data.sort(
          (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
        );
        setCorteAgente(datosOrdenados[0]);
      } else {
        setCorteAgente(null);
      }
    } catch (error) {
      console.error("Error al cargar los datos del corte agente:", error);
      // Alerta de error
      Alert.alert("Error", "Error al cargar los datos del corte agente");
    } finally {
      setLoading(false);
    }
  }, [usuario.id]);

  useFocusEffect(
    useCallback(() => {
      cargarCorteAgente();
    }, [cargarCorteAgente])
  );

  useEffect(() => {
    cargarCorteAgente();
  }, [cargarCorteAgente]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando detalles del agente...</Text>
      </View>
    );
  }

  const renderDato = (titulo, valor) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titulo}</Text>
      <Text style={styles.cardValue}>{valor}</Text>
    </View>
  );

  const imprimirDetalles = () => {
    const contenido = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
              }
              .contenedor {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                justify-content: center;
              
              }
              .encabezado {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                margin-top: 10px;
              }
              .tabla {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                margin-top: 10px;

              }
              .tabla td {
                border: 1px solid #ddd;
                padding: 10px;
                font-size: 14px;
                vertical-align: top;
              }
              .tabla tr {
                // border-bottom: 1px solid #000;
              }
              .nota {
                margin: 20px 0;
              }
              .firmas {
                display: flex;
                justify-content: space-around;
                margin-top: 40px;
              }
              .firma {
                text-align: center;
              }
              .firma span {
                display: block;
                margin-top: 10px;
                font-size: 14px;
              }
              .linea-firma {
                border-top: 1px solid #000;
                margin-top: 30px;
                width: 150px;
                margin-left: auto;
                margin-right: auto;
              }
              .corte-doble {
                border-top: 1px dashed #000;
                margin-top: 40px;
                padding-top: 20px;
              }
              .fechas {
                display: flex;
                justify-content: center;
                gap: 50px;
                padding-block: 10px;
              }
          </style>
          </head>
          <body>
   ${[1, 2]
     .map(
       () => `
            <div class="contenedor">
              <div class="encabezado">
                <span>
                <strong>Nombre del agente: </strong> ${usuario.name}
                </span>
                <span><strong> ${new Date().toLocaleDateString()} </strong></span>
              </div>
              <div class="fechas">
              <span>
              <strong>Fecha de inicio: </strong> 
              ${new Date(corteAgente.fecha_inicio).toLocaleDateString()}
              </span>
              <span>
              <strong>Fecha fin: </strong>
              ${new Date(corteAgente.fecha_fin).toLocaleDateString()}
              </span>
              </div>
              <table class="tabla">
                <tr>
                  <td> <strong>Clientes Cobrados: </strong>${
                    corteAgente?.deudores_cobrados ?? 0
                  }</td>
                  <td><strong>Comisión Cobros: </strong>$${
                    corteAgente?.comision_cobro ?? 0
                  }</td>
                </tr>
                <tr>
                  <td><strong>Clientes No Cobrados: </strong>${
                    corteAgente?.corteAgente?.no_pagos_total ?? 0
                  }</td>
                  <td><strong>Comisión Ventas: </strong>${
                    corteAgente?.comision_ventas ?? 0
                  }</td>
                </tr>
                <tr>
                  <td><strong>Total Cobranza: </strong>$${
                    corteAgente?.cobranza_total ?? 0
                  }</td>
                  <td><strong>Gastos: </strong>$${corteAgente?.gastos ?? 0}</td>
                </tr>
                <tr>
                  <td></td>
                  <td><strong>Total Agente: </strong>$${
                    corteAgente?.total_agente ?? 0
                  }</td>
                </tr>
              </table>
              <br>
              <div class="nota">
                <strong>Nota:</strong> ____________________________________________
              </div>
              <div class="firmas">
                <div class="firma">
                  <div class="linea-firma"></div>
                  <span>Firma del Gerente</span>
                </div>
                <div class="firma">
                  <div class="linea-firma"></div>
                  <span>Firma del Agente</span>
                </div>
              </div>

              <br>
              <br>
              </div>
          `
     )
     .join("")}
          </body>
        </html>
      `;

    Print.printAsync({
      html: contenido,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Resumen de {usuario.name}</Text>

      {corteAgente ? (
        <>
          {/* Sección de la izquierda: 3 datos */}
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              {renderDato(
                "Clientes Cobrados",
                corteAgente?.deudores_cobrados ?? 0
              )}
              {renderDato(
                "Clientes No Cobrados",
                corteAgente?.no_pagos_total ?? 0
              )}
              {renderDato(
                "Total Cobranza",
                `$${corteAgente?.cobranza_total ?? 0}`
              )}
            </View>

            {/* Sección de la derecha: 4 datos */}
            <View style={styles.rightColumn}>
              {renderDato(
                "Comisión Cobros",
                `$${corteAgente?.comision_cobro ?? 0}`
              )}
              {renderDato(
                "Comisión Ventas",
                `$${corteAgente?.comision_ventas ?? 0}`
              )}
              {renderDato("Gastos", `$${corteAgente?.gastos ?? 0}`)}
              {renderDato("Total Agente", `$${corteAgente?.total_agente ?? 0}`)}
            </View>
          </View>

          {/* Botón centrado al final */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.imprimir}
              onPress={imprimirDetalles}
            >
              <Text style={styles.imprimirTexto}>
                <ImprimirIcono size={30} />
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            Aún no hay registros disponibles.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  leftColumn: {
    width: "48%",
  },
  rightColumn: {
    width: "48%",
  },
  card: {
    backgroundColor: "#e8c4ff66",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000025",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 14,
    textAlign: "center",
    color: "#000025",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "italic",
    color: "#999",
    textAlign: "center",
  },
  imprimir: {
    backgroundColor: "#fff",
    padding: 5,
  },
  imprimirTexto: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default CorteAgenteScreen;
