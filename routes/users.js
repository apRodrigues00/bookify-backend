import pool from "./../db.js"; // Importando a conexão com PostgreSQL
import express from "express";

const route = express();

route.get("/usuarios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
});

route.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, telefone, genero_preferido } = req.body;
        const result = await pool.query(
            "INSERT INTO usuarios (nome, email, telefone, genero_preferido) VALUES ($1, $2, $3, $4) RETURNING *",
            [nome, email, telefone, genero_preferido]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
});

export default route;