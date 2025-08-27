document.getElementById('formCita').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const modalidad = document.getElementById('modalidad').value;
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const especificaciones = document.getElementById('especificaciones').value;

    const data = {
        nombre,
        telefono,
        email,
        modalidad: parseInt(modalidad),
        servicio: parseInt(servicio),
        fecha,
        hora,
        especificaciones
    };

    try {
        const response = await fetch('/api/citas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('modalConfirmacion').style.display = 'block';
            this.reset(); // Resetear el formulario
        } else {
            alert('Error al registrar la cita');
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un problema de conexión. Inténtalo de nuevo más tarde.');
    }
});

function cerrarModal() {
    document.getElementById('modalConfirmacion').style.display = 'none';
}



//LOGIN
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, contrasena })
        });

        const data = await response.json();

        if (response.ok) {
            // Redirigir según el acceso
            if (data.acceso_pagina1) {
                window.location.href = 'vista.html'; // Redirigir a vista.html
            } else if (data.acceso_pagina2) {
                window.location.href = 'sistema.html'; // Redirigir a sistema.html
            } else {
                alert('No tienes acceso a ninguna página.');
            }
        } else {
            alert(data.message); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema de conexión. Inténtalo de nuevo más tarde.');
    }
});
