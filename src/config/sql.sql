CREATE DATABASE IF NOT EXISTS casa_mais_trab;
-- 7. Tabela assistidas
CREATE TABLE IF NOT EXISTS assistidas (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL COMMENT 'Nome completo da assistida',
  cpf varchar(20) COMMENT 'CPF da assistida',
  rg varchar(20) COMMENT 'RG da assistida',
  idade int COMMENT 'Idade da assistida',
  data_nascimento date COMMENT 'Data de nascimento',
  nacionalidade varchar(100) COMMENT 'Nacionalidade',
  estado_civil varchar(100) COMMENT 'Estado civil',
  profissao varchar(100) COMMENT 'Profissão atual ou anterior',
  escolaridade varchar(100) COMMENT 'Nível de escolaridade',
  status varchar(50) COMMENT 'Status atual (ex: Ativa, Em Tratamento)',
  logradouro varchar(255) COMMENT 'Rua/Avenida',
  bairro varchar(255) COMMENT 'Bairro de residência',
  numero varchar(20) COMMENT 'Número da residência',
  cep varchar(20) COMMENT 'CEP',
  estado varchar(2) COMMENT 'UF (ex: SP, MG)',
  cidade varchar(100) COMMENT 'Cidade',
  telefone varchar(20) COMMENT 'Telefone principal',
  telefone_contato varchar(20) COMMENT 'Telefone de contato alternativo',

  createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Data de criação do registro',
  updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT 'Última atualização do registro',
  PRIMARY KEY (id),
  UNIQUE KEY cpf (cpf),
  KEY nome (nome),
  KEY status (status),
  KEY cidade (cidade),
  KEY estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS substancias (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL COMMENT 'Nome da substância psicoativa',
  categoria VARCHAR(100) COMMENT 'Categoria: depressor, estimulante, perturbador, etc.',
  descricao TEXT COMMENT 'Observações adicionais sobre a substância',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_nome_substancia (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS assistida_substancia (
  id INT NOT NULL AUTO_INCREMENT,
  assistida_id INT NOT NULL COMMENT 'FK para a assistida',
  substancia_id INT NOT NULL COMMENT 'FK para a substância',
  data_inicio DATE COMMENT 'Data de início do uso',
  data_fim DATE COMMENT 'Data de fim do uso (se houver)',
  observacoes TEXT COMMENT 'Observações adicionais sobre o uso',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Data de criação do registro',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT 'Última atualização do registro',
  PRIMARY KEY (id),
  UNIQUE KEY uq_assistida_substancia (assistida_id, substancia_id), -- evita duplicidade
  CONSTRAINT fk_assistida FOREIGN KEY (assistida_id) REFERENCES assistidas(id) ON DELETE CASCADE,
  CONSTRAINT fk_substancia FOREIGN KEY (substancia_id) REFERENCES substancias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 11. Tabela consultas (com FK para assistidas)
CREATE TABLE IF NOT EXISTS consultas (
  id int NOT NULL AUTO_INCREMENT,
  assistida_id int DEFAULT NULL,
  data_consulta date NOT NULL,
  hora_consulta time NOT NULL,
  medico varchar(255) NOT NULL,
  especialidade varchar(100) DEFAULT NULL,
  observacoes text DEFAULT NULL,
  status enum('agendada','realizada','cancelada') NOT NULL DEFAULT 'agendada',
  data_cadastro timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_consultas_assistida_id (assistida_id),
  KEY data_consulta (data_consulta),
  KEY status (status),
  CONSTRAINT fk_consultas_assistida FOREIGN KEY (assistida_id) REFERENCES assistidas (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


USE casa_mais_trab;

-- Populando assistidas
INSERT INTO assistidas (nome, cpf, rg, idade, data_nascimento, nacionalidade, estado_civil, profissao, escolaridade, status, logradouro, bairro, numero, cep, estado, cidade, telefone, telefone_contato)
VALUES
('Maria da Silva', '123.456.789-00', '12.345.678-9', 35, '1990-05-12', 'Brasileira', 'Solteira', 'Costureira', 'Ensino Médio', 'Ativa', 'Rua das Flores', 'Centro', '123', '87000-000', 'PR', 'Maringá', '(44)99999-1111', '(44)98888-2222'),
('Ana Pereira', '987.654.321-00', '98.765.432-1', 42, '1983-03-25', 'Brasileira', 'Casada', 'Cozinheira', 'Ensino Fundamental', 'Em Tratamento', 'Av. Brasil', 'Zona Norte', '456', '87010-000', 'PR', 'Maringá', '(44)97777-3333', '(44)96666-4444'),
('Joana Souza', '111.222.333-44', '55.666.777-8', 28, '1997-11-10', 'Brasileira', 'Divorciada', 'Auxiliar de Limpeza', 'Ensino Médio', 'Ativa', 'Rua São Paulo', 'Vila Operária', '789', '87020-000', 'PR', 'Londrina', '(43)95555-5555', '(43)94444-6666');

-- Populando substancias
INSERT INTO substancias (nome, categoria, descricao)
VALUES
('Álcool', 'Depressor', 'Bebida alcoólica, consumo recreativo e social'),
('Cocaína', 'Estimulante', 'Substância psicoestimulante de alto potencial de dependência'),
('Maconha', 'Perturbador', 'Cannabis, uso recreativo e medicinal');

-- Populando tabela associativa (assistidas x substancias)
INSERT INTO assistida_substancia (assistida_id, substancia_id, data_inicio, data_fim, observacoes)
VALUES
(1, 1, '2010-01-01', NULL, 'Consumo frequente em festas'),
(1, 3, '2015-06-01', NULL, 'Uso recreativo ocasional'),
(2, 2, '2005-08-15', '2020-05-10', 'Interrompeu após tratamento'),
(3, 1, '2018-02-20', NULL, 'Uso social moderado');

-- Populando consultas
INSERT INTO consultas (assistida_id, data_consulta, hora_consulta, medico, especialidade, observacoes, status)
VALUES
(1, '2025-09-05', '14:30:00', 'Dr. Carlos Mendes', 'Psiquiatria', 'Avaliação inicial', 'agendada'),
(2, '2025-09-10', '09:00:00', 'Dra. Fernanda Alves', 'Clínica Geral', 'Acompanhamento pós-tratamento', 'agendada'),
(3, '2025-08-20', '16:00:00', 'Dr. João Ribeiro', 'Psicologia', 'Consulta de rotina', 'realizada');
