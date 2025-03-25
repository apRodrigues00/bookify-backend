import pool from "./../db.js";
import express from "express";

const route = express();

route.get("/lists/:userId/:bookId", async (req, res) => {
    try {
        const { userId, bookId } = req.params;

        const result = await pool.query(
            `SELECT l.*, 
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 FROM livros_em_lista 
                            WHERE id_lista = l.id_lista 
                            AND id_livro = $2
                        ) THEN TRUE 
                        ELSE FALSE 
                    END AS contem_livro
            FROM listas_de_leitura l
            WHERE l.id_usuario = $1`,
            [userId, bookId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar listas de leitura do usuário" });
    }
});

route.get('/lists/:userId', async (req, res) => {
    try {

        const { userId } = req.params;

        const result = await pool.query(
            `SELECT * FROM listas_de_leitura l
            WHERE l.id_usuario = $1
            ORDER BY l.nome_lista
            `,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar listas de leitura do usuário" });
    }
})

route.delete("/lists/:listId/:bookId", async (req, res) => {
    try {
        const { listId, bookId } = req.params;

        // Inicia uma transação para garantir consistência no banco
        await pool.query("BEGIN");

        const deleteResult = await pool.query(
            "DELETE FROM livros_em_lista WHERE id_lista = $1 AND id_livro = $2 RETURNING *",
            [listId, bookId]
        );

        if (deleteResult.rowCount === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "Livro não encontrado na lista" });
        }

        await pool.query(
            "UPDATE listas_de_leitura SET quantidade_livros = GREATEST(quantidade_livros - 1, 0) WHERE id_lista = $1",
            [listId]
        );

        // Finaliza a transação
        await pool.query("COMMIT");

        res.status(200).json({ message: "Livro removido da lista com sucesso" });
    } catch (err) {
        await pool.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ message: "Erro ao remover o livro da lista" });
    }
});

route.post("/create-list", async (req, res) => {
    try {
        const { name, userId } = req.body;

        const result = await pool.query(
            `INSERT INTO listas_de_leitura (id_usuario, nome_lista, quantidade_livros) 
            VALUES ($1, $2, DEFAULT) RETURNING *`,
            [userId, name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar listas de leitura do usuário" });
    }
});

route.post("/add-book-list", async (req, res) => {
    try {
        const { idList, idBook } = req.body;

        await pool.query(
            "INSERT INTO livros_em_lista (id_lista, id_livro) VALUES ($1, $2) RETURNING *",
            [idList, idBook]
        );

        await pool.query(`
            UPDATE listas_de_leitura
            SET quantidade_livros = quantidade_livros + 1
            WHERE id_lista = $1
        `, [idList]);

        res.status(201).json({ message: "Livro adicionado com sucesso na lista!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar listas de leitura do usuário" });
    }
});

export default route;
