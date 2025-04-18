import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../api/axios";
import { formatearMonto } from "../../components/global/dinero";
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
      // console.log("Respuesta del backend:", response.data);

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
            @page {
              size: A4;
              margin: 0;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              width: 210mm; /* Ancho A4 */
              height: 297mm; /* Alto A4 */
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: start;
              page-break-after: always;
            }
            .contenedor {
              width: 190mm;
              height: 140mm; /* Mitad del A4 */
              padding: 10mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              page-break-inside: avoid;
              border-bottom: 1px dashed #ccc; /* Línea de corte */
            }
            .encabezado {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5mm;
            }
            .tabla {
              width: 100%;
              border-collapse: collapse;
              margin: 5mm 0;
            }
            .tabla td {
              border: 1px solid #ddd;
              padding: 3mm;
              font-size: 14px;
            }
            .firmas {
              display: flex;
              justify-content: space-around;
              margin-top: 10mm;
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
              width: 60mm;
              margin: 0 auto;
            }
            .nota {
              margin: 5mm 0;
            }
          </style>
        </head>
        <body>
          ${[1, 2]
            .map(
              () => `
            <div class="contenedor">
              <div class="encabezado">
                <span><strong>Agente:</strong> ${usuario.name}</span>
                <span><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</span>
              </div>
              
              <div class="fechas">
                <span><strong>Inicio:</strong> ${new Date(
                  corteAgente.fecha_inicio
                ).toLocaleDateString()}</span>
                <span><strong>Fin:</strong> ${new Date(
                  corteAgente.fecha_fin
                ).toLocaleDateString()}</span>
              </div>
  
              <table class="tabla">
                <tr>
                  <td>Cobrados</td>
                  <td>${corteAgente?.deudores_cobrados ?? 0}</td>
                </tr>
                <tr>
                  <td>No Cobrados</td>
                  <td>${corteAgente?.no_pagos_total ?? 0}</td>
                </tr>
                <tr>
                  <td>Total Cobranza</td>
                  <td>${formatearMonto(corteAgente?.cobranza_total ?? 0)}</td>
                </tr>
                <tr>
                  <td>Comicion Venta</td>
                  <td>${formatearMonto(
                    Number(corteAgente?.comision_ventas) || 0
                  )}</td>
                </tr>
                <tr>
                  <td>Comision Cobros</td>
                  <td>${formatearMonto(
                    Number(corteAgente?.comision_cobro) || 0
                  )}</td>
                </tr>
                <tr>
                  <td>Gastos</td>
                  <td>${formatearMonto(corteAgente?.gastos ?? 0)}</td>
                </tr>
                <tr>
                  <td>Total Agente</td>
                  <td>${formatearMonto(corteAgente?.total_agente ?? 0)}</td>
                </tr>
              </table>
  
              <div class="firmas">
                <div class="firma">
                  <div class="linea-firma"></div>
                  <span>Firma Gerente</span>
                </div>
                <div class="firma">
                  <div class="linea-firma"></div>
                  <span>Firma Agente</span>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;

    Print.printAsync({
      html: contenido,
      orientation: "portrait",
      paperSize: [210, 297], // Tamaño A4 en mm
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
                `${formatearMonto(corteAgente?.cobranza_total) ?? 0}`
              )}
            </View>

            {/* Sección de la derecha: 4 datos */}
            <View style={styles.rightColumn}>
              {renderDato(
                "Comisión Cobros",
                `${formatearMonto(corteAgente?.comision_cobro) ?? 0}`
              )}
              {renderDato(
                "Comisión Ventas",
                `${formatearMonto(corteAgente?.comision_ventas) ?? 0}`
              )}
              {renderDato(
                "Gastos",
                `${formatearMonto(corteAgente?.gastos) ?? 0}`
              )}
              {renderDato(
                "Total Agente",
                `${formatearMonto(corteAgente?.total_agente) ?? 0}`
              )}
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
