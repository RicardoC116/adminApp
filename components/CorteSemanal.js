// components/CorteSemanal
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import api from "../api/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { View } from "react-native-web";
import { ImprimirIcono } from "./iconos";
import "../styles.css";

const MySwal = withReactContent(Swal);

const CorteSemanal = ({ usuarioId, ultimoCorteSemanal }) => {
  const confirmarCorteSemanal = () => {
    MySwal.fire({
      title:
        "<h2 style='color: #000; font-size: 24px; font-weight: bold; font-family: system-ui; '>Crear Corte Semanal</h2>",
      html: `
        <div style="text-align: left; font-size: 17px; color: #333; line-height: 1.5; font-family: math;">
          <label for="fecha_inicio" style="display: block; margin-bottom: 5px;">Fecha de Inicio:</label>
          <input type="date" id="fecha_inicio" class="swal2-input" style="margin-bottom: 10px;">
  
          <label for="fecha_fin" style="display: block; margin-bottom: 5px;">Fecha de Fin:</label>
          <input type="date" id="fecha_fin" class="swal2-input" style="margin-bottom: 10px;">
  
          <label for="comision_cobro" style="display: block; margin-bottom: 5px;">Comisión de Cobro:</label>
          <input type="number" id="comision_cobro" class="swal2-input" style="margin-bottom: 10px;" placeholder="Ingresa la comisión de cobro">
  
          <label for="comision_ventas" style="display: block; margin-bottom: 5px;">Comisión de Ventas:</label>
          <input type="number" id="comision_ventas" class="swal2-input" style="margin-bottom: 10px;" placeholder="Ingresa la comisión de ventas">
  
          <label for="gastos" style="display: block; margin-bottom: 5px;">Gastos:</label>
          <input type="number" id="gastos" class="swal2-input" style="margin-bottom: 10px;" placeholder="Ingresa los gastos">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<span style="font-size: 16px;">Crear Corte</span>',
      cancelButtonText: '<span style="font-size: 16px;">Cancelar</span>',
      customClass: {
        popup: "swal2-custom-popup",
        confirmButton: "swal2-custom-confirm-button",
        cancelButton: "swal2-custom-cancel-button",
      },
      preConfirm: () => {
        const fecha_inicio = document.getElementById("fecha_inicio").value;
        const fecha_fin = document.getElementById("fecha_fin").value;
        const comision_cobro = document.getElementById("comision_cobro").value;
        const comision_ventas =
          document.getElementById("comision_ventas").value;
        const gastos = document.getElementById("gastos").value;

        if (
          !fecha_inicio ||
          !fecha_fin ||
          !comision_cobro ||
          !comision_ventas ||
          !gastos
        ) {
          Swal.showValidationMessage("Todos los campos son obligatorios.");
          return false;
        }

        return {
          fecha_inicio,
          fecha_fin,
          comision_cobro,
          comision_ventas,
          gastos,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleCorteSemanal(result.value);
      }
    });
  };

  const handleCorteSemanal = async (data) => {
    try {
      await api.post("/cortes/semanal", {
        collector_id: usuarioId,
        ...data,
      });

      Swal.fire({
        title: "Éxito",
        text: "Corte semanal realizado exitosamente.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error al realizar el corte semanal:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo realizar el corte semanal.",
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
              h1 {
                font-size: 24px;
                color: #4CAF50;
                text-align: center;
                margin-bottom: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              .signature {
                margin-top: 50px;
                text-align: center;
              }
              .signature-line {
                margin-top: 20px;
                border-top: 1px solid #333;
                width: 50%;
                margin-left: auto;
                margin-right: auto;
              }
            </style>
          </head>
          <body>

            <h1>Detalles del Corte Semanal</h1>
            ${
              ultimoCorteSemanal
                ? `
            <table>
              ${Object.entries(ultimoCorteSemanal)
                .map(
                  ([key, value]) => `
                <tr>
                  <th>${key.replace(/_/g, " ")}</th>
                  <td>${value}</td>
                </tr>
              `
                )
                .join("")}
            </table>`
                : "<p>No hay datos disponibles para el corte semanal.</p>"
            }
    
            <div class="signature">
              <p>Firma:</p>
              <div class="signature-line"></div>
            </div>
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
      <TouchableOpacity style={styles.button} onPress={confirmarCorteSemanal}>
        <Text style={styles.buttonText}>Corte Semanal</Text>
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
    backgroundColor: "#28a745",
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

export default CorteSemanal;
