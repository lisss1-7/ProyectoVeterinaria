const express = require('express');
const mssql = require('mssql');
const path = require('path');

const app = express();
const port = 5000;

// Configuración de SQL Server
const dbConfig = {
  user: 'sa',
  password: '123',            // cámbialo por tu password real
  server: 'LAPTOP-843ALV87',  // cámbialo por tu servidor
  database: 'Estetica',
  options: {
    trustServerCertificate: true
  }
};

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión global
mssql.connect(dbConfig)
  .then(() => console.log('Conectado a SQL Server'))
  .catch(err => console.error('Error de conexión:', err));

// Ruta de API para guardar citas
app.post('/api/citas', async (req, res) => {
    const { nombre, telefono, email, id_modalidad, id_servicio, hora, fecha, especificaciones } = req.body;

    try {
        const pool = await mssql.connect(dbConfig);
        const query = `
            INSERT INTO dbo.Cita
            ([Nombre_dueño], [Telefono], [Email], [Id_Modalidad], [Id_Servicio], [Hora], [Fecha], [Especificaciones_de_Servicio])
            VALUES (@nombre, @telefono, @email, @id_modalidad, @id_servicio, @hora, @fecha, @especificaciones);
        `;

        await pool.request()
            .input('nombre', mssql.NVarChar, nombre)
            .input('telefono', mssql.NVarChar, telefono)
            .input('email', mssql.NVarChar, email)
            .input('id_modalidad', mssql.Int, id_modalidad)
            .input('id_servicio', mssql.Int, id_servicio)
            .input('hora', mssql.NVarChar, hora) // Cambiar a mssql.Time si en SQL es TIME
            .input('fecha', mssql.DateTime, fecha)
            .input('especificaciones', mssql.NVarChar, especificaciones)
            .query(query);

        res.status(201).json({ message: 'Cita guardada con exito' });
    } catch (err) {
        console.error('Error al guardar cita:', err);
        res.status(500).json({ message: 'Error al guardar la cita' });
    }
});
// Ruta principal (sirve index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para cita.html
app.get('/cita', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cita.html'));
});

// Ruta para validar el login
app.post('/api/login', async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
    const pool = await mssql.connect(dbConfig);
    const result = await pool.request()
        .input('usuario', mssql.NVarChar, usuario)
        .input('contrasena', mssql.NVarChar, contrasena)
        .query(`
            SELECT acceso_pagina1, acceso_pagina2
            FROM Usuarios
            WHERE usuario = @usuario AND contrasena = @contrasena
        `);

    if (result.recordset.length > 0) {
        res.json({
            acceso_pagina1: result.recordset[0].acceso_pagina1,
            acceso_pagina2: result.recordset[0].acceso_pagina2
        });
    } else {
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
} catch (err) {
    console.error('Error al validar login:', err);
    res.status(500).json({ message: 'Error en el servidor' });
}
});

// Ruta para 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutando en http://localhost:${port}`);
});
