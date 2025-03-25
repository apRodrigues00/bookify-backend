import pool from "../db.js";
import express from "express";

const route = express();

route.post("/create-books", async (req, res) => {
    try {

        await checkTables();

        const autores = [
            { id: '1', nome: 'J.K. Rowling', pais: 'Reino Unido', nascimento: '1965-07-31' },
            { id: '2', nome: 'George Orwell', pais: 'Reino Unido', nascimento: '1903-06-25' },
            { id: '3', nome: 'J.R.R. Tolkien', pais: 'África do Sul', nascimento: '1892-01-03' },
            { id: '4', nome: 'Agatha Christie', pais: 'Reino Unido', nascimento: '1890-09-15' },
            { id: '5', nome: 'Stephen King', pais: 'EUA', nascimento: '1947-09-21' },
            { id: '6', nome: 'Harper Lee', pais: 'EUA', nascimento: '1926-04-28' },
            { id: '7', nome: 'F. Scott Fitzgerald', pais: 'EUA', nascimento: '1896-09-24' },
            { id: '8', nome: 'Isaac Asimov', pais: 'Rússia', nascimento: '1920-01-02' },
            { id: '9', nome: 'Arthur Conan Doyle', pais: 'Reino Unido', nascimento: '1859-05-22' },
            { id: '10', nome: 'Dan Brown', pais: 'EUA', nascimento: '1964-06-22' },
            { id: '11', nome: 'Machado de Assis', pais: 'Brasil', nascimento: '1839-06-21' },
            { id: '12', nome: 'Clarice Lispector', pais: 'Ucrânia', nascimento: '1920-12-10' },
            { id: '13', nome: 'José Saramago', pais: 'Portugal', nascimento: '1922-11-16' },
            { id: '14', nome: 'Victor Hugo', pais: 'França', nascimento: '1802-02-26' },
            { id: '15', nome: 'Dostoiévski', pais: 'Rússia', nascimento: '1821-11-11' }
        ];

        await Promise.all(
            autores.map(async (autor) => {
                const result = await pool.query(
                    "INSERT INTO autores (id_autor, nome, pais_origem, nascimento) VALUES ($1, $2, $3, $4) ON CONFLICT (id_autor) DO NOTHING",
                    [autor.id, autor.nome, autor.pais, autor.nascimento]
                );
                return result.rows[0];
            })
        );

        const livros = [
            { id: '101', titulo: 'Harry Potter e a Pedra Filosofal', capa: 'https://m.media-amazon.com/images/I/41897yAI4LL._SY445_SX342_.jpg', genero: 'Fantasia', ano: '1997-06-26', autor: '1' },
            { id: '102', titulo: '1984', capa: 'https://m.media-amazon.com/images/I/61hAKXNgRpL._SY385_.jpg', genero: 'Ficção Científica', ano: '1949-06-08', autor: '2' },
            { id: '103', titulo: 'O Senhor dos Anéis', capa: 'https://m.media-amazon.com/images/I/41RBd2DvmgL._SY445_SX342_.jpg', genero: 'Fantasia', ano: '1954-07-29', autor: '3' },
            { id: '104', titulo: 'Assassinato no Expresso do Oriente', capa: 'https://m.media-amazon.com/images/I/51fLtg6MDIL._SY445_SX342_.jpg', genero: 'Mistério', ano: '1934-01-01', autor: '4' },
            { id: '105', titulo: 'O Iluminado', capa: 'https://m.media-amazon.com/images/I/51wt58SEkUL._SY445_SX342_.jpg', genero: 'Terror', ano: '1977-01-28', autor: '5' },
            { id: '106', titulo: 'O Sol é Para Todos', capa: 'https://m.media-amazon.com/images/I/51wdOrz6uNL._SY445_SX342_.jpg', genero: 'Drama', ano: '1960-07-11', autor: '6' },
            { id: '107', titulo: 'O Grande Gatsby', capa: 'https://m.media-amazon.com/images/I/41Pvw91bWZL._SY445_SX342_.jpg', genero: 'Romance', ano: '1925-04-10', autor: '7' },
            { id: '108', titulo: 'Eu, Robô', capa: 'https://m.media-amazon.com/images/I/41uH8zurEeL._SY445_SX342_.jpg', genero: 'Ficção Científica', ano: '1950-12-02', autor: '8' },
            { id: '109', titulo: 'Sherlock Holmes: Um Estudo em Vermelho', capa: 'https://m.media-amazon.com/images/I/41XDTiGcN9L._SY445_SX342_.jpg', genero: 'Mistério', ano: '1887-11-01', autor: '9' },
            { id: '110', titulo: 'O Código Da Vinci', capa: 'https://m.media-amazon.com/images/I/41aVasi7pML._SY445_SX342_.jpg', genero: 'Suspense', ano: '2003-03-18', autor: '10' },
            { id: '111', titulo: 'Dom Casmurro', capa: 'https://m.media-amazon.com/images/I/41AYWyc6qmL._SY445_SX342_.jpg', genero: 'Romance', ano: '1899-01-01', autor: '11' },
            { id: '112', titulo: 'A Hora da Estrela', capa: 'https://m.media-amazon.com/images/I/51BofHhKUEL._SX342_SY445_.jpg', genero: 'Ficção', ano: '1977-10-15', autor: '12' },
            { id: '113', titulo: 'Ensaio sobre a Cegueira', capa: 'https://m.media-amazon.com/images/I/41iQySvQq0L._SY445_SX342_.jpg', genero: 'Distopia', ano: '1995-01-01', autor: '13' },
            { id: '114', titulo: 'Os Miseráveis', capa: 'https://m.media-amazon.com/images/I/51UvQ7XBImL._SY445_SX342_.jpg', genero: 'Drama', ano: '1862-04-03', autor: '14' },
            { id: '115', titulo: 'Crime e Castigo', capa: 'https://m.media-amazon.com/images/I/517DdyXpc5L._SY445_SX342_.jpg', genero: 'Drama', ano: '1866-01-01', autor: '15' }
        ];

        await Promise.all(
            livros.map(async (livro) => {
                await pool.query(
                    "INSERT INTO livros (id_livro, titulo, capa_url, genero, ano_publicacao, autor_id) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id_livro) DO NOTHING",
                    [livro.id, livro.titulo, livro.capa, livro.genero, livro.ano, livro.autor]
                );
            })
        );

        await pool.query(
            `INSERT INTO usuarios(nome, email, genero_preferido) VALUES('André Pereira', 'andre@gmail.com', 'Fantasia')`
        );

        res.status(201).json({ message: "Banco populado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao popular banco de dados" });
    }
});

