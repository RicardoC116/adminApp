import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import api from "../api/axios";
import Swal from "sweetalert2";
import { View } from "react-native-web";
import { ImprimirIcono } from "./iconos";

const CorteDiario = ({
  usuarioId,
  ultimoCorteDiario,
  onCorteRealizado,
  nombre,
}) => {
  const confirmarCorteDiario = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas realizar el corte diario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCorteDiario();
      }
    });
  };

  const handleCorteDiario = async () => {
    // Validar si ya se hizo un corte en el día actual
    if (
      ultimoCorteDiario &&
      new Date(ultimoCorteDiario.fecha).toISOString().split("T")[0] ===
        new Date().toISOString().split("T")[0]
    ) {
      Swal.fire({
        title: "Aviso",
        text: "Ya se ha registrado un corte para este día.",
        icon: "warning",
      });
      return;
    }

    try {
      const response = await api.post("/cortes/diario", {
        collector_id: usuarioId,
      });

      Swal.fire({
        title: "Éxito",
        text: "Corte diario realizado exitosamente.",
        icon: "success",
      });

      if (onCorteRealizado) onCorteRealizado();
    } catch (error) {
      console.error("Error al realizar el corte diario:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo realizar el corte diario.",
        icon: "error",
      });
    }
  };
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
              border-bottom: 1px solid #000;
            }
            .nota {
              margin: 20px 0;
            }
            .firmas {
              display: flex;
              justify-content: space-between;
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
          </style>
        </head>
        <body>
          ${[1, 2]
            .map(
              () => `
            <div class="contenedor">
              <div class="encabezado">
                <strong>Nombre del agente: ${nombre}</strong>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
              <table class="tabla">
                <tr>
                  <td>Cobranza Total = $${
                    ultimoCorteDiario?.cobranza_total ?? 0
                  }</td>
                  <td>Total de Clientes = ${
                    ultimoCorteDiario?.deudores_totales ?? 0
                  }</td>
                </tr>
                <tr>
                  <td>Primeros Pagos = $${
                    ultimoCorteDiario?.primeros_pagos_total ?? 0
                  }</td>
                  <td>Clientes Cobrados = ${
                    ultimoCorteDiario?.deudores_cobrados ?? 0
                  } / No Pagos = ${ultimoCorteDiario?.no_pagos_total ?? 0}</td>
                </tr>
                <tr>
                  <td>Liquidaciones = $${
                    ultimoCorteDiario?.liquidaciones_total ?? 0
                  }</td>
                  <td>Liquidaciones Totales = ${
                    ultimoCorteDiario?.deudores_liquidados ?? 0
                  }</td>
                </tr>
                <tr>
                  <td>Créditos = $${
                    ultimoCorteDiario?.creditos_total_monto ?? 0
                  }</td>
                  <td>Créditos Totales = ${
                    ultimoCorteDiario?.creditos_total ?? 0
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
              <br>
              </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;

    const ventana = window.open("", "_blank");
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={confirmarCorteDiario}>
        <Text style={styles.buttonText}>Corte Diario</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.imprimir} onPress={imprimirDetalles}>
        <Text style={styles.imprimirTexto}>
          <ImprimirIcono size={24} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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

export default CorteDiario;
