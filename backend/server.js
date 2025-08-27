const express = require('express');
const mssql = require('mssql');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5000;

// Configuración SQL Server (usando tus credenciales)
const dbConfig = {
  user: 'sa',
  password: '123',
  server: 'LAPTOP-843ALV87',
  database: 'Estetica',
  options: {
    trustServerCertificate: true
  }
};

// Middleware importante que faltaba
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a la base de datos
mssql.connect(dbConfig)
  .then(() => console.log('Conectado a SQL Server'))
  .catch(err => console.error('Error de conexión:', err));
 
// Ruta de API (mantenida para el formulario)
app.post('/api/citas', async (req, res) => {
  // ... (el mismo código de inserción que teníamos antes)
});

// Ruta principal modificada para servir index.html
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
      .query('SELECT acceso_pagina1, acceso_pagina2 FROM Usuarios WHERE usuario = @usuario AND contrasena = @contrasena');
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



// Ruta para cualquier otra cosa (404)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});





// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutando en http://localhost:${port}`);
});