route.post("/update-books", async (req, res) => {
    try {

        const updateBooks = [
            { id: '101', capa: 'https://m.media-amazon.com/images/I/41897yAI4LL._SY445_SX342_.jpg' },
            { id: '102', capa: 'https://m.media-amazon.com/images/I/61hAKXNgRpL._SY385_.jpg' },
            { id: '103', capa: 'https://m.media-amazon.com/images/I/41RBd2DvmgL._SY445_SX342_.jpg' },
            { id: '104', capa: 'https://m.media-amazon.com/images/I/51fLtg6MDIL._SY445_SX342_.jpg' },
            { id: '105', capa: 'https://m.media-amazon.com/images/I/51wt58SEkUL._SY445_SX342_.jpg' },
            { id: '106', capa: 'https://m.media-amazon.com/images/I/51wdOrz6uNL._SY445_SX342_.jpg' },
            { id: '107', capa: 'https://m.media-amazon.com/images/I/41Pvw91bWZL._SY445_SX342_.jpg' },
            { id: '108', capa: 'https://m.media-amazon.com/images/I/41uH8zurEeL._SY445_SX342_.jpg' },
            { id: '109', capa: 'https://m.media-amazon.com/images/I/41XDTiGcN9L._SY445_SX342_.jpg' },
            { id: '110', capa: 'https://m.media-amazon.com/images/I/41aVasi7pML._SY445_SX342_.jpg' },
            { id: '111', capa: 'https://m.media-amazon.com/images/I/41AYWyc6qmL._SY445_SX342_.jpg' },
            { id: '112', capa: 'https://m.media-amazon.com/images/I/51BofHhKUEL._SX342_SY445_.jpg' },
            { id: '113', capa: 'https://m.media-amazon.com/images/I/41iQySvQq0L._SY445_SX342_.jpg' },
            { id: '114', capa: 'https://m.media-amazon.com/images/I/51UvQ7XBImL._SY445_SX342_.jpg' },
            { id: '115', capa: 'https://m.media-amazon.com/images/I/517DdyXpc5L._SY445_SX342_.jpg' }
        ];


        await Promise.all(
            updateBooks.map(async (livro) => {
                await pool.query(
                    "UPDATE livros SET capa_url = $1 WHERE id_livro = $2",
                    [livro.capa, livro.id]
                );
            })
        );

        res.status(200).json({ message: "Capa dos livros atualizada com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao atualizar as capas dos livros" });
    }
});

async function checkTables() {
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                genero_preferido VARCHAR(100) NOT NULL,
                criado_em TIMESTAMP DEFAULT NOW()
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS autores (
                id_autor VARCHAR PRIMARY KEY,
                nome VARCHAR NOT NULL,
                pais_origem VARCHAR NOT NULL,
                nascimento DATE NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS livros (
                id_livro VARCHAR PRIMARY KEY,
                titulo VARCHAR NOT NULL,
                capa_url VARCHAR NOT NULL,
                genero VARCHAR NOT NULL,
                ano_publicacao DATE NOT NULL,
                autor_id VARCHAR REFERENCES autores(id_autor) ON DELETE CASCADE
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS listas_de_leitura (
                id_lista SERIAL PRIMARY KEY,
                id_usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                quantidade_livros INTEGER DEFAULT 0,
                nome_lista VARCHAR(255),
                data_criacao TIMESTAMP DEFAULT NOW()
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS livros_em_lista (
                id_livro_lista SERIAL PRIMARY KEY,
                id_lista INTEGER REFERENCES listas_de_leitura(id_lista),
                id_livro VARCHAR REFERENCES livros(id_livro) ON DELETE CASCADE,
                data_criacao TIMESTAMP DEFAULT NOW()
            );
        `);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default route;
