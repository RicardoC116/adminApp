const { DateTime } = require("luxon");
const CorteDiario = require("../models/corteDiarioModel");
const PreCorteDiario = require("../models/preCorteDiarioModel");

// Función para ajustar la fecha a la zona horaria de México y convertirla a UTC
function ajustarFechaMexico(fecha, inicioDelDia = true) {
  return inicioDelDia
    ? DateTime.fromJSDate(fecha, { zone: "America/Mexico_City" })
        .startOf("day")
        .toISO({ suppressMilliseconds: true })
    : DateTime.fromJSDate(fecha, { zone: "America/Mexico_City" })
        .endOf("day")
        .toISO({ suppressMilliseconds: true });
}

exports.registrarCorteDiario = async (req, res) => {
  const { collector_id } = req.body;

  if (!collector_id) {
    return res
      .status(400)
      .json({ error: "El ID del cobrador es obligatorio." });
  }

  try {
    // Definir fecha de inicio y fin del día actual
    const fechaBase = new Date();
    const fechaInicio = ajustarFechaMexico(fechaBase, true);
    const fechaFin = ajustarFechaMexico(fechaBase, false);

    console.log("Fecha Inicio (ISO):", fechaInicio);
    console.log("Fecha Fin (ISO):", fechaFin);

    // Obtener pre-cortes del día
    const preCortes = await PreCorteDiario.findAll({
      where: {
        collector_id,
        fecha: { [Op.between]: [fechaInicio, fechaFin] },
      },
    });

    if (preCortes.length === 0) {
      return res.status(400).json({
        error:
          "No se puede generar un corte diario sin pre-cortes registrados.",
      });
    }

    // Inicializar variables acumuladoras
    let cobranzaTotal = 0;
    let deudoresCobrados = 0;
    let liquidacionesTotal = 0;
    let deudoresLiquidados = 0;
    let noPagosTotal = 0;
    let creditosTotal = 0;
    let creditosTotalMonto = 0;
    let primerosPagosTotal = 0;
    let primerosPagosMontos = 0; // Ya que en `corteDiarioModel` es un número, no un array
    let nuevosDeudores = 0;
    let deudoresTotales = 0;

    // Recorrer todos los pre-cortes y sumar los valores
    preCortes.forEach((pre) => {
      cobranzaTotal += parseFloat(pre.cobranza_total);
      deudoresCobrados += pre.deudores_cobrados;
      liquidacionesTotal += parseFloat(pre.liquidaciones_total);
      deudoresLiquidados += pre.deudores_liquidados;
      noPagosTotal += pre.no_pagos_total;
      creditosTotal += pre.creditos_total;
      creditosTotalMonto += parseFloat(pre.creditos_total_monto);
      primerosPagosTotal += pre.primeros_pagos_total;
      primerosPagosMontos += parseFloat(pre.primeros_pagos_montos);
      nuevosDeudores += pre.nuevos_deudores;
      deudoresTotales = pre.deudores_totales; // Tomamos el total de cualquier pre-corte
    });

    // Guardar el corte diario en la base de datos
    const corteDiario = await CorteDiario.create({
      collector_id,
      fecha: fechaFin,
      cobranza_total: cobranzaTotal,
      deudores_cobrados: deudoresCobrados,
      liquidaciones_total: liquidacionesTotal,
      deudores_liquidados: deudoresLiquidados,
      no_pagos_total: noPagosTotal,
      creditos_total: creditosTotal,
      creditos_total_monto: creditosTotalMonto,
      primeros_pagos_total: primerosPagosTotal,
      primeros_pagos_montos: primerosPagosMontos,
      nuevos_deudores: nuevosDeudores,
      deudores_totales: deudoresTotales,
    });

    // Eliminar los pre-cortes después de hacer el corte definitivo
    await PreCorteDiario.destroy({
      where: {
        collector_id,
        fecha: { [Op.between]: [fechaInicio, fechaFin] },
      },
    });

    res.status(201).json({
      message: "Corte Diario registrado exitosamente.",
      corteDiario,
    });
  } catch (error) {
    console.error("Error al registrar el corte diario:", error);
    res.status(500).json({
      error: "Error al registrar el corte diario.",
      detalle: error.message,
    });
  }
};



