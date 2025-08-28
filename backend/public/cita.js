
// Actualiza el año en el pie de página
document.getElementById('year').textContent = new Date().getFullYear();

// Manejo del formulario de citas
document.getElementById('formCita').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    const citaData = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        id_modalidad: parseInt(document.getElementById('modalidad').value),
        id_servicio: parseInt(document.getElementById('servicio').value),
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        especificaciones: document.getElementById('especificaciones').value
    };
try {
    const response = await fetch('http://localhost:5000/api/citas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(citaData)
    });

    const data = await response.json();

    if (response.ok) {
        // Mostrar modal de confirmación
        document.getElementById('modalConfirmacion').style.display = 'block';

        // Limpiar el formulario
        event.target.reset();
    } else {
        alert(data.message || 'Error al agendar la cita');
    }
} catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema de conexión. Inténtalo de nuevo más tarde.');
}
});
function cerrarModal() {
    document.getElementById('modalConfirmacion').style.display = 'none';
}

