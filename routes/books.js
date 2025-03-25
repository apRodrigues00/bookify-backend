import pool from "./../db.js"; // Importando a conexão com PostgreSQL
import express from "express";

const route = express();

route.get("/books", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                livros.id_livro, 
                livros.titulo, 
                livros.capa_url, 
                livros.genero, 
                livros.ano_publicacao,
                autores.id_autor, 
                autores.nome AS autor_nome, 
                autores.pais_origem, 
                autores.nascimento
            FROM livros
            JOIN autores ON livros.autor_id = autores.id_autor
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar os livros" });
    }
});

route.get('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                livros.id_livro, 
                livros.titulo, 
                livros.capa_url, 
                livros.genero, 
                livros.ano_publicacao,
                autores.id_autor, 
                autores.nome AS autor_nome, 
                autores.pais_origem, 
                autores.nascimento
            FROM livros
            JOIN autores ON livros.autor_id = autores.id_autor
            WHERE livros.id_livro = $1`;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        const book = result.rows[0];

        res.json(book);
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

export default route;