exports.registrarCorteDiario = async (req, res) => {
  const { collector_id, fecha } = req.body;

  if (!collector_id) {
    return res
      .status(400)
      .json({ error: "El ID del cobrador es obligatorio." });
  }

  try {
    const ultimoCorte = await CorteDiario.findOne({
      where: { collector_id },
      order: [["fecha", "DESC"]],
    });

    // Definir fecha de inicio basada en el último corte o en hoy
    const fechaBase = ultimoCorte ? new Date(ultimoCorte.fecha) : new Date();
    const fechaInicio = ajustarFechaMexico(fechaBase, true);

    // Si hay una fecha en la petición, se usa; si no, se usa hoy
    const fechaBaseFin =
      fecha && !isNaN(Date.parse(fecha)) ? new Date(fecha) : new Date();
    const fechaFin = ajustarFechaMexico(fechaBaseFin, false);

    console.log("Fecha Inicio (ISO):", fechaInicio);
    console.log("Fecha Fin (ISO):", fechaFin);

    // Obtener cobros en el rango
    const cobros = await cobrosController.obtenerCobrosEnRango(
      collector_id,
      fechaInicio,
      fechaFin
    );

    // Obtener deudores que pagaron
    const deudoresCobros = Array.from(new Set(cobros.map((c) => c.debtor_id)));

    // Obtener nuevos deudores (primeros pagos)
    const nuevosDeudores = await deudoresController.obtenerNuevosDeudores(
      collector_id,
      fechaInicio,
      fechaFin
    );
    const primerosPagosMontos =
      deudoresController.calcularPrimerosPagos(nuevosDeudores);
    const deudoresPrimerosPagos = nuevosDeudores.map((d) => d.id);

    // Unificar listas de deudores que han pagado
    const deudoresPagaron = Array.from(
      new Set([...deudoresCobros, ...deudoresPrimerosPagos])
    );

    // Calcular estadísticas
    const cobranzaTotal = cobrosController.calcularCobranzaTotal(cobros) || 0;
    const liquidaciones = cobrosController.calcularLiquidaciones(cobros) || {
      total: 0,
      deudoresLiquidados: [],
    };

    const deudoresActivos = await deudoresController.obtenerDeudoresActivos(
      collector_id
    );
    const noPagosTotal =
      deudoresController.obtenerDeudoresNoPagaron(
        deudoresActivos,
        deudoresPagaron
      ) || 0;

    // Registrar el corte diario con fechas en formato ISO en México
    const corte = await CorteDiario.create({
      collector_id,
      fecha: fechaFin, // Guardamos la fecha en la zona horaria de México
      cobranza_total: cobranzaTotal,
      deudores_cobrados: deudoresPagaron.length,
      liquidaciones_total: liquidaciones.total,
      deudores_liquidados: liquidaciones.deudoresLiquidados.length,
      no_pagos_total: noPagosTotal,
      creditos_total: nuevosDeudores.length,
      creditos_total_monto:
        deudoresController.calcularCreditosTotales(nuevosDeudores) || 0,
      primeros_pagos_total: deudoresPrimerosPagos.length,
      primeros_pagos_montos: primerosPagosMontos || [],
      nuevos_deudores: nuevosDeudores.length,
      deudores_totales: deudoresActivos.length,
    });

    res
      .status(201)
      .json({ message: "Corte diario registrado exitosamente.", corte });
  } catch (error) {
    console.error("Error al registrar el corte diario:", error);
    res
      .status(500)
      .json({
        error: "Error al registrar el corte diario.",
        detalle: error.message,
      });
  }
};