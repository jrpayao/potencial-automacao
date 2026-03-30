# GUIA DE PROCEDIMENTOS DE DIAGRAMAÇÃO E DICIONARIZAÇÃO DE DADOS

**DETRAN DF | Extreme Digital Solutions**

**Versão 2.1 — 22/08/2023**

---

## Sumário

1. [Apresentação](#2-apresentação)
2. [Diagramação](#3-diagramação)
   - [Diagramas](#31-diagramas)
   - [Formatação](#32-formatação)
   - [Apresentação de Tabela](#33-apresentação-de-tabela)
3. [Dicionarização de Dados](#4-dicionarização-de-dados)
   - [Descrição de Objetos](#41-descrição-de-objetos)
   - [Padrão de Nomeação de Objetos](#42-padrão-de-nomeação-de-objetos)
4. [Melhores Práticas](#5-melhores-práticas)
   - [LOG, Histórico, Trilha de Auditoria](#51-log-histórico-trilha-de-auditoria)
   - [Domínio e Check Constraint de Coluna](#52-domínio-e-check-constraint-de-coluna)
   - [Sequences](#53-sequences)
   - [Índices](#54-índices)

---

## Histórico das Alterações

| Versão | Data | Alteração | Autor |
|---|---|---|---|
| Preliminar 1.0 | 31/01/2023 | Elaboração da primeira versão do Guia | Extreme Digital Solutions – EDS |
| 2.0 | 26/07/2023 | Inclusão de Melhores Práticas de Modelagem. Inclusão de orientações sobre nomeação de colunas. | Extreme Digital Solutions – EDS |
| 2.1 | 22/08/2023 | Revisão das classes de atributos | Extreme Digital Solutions – EDS |

---

## 2. Apresentação

O Guia de Procedimentos de Diagramação e Dicionarização de Dados contém orientações e regras para a elaboração de diagramas de modelagem de dados, nomeação, conceituação e descrição dos objetos físicos de banco de dados, bem como melhores práticas de modelagem de dados.

---

## 3. Diagramação

O modelo de dados é a ferramenta que permite a visualização de estruturas de banco de dados e seus relacionamentos. Faz parte da documentação imprescindível para a boa gestão de dados.

Por intermédio de diagramas, as equipes de desenvolvimento, a administração de dados e de banco de dados, áreas gestoras e demais interessados tem a possibilidade de conhecer os dados da organização e como se relacionam. O grau de facilidade ou de dificuldade para a compreensão do modelo é diretamente proporcional à qualidade da organização dos objetos nos diagramas. Com o objetivo de garantir uma boa qualidade de organização, é necessário definir regras e orientações de boas práticas na elaboração do modelo de dados.

É aconselhável que as equipes de desenvolvimento, responsáveis pela elaboração dos modelos dados, definam previamente com a administração de dados do DETRAN-DF os padrões para os novos modelos e os modelos legados.

Para as imagens dos exemplos apresentados neste Guia, foram utilizadas as ferramentas de modelagem de dados **Power Designer** e **Oracle SQL Data Modeler**.

### 3.1. Diagramas

A utilização de diagramas segmentados por critérios previamente convencionados permite, para análise do contexto das estruturas definidas, reduzir o escopo e, consequentemente, facilitar a correlação entre o negócio e seus dados. Todavia, aconselha-se que sempre seja criado um diagrama com todas as estruturas do modelo de dados.

> **Nota:** Os exemplos visuais de diagramas no Power Designer e Data Modeler estão disponíveis no documento PDF original (páginas 5–7).

A disposição espacial das tabelas deve privilegiar a clareza do modelo de dados. Nesse sentido, deve-se evitar a sobreposição de tabelas e o cruzamento entre os relacionamentos.

O primeiro diagrama deve conter a visão geral do modelo de dados, os demais diagramas devem ser elaborados por assuntos de forma a facilitar o entendimento da finalidade de cada subconjunto de estruturas e suas relações.

### 3.2. Formatação

O uso de cores específicas para identificar tipos de tabelas (negócio, domínio, cadastro) e de fontes, cores e realces (negrito, sublinhado) diferenciados para caracterizar colunas facilitam o entendimento da finalidade de cada objeto e de suas características.

A seguir, sugestões de padrões de cores e realces para a adoção pela administração de dados, que mantém os modelos dos esquemas existentes nos bancos de dados, e pelas equipes de desenvolvimento, que elaboram os modelos de dados:

#### 3.2.1. Tabela de Negócio

**Cor Padrão:** Azul claro

> Exemplo: Tabela `VE_AVERBACAO` com colunas como `VE_CHASSI`, `VE_AVB_SEQ`, `VE_AVB_TIPO`, etc.

#### 3.2.2. Tabela de Domínio

**Cor Padrão:** Verde

> Exemplo: Tabela `VE_CATEG` com colunas como `VE_COD_CATEG`, `VE_NOME_CATEG`, `VE_DESCR_CATEG`, etc.

#### 3.2.3. Tabela de LOG e de Controle

**Cor Padrão:** Marrom

> Exemplo: Tabela `VE_APR_P_LOG` com colunas como `COD_TABELA`, `NOM_OPERADOR`, `NOM_FUNCAO`, `TIP_OPERACAO`, `DAT_OCORRENCIA`, etc.

#### 3.2.4. Tabela externa

**Cor Padrão:** Branca

> Exemplo: Tabela `VE_TIPFA` com colunas como `VE_COD_TPFAB`, `VE_NOME_TPFAB`, `VE_ABREV_TPFAB`.

#### 3.2.5. View

**Cor Padrão:** Cinza

> Exemplo: View `MV_SV_TIPO_ATIVIDADE_ORGAO` com colunas como `CHVORG`, `CHVTPATVORG`, `SGL_ATIVIDADE`, etc.

#### 3.2.6. Chave Primária

Nas colunas que compõem chaves primárias, **sublinhar** (Power Designer) ou configurar a marcação **"P"** (Data Modeler).

> Exemplo: Na tabela `VE_LACRE`, a coluna `SEQUENCIAL` é chave primária (sublinhada / marcada com "P").

#### 3.2.7. Chave Estrangeira

Nas colunas que compõem chaves estrangeiras, configurar a indicação de **`<FKn>`** para o Power Designer ou **"F"** para o Data Modeler.

> Exemplo: Na tabela `TB_TRANSFERENCIA`, colunas como `COD_COMPRADOR`, `COD_VENDEDOR`, `ID_MODALIDADE` são marcadas com `<fk1>`, `<fk2>`, etc.

### 3.3. Apresentação de Tabela

Em todos os diagramas, as tabelas devem ser apresentadas com as características de obrigatoriedade/opcionalidade das colunas e com os índices:

- **Power Designer:** `not null`/`null` e `<i>`
- **Data Modeler:** um pequeno círculo vermelho para obrigatoriedade; não há marcação visual para colunas que compõem índices

---

## 4. Dicionarização de Dados

A dicionarização dos dados dos esquemas existentes do DETRAN-DF compreende a conceituação e a documentação dos metadados dos objetos e sub-objetos implementados no banco de dados.

É importante a definição de um padrão de nomenclatura que permita identificação ágil dos objetos físicos do banco de dados e a compreensão de sua aplicabilidade.

### 4.1. Descrição de Objetos

A descrição deve refletir o conceito do objeto dentro do contexto negocial. Deve ser clara e sintetizar a finalidade, sem ambiguidade e de acordo com as regras negociais. Termos em língua estrangeira devem ser evitados. Os termos negociais, quando de conhecimento restrito, devem ser acompanhados por significação que auxilie a compreensão por usuários não especializados.

### 4.2. Padrão de Nomeação de Objetos

A seguir são apresentados os padrões a serem adotados para a nomeação dos objetos de bancos de dados. Importante ressaltar que, para sistemas legados, o uso do padrão de nomenclatura deve ser tratado considerando uma análise de impacto.

#### 4.2.1. Tabela e View

Os nomes de tabelas e views são compostos por uma sigla de três letras correspondente ao esquema, duas letras que identificam o tipo de objeto e termos que identifiquem a finalidade do objeto. O termo principal deve ser um substantivo e, se necessário, os demais termos o especificam e complementam.

As siglas dos esquemas devem ser submetidas à administração de dados do DETRAN-DF para homologação.

**Regra de nomeação física:**

```
XXXYYnnn_termo1_termo2_termoN
```

Onde:

- **XXX** é a sigla do esquema
- **YY** é `TB` para tabela, `VW` para view, `VM` para view materializada
- **nnn** é um número sequencial único para cada tipo de objeto
- **termos** são os nomes que definem o objeto

O conjunto `XXXYYnnn` representa o código do objeto. O tamanho do nome físico deve ser restrito ao definido no SGBD.

**Exemplos:**

```
VEITB001_VEICULO
VEITB002_VAGA_SELO
VEITB003_TRANSFERENCIA_VEICULO
HABTB001_HABILITACAO
HABTB002_RESULTADO_EXAME
INFTB001_NOTIFICACAO_INFRACAO
INFTB002_BOLETO_INFRAÇÃO
FINTB001_PAGAMENTO_MULTA
VEIVW001_VEICULO_PROPRIETARIO_UNICO
FINVM001_PAGAMENTO_ATRASO_MULTA
```

No caso de modelos de dados legados, deve-se avaliar se há padrão de nomeação de tabelas e views. Caso seja identificado um padrão que permita a identificação do objeto, termos que contenham informação inteligível, deve-se mantê-lo.

#### 4.2.2. Coluna

Deve ser composta por uma sigla referente à classe do dado e termos que definam o dado. O termo principal é um substantivo e os demais o especificam. A significação da sigla não deve ser utilizada como um dos termos da nomeação.

**Classes permitidas:**

| Classe | Definição | Exemplos |
|---|---|---|
| **DT** | Representação de data e hora | `DT_VENCIMENTO_IPVA`, `DT_APREENSAO_VEICULO`, `DT_VISTORIA_VEICULO` |
| **DE** | Texto livre para descrever características, detalhes de algum objeto negocial ou uma situação (observações, informações complementares, localizações de eventos, descrição de fatos negociais). Não deve ser utilizado como nomeação de objetos negociais. | `DE_OBSERVACAO_VISTORIA`, `DE_LOCAL_INFRACAO`, `DE_COLISAO_VEICULO` |
| **NO** | Nomeação de pessoas, de objetos negociais. O nome tem significado negocial (cor, tipo de combustível, tipo de vistoria, nome do condutor). É utilizada para nomeação de dados pré-definidos. | `NO_TIPO_COR`, `NO_TIPO_APREENSAO`, `NO_TIPO_VISTORIA`, `NO_ORGAO_FISCALIZACAO`, `NO_CONDUTOR_VEICULO`, `NO_PROPIETARIO_VEIVULO` |
| **IC** | Indicador de valores binários (Sim/Não, Ativo/Inativo). | `IC_SITUACAO_CATALOGO_SERVICO`, `IC_VEICULO_APREENDIDO` |
| **SG** | Representa a abreviação do nome de algum dado negocial (sigla de órgão, Unidade da Federação). | `SG_ORGAO_VISTORIA`, `SG_UNIDADE_FEDERACAO` |
| **TS** | Representa data e horário com precisão até milissegundo. Utilizado quando é necessário registrar transações cujo milissegundo é relevante para a diferenciação de outras ocorrências (transações massivas de banco de dados — inserts e updates). | `TS_LOG_ATUALIZACAO_REGISTRO`, `TS_ANDAMENTO_PROCESSO`, `TS_PAGAMENTO_PARCELA_IPVA` |
| **VR** | Valor monetário ou fracionário (taxas, índices). Não deve ser utilizado para representar outras grandezas como quantidade, comprimento, largura, altura. | `VR_PARCELA_IPVA`, `VR_COMPRA_VEICULO`, `VR_SELIC`, `VR_IGPM` |
| **NU** | Utilizada para dados com identificação específica de objetos ou atores negociais. | `NU_RENAVAM`, `NU_REGISTRO_GERAL_CONDUTOR`, `NU_MATRICULA_VISTORIADOR` |
| **CO** | Código de identificação de dados. O valor tem significado negocial, ou seja, os objetos negociais têm valor padronizado interna e externamente à organização. Indicada também para dados reutilizados em outros esquemas. | `CO_PROTOCOLO_PROCESSO`, `CO_CHASSI`, `CO_TIPO_ESTADO_CIVIL`, `CO_MUNICIPIO` |
| **ID** | Utilizada para identificar dados controlados por sequences. Conhecida também como "chave-burra", ou seja, chave primária sem valor negocial. | `ID_ANDAMENTO_PROCESSO`, `ID_APREENSAO_VEICULO` |

A nomeação das colunas deve ser composta, em regra, da classe (conforme o tipo de dado), de um termo principal (núcleo no conceito do objeto e relação direta com a classe) e de um ou mais termos que complementem o substantivo.

**Exemplos de composição:**

- `CO_USUARIO_ATUALIZACAO_VEICULO`: **CO** (classe: código) + **USUARIO** (núcleo no conceito do objeto e tem relação direta com a classe) + **ATUALIZACAO_VEICULO**
- `IC_MOVIMENTACAO_PAGAMENTO_VALIDADA`: **IC** (classe: indicador, flag) + **MOVIMENTACAO** (núcleo) + **PAGAMENTO_VALIDADA**
- `NU_DOCUMENTO_CONDUTOR`: **NU** (classe: número) + **DOCUMENTO** (núcleo) + **CONDUTOR**

No caso de novas colunas em modelos de dados legados, deve-se avaliar a utilização das classes. Se houver algum padrão, é aconselhável mantê-lo. Por exemplo: há esquemas que utilizam as classes `COD`, `TXT`, `ID`, `DT`, entre outros, logo, as novas colunas devem seguir o padrão.

Deve-se estabelecer claramente a fronteira entre os objetos legados e os novos objetos. No caso dos objetos existentes em banco de dados e, consequentemente, em uso pelos sistemas, a padronização pode ser realizada nos campos destinados aos nomes lógicos dos objetos. No caso do Power Designer, o campo **NAME** nas propriedades de tabelas e colunas. Nesses casos, a padronização ficará restrita ao dicionário de dados e as nomenclaturas dos objetos em banco de dados permanecerá inalterada.

#### 4.2.3. Constraint de Foreign Key

**Regra:** `FK_<código da tabela pai>_<código da tabela filha>`

**Exemplo:** Constraint entre as tabelas `VEITB001_VEICULO` (PAI) e `VEITB002_VAGA_SELO` (FILHA) → `FK_VEITB002_VEITB001`

#### 4.2.4. Índice

**Regra:** `IN_<código da tabela>_nn` (onde `nn`: número sequencial único)

**Exemplos:** `IN_VEITB001_01`, `IN_VEITB001_02`

#### 4.2.5. Sequence

**Regra:** `XXXSQnnn_<nome da tabela>`

**Exemplo:** `VEISQ001_VEICULO`

#### 4.2.6. Check Constraint

**Regra:** `CC_<código da tabela>_nn` (onde `nn`: número sequencial único)

**Exemplos:** `CC_VEITB001_01`, `CC_VEITB001_02`

#### 4.2.7. Alternate Key

**Regra:** `AK_<código da tabela>_nn` (onde `nn`: número sequencial único)

**Exemplos:** `AK_VEITB001_01`, `AK_VEITB001_02`

#### 4.2.8. Primary Key

**Regra:** `PK_<código da tabela>`

**Exemplo:** `PK_VEITB001`

#### 4.2.9. Trigger

**Regra:** `TG_<código da tabela>_nn` (onde `nn`: número sequencial único)

**Exemplo:** `TG_VEITB001_01`

---

## 5. Melhores Práticas

### 5.1. LOG, Histórico, Trilha de Auditoria

As tabelas de LOG, de Histórico e de Trilha de Auditoria se distinguem principalmente por seus objetivos e enfoques específicos em diferentes conjuntos de dados.

- **Tabela de LOG:** Utilizada para registrar as transações realizadas no banco de dados, com o propósito de auditoria e rastreamento das atividades. Auxilia a gestão do negócio a rastrear "quem fez o quê e quando".
- **Tabelas de Histórico:** Concentram-se na evolução dos dados ao longo do tempo, sendo essencialmente uma cronologia das alterações ocorridas. Data e hora são elementos centrais na estrutura dessas tabelas.
- **Trilha de Auditoria:** Registra as operações executadas em várias tabelas do banco de dados, destinando-se especialmente à auditoria interna e externa, frequentemente atendendo a requisitos legais. Geralmente, têm restrições de acesso.

#### 5.1.1. LOG

O LOG pode ser registrado em tabela específica para o armazenamento de todas as alterações nos dados da tabela principal e/ou em um conjunto de colunas na tabela principal para registrar somente a última operação efetuada.

Os dados são utilizados eventualmente para rastreamento de operações no banco de dados. Em regra, utiliza-se o timestamp para ter mais precisão do momento da operação. Além da data e hora, registra-se quem fez, o que foi feito (DE-PARA dos dados), de onde foi feito, o tipo da alteração, entre outras informações definidas pelo gestor do negócio.

Caso a opção seja por uma tabela específica, é recomendável que não haja check constraints de coluna, exceto para o tipo de operação (inclusão, exclusão, alteração), nem relacionamentos, inclusive com a tabela principal.

##### 5.1.1.1. Tabela Específica

Exemplo de modelagem com tabela de LOG separada:

**Tabela principal:** `VEITB001_VEICULO`

| Coluna | Tipo | Restrição |
|---|---|---|
| `CO_CHASSI` | VARCHAR2(50) | PK, NOT NULL |
| `NU_RENAVAM` | VARCHAR2(11) | AK, NULL |
| `NU_MARCA_VEICULO` | NUMBER(3) | FK, NOT NULL |
| `AA_FABRICACAO_VEICULO` | NUMBER(4) | NOT NULL |
| `DT_EMPLACAMENTO_VEICULO` | DATE | NOT NULL |
| `VR_FIPE_ATUAL` | NUMBER(10,2) | NOT NULL |
| `DE_LAUDO_VISTORIA` | CLOB | NULL |
| `IC_IPVA_PAGO` | CHAR(1) | NOT NULL |
| `NO_PROPRIETARIO_VEICULO` | VARCHAR2(100) | NOT NULL |
| `SG_UF_EMPLACAMENTO` | CHAR(2) | NOT NULL |
| `TS_ATUALIZACAO_REGISTRO` | TIMESTAMP | NOT NULL |

**Tabela de LOG:** `VEITB001_VEICULO_LOG`

| Coluna | Tipo | Restrição |
|---|---|---|
| `TS_ATUALIZACAO_REGISTRO` | TIMESTAMP | PK, NOT NULL |
| `CO_CHASSI` | VARCHAR2(50) | NOT NULL |
| `NU_MARCA_VEICULO` | NUMBER(3) | NOT NULL |
| `AA_FABRICACAO_VEICULO` | NUMBER(4) | NOT NULL |
| `DT_EMPLACAMENTO_VEICULO` | DATE | NOT NULL |
| `VR_FIPE_ATUAL` | NUMBER(10,2) | NOT NULL |
| `DE_LAUDO_VISTORIA` | CLOB | NULL |
| `IC_IPVA_PAGO` | CHAR(1) | NOT NULL |
| `NO_PROPRIETARIO_VEICULO` | VARCHAR2(100) | NOT NULL |
| `SG_UF_EMPLACAMENTO` | CHAR(2) | NOT NULL |
| `CO_OPERADOR` | — | NULL |
| `CO_APLICACAO` | — | NULL |
| `CO_ESTACAO_TRABALHO` | — | NULL |
| `IC_OPERACAO` | — | NULL |

##### 5.1.1.2. Colunas na tabela principal

Nesta abordagem, as colunas de LOG são adicionadas diretamente à tabela principal (`TS_ATUALIZACAO_REGISTRO`, `CO_OPERADOR`, `CO_APLICACAO`, `CO_ESTACAO_TRABALHO`, `IC_OPERACAO`). Somente é possível o registro da **última operação**.

#### 5.1.2. Histórico

Tabelas de Histórico armazenam o registro cronológico de determinados eventos do sistema ao longo do tempo. Possuem um volume de acessos superior ao LOG devido ao fato de serem desenvolvidas para atender às necessidades específicas de aplicações que consomem esses dados históricos. Isso implica que essas tabelas são amplamente utilizadas no cotidiano do sistema, proporcionando informações históricas valiosas para a gestão do negócio.

Ao contrário de tabelas de LOG, deve-se definir **relacionamentos e restrições de coluna** específicos, alinhados com as regras de negócio e os requisitos de integridade dos dados.

Na modelagem, é importante considerar a necessidade de **otimização e indexação adequada** para suportar consultas frequentes sobre essas tabelas, especialmente em ambientes com grande quantidade de dados históricos.

**Exemplo:**

- `VEITB001_VEICULO` (principal) → `VEITB002_VEICULO_IPVA` (histórico de IPVA, PK composta: `CO_CHASSI` + `AA_IPVA` + `MM_PARCELA_IPVA`)
- `VEITB001_VEICULO` (principal) → `VEITB003_MODIFICACAO_VEICULO` (histórico de modificações, PK composta: `CO_CHASSI` + `DT_SOLICITACAO_MODIFICACAO`)

#### 5.1.3. Trilha de Auditoria

A trilha de auditoria de banco de dados é uma modelagem de dados com o objetivo de segurança e controle, envolvendo o monitoramento e o registro minucioso das atividades ocorridas no banco de dados. Registram operações como inclusões, alterações, exclusões e, dependendo da necessidade, consultas executadas nas tabelas do banco de dados.

Assegura a conformidade com políticas de segurança, regulamentações e requisitos legais. Ao possibilitar uma visão completa das ações realizadas por usuários e aplicativos, a trilha de auditoria permite que administradores do banco de dados e auditores detectem atividades suspeitas, violações de segurança ou acessos não autorizados. Subsidia investigações relacionadas a incidentes de segurança ou violações de dados.

**Exemplo de modelagem:**

- `VEITB011_APLICACAO_SISTEMA` (PK: `CO_APLICACAO_SISTEMA`)
- `VEITB012_USUARIO_SISTEMA` (PK: `CO_USUARIO_SISTEMA`)
- `VEITB010_TRILHA_AUDITORIA` (PK: `CO_SEQUENCIAL_TRILHA_AUDITORIA`, FK1 → APLICACAO, FK2 → USUARIO)

| Coluna | Tipo | Restrição |
|---|---|---|
| `CO_SEQUENCIAL_TRILHA_AUDITORIA` | NUMBER(38) | PK |
| `CO_APLICACAO_SISTEMA` | NUMBER(10) | FK1 |
| `CO_USUARIO_SISTEMA` | NUMBER(10) | FK2 |
| `TS_ALTERACAO` | TIMESTAMP | — |
| `DE_CONTEUDO_ANTERIOR` | CLOB | — |
| `DE_CONTEUDO_ATUAL` | CLOB | — |
| `IC_OPERACAO` | CHAR(1) | — |
| `CO_TABELA` | VARCHAR2(100) | — |
| `DE_CHAVE_PRIMARIA_TABELA` | VARCHAR2(500) | — |

### 5.2. Domínio e Check Constraint de Coluna

A utilização de **check constraint de coluna** com a lista de valores válidos é recomendável no caso de **dois valores opostos** (SIM e NÃO, ATIVO e INATIVO). Também pode-se definir check constraint de coluna se a lista de valores tiver poucas ocorrências, garantia de estabilidade para evitar manutenções em banco de dados, sem possibilidade de reutilização em outras tabelas.

Para listas de valores que **não sejam opostos**, a utilização de **tabela de domínios** é mais vantajosa:

- Manutenção da lista independente de mudança de banco
- Possibilidade de busca automática dos valores diretamente na tabela pelas aplicações (sem a necessidade de manutenção da aplicação)
- Possibilidade de reutilização da tabela em outros relacionamentos no modelo de dados sem replicação da check constraint (evita valores diferentes nas check constraints replicadas, centraliza as alterações na lista de valores)
- Maior visibilidade da lista de valores (inclusive, do significado de cada valor válido) e das relações no banco de dados

### 5.3. Sequences

A Sequence é um recurso utilizado para gerar valores sequenciais de forma automática. É comumente empregada quando precisamos atribuir valores únicos e crescentes a uma coluna sem significado negocial, como um número de identificação ou código interno.

No entanto, **não é indicada para tabelas de domínio**. As tabelas de domínio geralmente contêm informações importantes e relevantes para o funcionamento das aplicações, e frequentemente utilizamos os valores dessas tabelas (valor da primary key) nas nossas aplicações. Se utilizarmos uma Sequence nesse contexto, os valores gerados serão controlados pelo próprio SGBD e podem divergir entre diferentes ambientes (desenvolvimento, homologação e produção).

**Exemplo do problema:**

Considerando-se uma tabela de Espécies de Veículos com carga original:

```
01 PASSAGEIRO
02 CARGA
03 MISTO
04 COMPETICAO
05 TRACAO
06 ESPECIAL
07 COLECAO
```

Se a tabela for deletada e recriada sem reinicializar a sequence, na nova carga teríamos:

```
08 PASSAGEIRO
09 CARGA
10 MISTO
11 COMPETICAO
12 TRACAO
13 ESPECIAL
14 COLECAO
```

Portanto, se aplicações utilizarem o valor da PK para a execução de algum processamento, o sistema apresentará erro.

**Recomendação:** Para tabelas de domínio, definir manualmente a Primary Key ao inserir os valores, em vez de depender da Sequence.

### 5.4. Índices

#### 5.4.1. Índices Únicos

Índice único tem função semelhante à primary key, ou seja, garante que os valores na coluna (ou conjunto de colunas) sejam únicos para cada linha na tabela. Isso evita a inserção de dados duplicados e ajuda a manter a integridade dos dados.

É recomendável o uso desse recurso em tabelas cuja PK é composta por uma coluna sequencial e sem valor negocial, por exemplo, quando o conteúdo é definido por uma sequence.

#### 5.4.2. Índices de Foreign Key

A foreign key é uma coluna (ou conjunto de colunas) em uma tabela que estabelece uma relação com a chave primária de outra tabela. A definição de um índice em uma coluna de foreign key é recomendada para melhorar o desempenho de operações de junção (JOIN).

Quando uma consulta tem um join entre duas tabelas usando a foreign key, o índice na coluna de foreign key permite que o SGBD localize os registros correspondentes de forma mais rápida e eficiente. Isso acelera a execução da consulta, especialmente em tabelas grandes porque otimiza o plano de execução do SGBD.

Sem a definição do índice em foreign key, o SGBD pode realizar uma varredura completa da tabela referenciada para verificar a existência de valores correspondentes, degradando o desempenho da aplicação.

**Recomendação:** Criar índices apenas em colunas de foreign key quando essas colunas são frequentemente usadas em operações de joins ou quando há uma grande quantidade de dados nas tabelas envolvidas.
