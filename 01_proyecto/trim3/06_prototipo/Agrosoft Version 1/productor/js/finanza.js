document.addEventListener('DOMContentLoaded', () => {
    // Llenar automáticamente los campos con valores de ejemplo
    document.getElementById('ingresos-totales').value = 15000;

    document.getElementById('costo-semillas').value = 1500;
    document.getElementById('costo-fertilizantes').value = 2500;
    document.getElementById('costo-pesticidas').value = 1000;
    document.getElementById('costo-mano-obra-directa').value = 3000;
    document.getElementById('otros-costos-directos').value = 500;

    document.getElementById('costo-arriendo').value = 2000;
    document.getElementById('costo-depreciacion').value = 800;
    document.getElementById('costo-servicios').value = 300;
    document.getElementById('costo-mano-obra-indirecta').value = 1200;
    document.getElementById('otros-costos-indirectos').value = 200;

    // Calcular las finanzas automáticamente al cargar la página con los valores de ejemplo
    calcularFinanzas();
});

function calcularFinanzas() {
    // Ingresos
    const ingresosTotales = parseFloat(document.getElementById('ingresos-totales').value) || 0;

    // Costos Directos
    const costoSemillas = parseFloat(document.getElementById('costo-semillas').value) || 0;
    const costoFertilizantes = parseFloat(document.getElementById('costo-fertilizantes').value) || 0;
    const costoPesticidas = parseFloat(document.getElementById('costo-pesticidas').value) || 0;
    const costoManoObraDirecta = parseFloat(document.getElementById('costo-mano-obra-directa').value) || 0;
    const otrosCostosDirectos = parseFloat(document.getElementById('otros-costos-directos').value) || 0;
    const totalCostosDirectos = costoSemillas + costoFertilizantes + costoPesticidas + costoManoObraDirecta + otrosCostosDirectos;

    // Costos Indirectos
    const costoArriendo = parseFloat(document.getElementById('costo-arriendo').value) || 0;
    const costoDepreciacion = parseFloat(document.getElementById('costo-depreciacion').value) || 0;
    const costoServicios = parseFloat(document.getElementById('costo-servicios').value) || 0;
    const costoManoObraIndirecta = parseFloat(document.getElementById('costo-mano-obra-indirecta').value) || 0;
    const otrosCostosIndirectos = parseFloat(document.getElementById('otros-costos-indirectos').value) || 0;
    const totalCostosIndirectos = costoArriendo + costoDepreciacion + costoServicios + costoManoObraIndirecta + otrosCostosIndirectos;

    // Cálculos Financieros
    const gananciaBruta = ingresosTotales - totalCostosDirectos;
    const gananciaNeta = gananciaBruta - totalCostosIndirectos;
    const margenGananciaBruta = ingresosTotales > 0 ? (gananciaBruta / ingresosTotales) * 100 : 0;
    const margenGananciaNeta = ingresosTotales > 0 ? (gananciaNeta / ingresosTotales) * 100 : 0;

    // Mostrar Resultados
    document.getElementById('ganancia-bruta').textContent = gananciaBruta.toFixed(2);
    document.getElementById('ganancia-neta').textContent = gananciaNeta.toFixed(2);
    document.getElementById('margen-ganancia-bruta').textContent = margenGananciaBruta.toFixed(2) + '%';
    document.getElementById('margen-ganancia-neta').textContent = margenGananciaNeta.toFixed(2) + '%';
}