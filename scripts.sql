-- Comandos para criação das tabelas

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS autores (
    id_autor VARCHAR PRIMARY KEY,
    nome VARCHAR NOT NULL,
    pais_origem VARCHAR NOT NULL,
    nascimento DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS livros (
    id_livro VARCHAR PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    capa_url VARCHAR NOT NULL,
    genero VARCHAR NOT NULL,
     ano_publicacao DATE NOT NULL,
    autor_id VARCHAR REFERENCES autores(id_autor) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listas_de_leitura (
    id_lista SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    quantidade_livros INTEGER DEFAULT 0,
    nome_lista VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS livros_em_lista (
    id_lista INTEGER REFERENCES listas_de_leitura(id_lista),
    id_livro INTEGER REFERENCES livros(id_livro) ON DELETE CASCADE,
    PRIMARY KEY (id_lista, id_livro)
);

-- A partir daqui eu não usei no Projeto

CREATE TABLE IF NOT EXISTS emprestimos (
    id_emprestimo SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    livro_id INTEGER REFERENCES livros(id_livro) ON DELETE CASCADE,
    data_emprestimo TIMESTAMP DEFAULT NOW(),
    data_prevista TIMESTAMP NOT NULL,
    data_devolucao TIMESTAMP
);

CREATE TABLE IF NOT EXISTS multas (
    id_multa SERIAL PRIMARY KEY,
    emprestimo_id INTEGER REFERENCES emprestimos(id_emprestimo) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    data_pagamento TIMESTAMP
);

CREATE TABLE IF NOT EXISTS avaliacoes (
    id_avaliacao SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    livro_id INTEGER REFERENCES livros(id_livro) ON DELETE CASCADE,
    nota INTEGER CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS amigos (
    id_amizade SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    amigo_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    data_solicitacao TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) CHECK (status IN ('pendente', 'aceito', 'rejeitado'))
);


-- Comandos de inserção

INSERT INTO livros (id_livro, titulo, capa_url, genero, ano_publicacao, autor_id) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id_livro) DO NOTHING

INSERT INTO usuarios(nome, email, genero_preferido) VALUES($1, $2, $3)

INSERT INTO autores (id_autor, nome, pais_origem, nascimento) VALUES ($1, $2, $3, $4) ON CONFLICT (id_autor) DO NOTHING

INSERT INTO listas_de_leitura (id_usuario, nome_lista, quantidade_livros) VALUES ($1, $2, DEFAULT) RETURNING *

INSERT INTO livros_em_lista (id_lista, id_livro) VALUES ($1, $2) RETURNING *

INSERT INTO amigos (usuario_id, amigo_id, data_solicitacao, status) VALUES ($1, $2, NOW(), $3);

INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario, data_avaliacao) VALUES ($1, $2, $3, $4, NOW());

INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_prevista) VALUES ($1, $2, NOW(), $3);

INSERT INTO multas (emprestimo_id, valor, data_pagamento) VALUES ($1, $2, $3);

-- Comandos de Consulta (Querys)

-- Fiz uso no projeto. Para obter todos os livros com os dados do Autor
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

-- Fiz uso no projeto. Para obter os dados do livro e autor com base no ID do livro
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
WHERE livros.id_livro = $1 -- Onde $1 é o ID do livro

-- Fiz uso no projeto. Para obter todas as listas de leitura de um usuário e retornar um booleano 'contem_livro' se caso o livro existir nessa lista
SELECT l.*, 
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM livros_em_lista 
                WHERE id_lista = l.id_lista 
                AND id_livro = $2 -- Onde $2 é o ID do livro
            ) THEN TRUE 
            ELSE FALSE 
        END AS contem_livro
FROM listas_de_leitura l
WHERE l.id_usuario = $1 -- Onde $1 é o ID do usuário

-- Fiz uso no projeto. Para obter todas as listas de um usuário e ordenar as listas em ordem crescente pelo nome 
SELECT * FROM listas_de_leitura l
WHERE l.id_usuario = $1
ORDER BY l.nome_lista

-- Fiz uso no projeto. Para simular um sistema de login, se caso o e-mail existir efetua o login.
SELECT * FROM usuarios 
WHERE email = $1 -- Onde $1 é o e-mail do usuário

-- Não fiz uso no projeto, mas é interessante. Consulta para retornar os livros dos autores naturais de um cujo País
SELECT l.id_livro, l.titulo, a.nome AS autor, a.pais_origem AS país
FROM livros l
JOIN autores a ON l.autor_id = a.id_autor
WHERE a.pais_origem = $1; -- $1 é a string que guarda o nome do País

-- Não fiz uso no projeto, mas é interessante. Consulta para retornar todos os livros e seus respectivos autores ordenados por País.
SELECT a.pais_origem AS país, l.titulo, a.nome AS autor
FROM livros l
JOIN autores a ON l.autor_id = a.id_autor
ORDER BY a.pais_origem;

-- Não fiz uso no projeto, mas é interessante. Consulta para retornar os livros mais bem avaliados
SELECT 
    l.id_livro, 
    l.titulo, 
    a.nome AS autor, 
    ROUND(AVG(av.nota), 2) AS media_avaliacao,
    COUNT(av.id_avaliacao) AS total_avaliacoes
FROM livros l
JOIN autores a ON l.autor_id = a.id_autor
JOIN avaliacoes av ON l.id_livro = av.livro_id
GROUP BY l.id_livro, l.titulo, a.nome
HAVING AVG(av.nota) >= 4.5
ORDER BY media_avaliacao DESC, total_avaliacoes DESC;