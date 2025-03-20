import pool from "./../db.js"; // Importando a conexão com PostgreSQL
import express from "express";

const route = express();

route.post("/login", async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Login bem-sucedido', user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

export default route;