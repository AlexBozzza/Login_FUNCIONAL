const { pool } = require('../config/database');

class User {
    constructor(data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.email = data.email;
        this.telefono = data.telefono;
        this.password = data.password;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // ✅ Obtener todos los usuarios
    static async findAll() {
        const [rows] = await pool.query(
            'SELECT id, nombre, email, telefono, created_at, updated_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    }

    // ✅ Buscar usuario por ID
    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, nombre, email, telefono, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    // ✅ Buscar usuario por email
    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT id, nombre, email, telefono, created_at, updated_at FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    // ✅ Buscar usuario con contraseña (para login)
    static async findByEmailWithPassword(email) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    // ✅ Crear usuario
    static async create({ nombre, email, telefono, password }) {
        const [result] = await pool.query(
            `INSERT INTO users (nombre, email, telefono, password, created_at, updated_at)
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [nombre, email, telefono, password]
        );
        return this.findById(result.insertId);
    }

    // ✅ Update combinado (nombre, telefono y contraseña si viene)
    static async updateUser(id, { nombre, telefono, password }) {
        let sql = `UPDATE users SET nombre = ?, telefono = ?, updated_at = NOW()`;
        const params = [nombre, telefono];

        if (password) {
            sql += `, password = ?`;
            params.push(password);
        }

        sql += ` WHERE id = ?`;
        params.push(id);

        await pool.query(sql, params);

        return this.findById(id);
    }
}

module.exports = User;
