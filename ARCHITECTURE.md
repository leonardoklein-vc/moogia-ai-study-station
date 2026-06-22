# 🏗️ Documento de Arquitetura de Software — MoogIA

Este documento detalha as decisões técnicas, padrões de projeto e escolhas arquitetônicas implementadas no **MoogIA**, uma plataforma EdTech de aprendizagem gamificada de alto impacto.

---

## 1. Visão Geral da Arquitetura (Edge & Serverless)

O MoogIA opera sob o paradigma de **Arquitetura Descentralizada Serverless**, eliminando custos recorrentes de infraestrutura em servidores de nuvem dedicados (AWS, Azure ou GCP). A orquestração divide-se em duas camadas:

* **Core Backend (Google Apps Script - V8 Engine):** Atua estritamente como uma camada de API e controle de persistência NoSQL-like.
* **Frontend Reativo (Vanilla JS + Glassmorphic UI):** Executa em modo *Single Page Application (SPA)* reativa, centralizando toda a lógica de negócio pesada, manipulação binária e rendering no navegador do usuário (*Client-Side Heavy Lifting*).

```
[ Usuário (Navegador) ] 
       │
       ├─► [ Client-Side Rendering (Vanilla JS / RAM Local) ]
       │     ├─► pdf-lib.js & pdf.js (Renderização / Fallback Canvas)
       │     ├─► tesseract.js (OCR WebAssembly)
       │     └─► mermaid.js (Mapas Mentais Dinâmicos)
       │
       ▼ (Chamadas Assíncronas / Payload JSON)
[ Google Apps Script (Backend API) ] ◄──► [ Google Sheets (Persistência NoSQL) ]
```

---

## 2. Estratégia de Banco de Dados: Persistência NoSQL-like

Para mitigar a limitação física de colunas e o tempo de leitura do Google Sheets, a folha de cálculo não opera de forma puramente relacional. Em vez disso, foi adotada uma abordagem NoSQL:

* **Serialização JSON:** Árvores complexas e dinâmicas de dados — como o mapeamento de editais recortados, cronogramas da Agenda Inteligente e baralhos de flashcards personalizados — são tratadas como objetos estruturados no frontend e salvas no banco como **strings JSON serializadas** em células únicas.
* **Tabelas de Log e Auditoria:** O arquivo `Gamificacao_Logs` atua como um histórico imutável (Append-Only) de batimentos de uso, servindo de base matemática pura para o cálculo de engajamento.

---

## 3. Client-Side Heavy Lifting (Otimização de Custos e Tokens)

Chamadas de Inteligência Artificial Generativa possuem um custo por token flutuante. Para garantir a viabilidade financeira do modelo de negócios (SaaS Freemium), o MoogIA desloca o peso do processamento binário para a CPU/RAM do usuário:

### 3.1. Manipulação e Fallback de PDFs
A extração de texto para alimentar o contexto do **Google Gemini** é feita diretamente no navegador utilizando `pdf.js`. Se um documento médico ou apostila universitária possuir estruturas corrompidas (falha de *flate stream*), a camada de resgate entra em ação: rasteriza o documento em um `<canvas>` HTML oculto e extrai o texto localmente via `tesseract.js` (WebAssembly), evitando timeouts de 6 minutos do servidor do Google.

### 3.2. Context-Aware Prompting (Proteção contra Alucinações)
Os prompts enviados para a API do Gemini utilizam engenharia de contexto estrito. A IA é isolada dentro de uma matriz delimitada pelo texto extraído do PDF da mesa. O roteador dinâmico de contexto captura a Jornada, Módulo e Tópico em tempo real do DOM e carimba as saídas na nuvem de forma cirúrgica.

---

## 4. Motor de Gamificação Dinâmico & Retenção

O motor de gamificação é o pilar de *Growth/LTV* do MoogIA, operando por meio de tabelas de parametrização reativas:

* **Teto Diário de Ruminação (PR):** Para evitar que os usuários manipulem o sistema (ex: fazendo uploads infinitos para farmar XP), o banco `Gamificacao_Acoes` dita um limite matemático diário de ganho por tipo de gatilho.
* **Streak Engine (Algoritmo de Sequência):** O backend avalia o carimbo de data (`Data_String` no formato YYYY-MM-DD com fuso horário da planilha) e faz uma contagem regressiva consecutiva. Se o usuário pontuar hoje, a chama é mantida viva; se passar da meia-noite sem atividade de estudo, o multiplicador expira, gerando um gatilho comportamental de aversão à perda.
* **MooDicas Dinâmicas:** As dicas de neuroaprendizagem da mascote leem o estado do objeto global `currentTool` do frontend. O sistema aciona um *debounce anti-travamento* (timeout de 1 segundo com limpeza de fila) para abrir e fechar os balões de diálogo de forma fluida.

---

## 5. Gestão de Estado & Segurança (SafeStorage)

Para mitigar as políticas de segurança agressivas dos navegadores modernos (*Intelligent Tracking Prevention*), o MoogIA implementa o padrão **SafeStorage**:

* **Cache Híbrido:** Uma interface de abstração que unifica o `localStorage` do navegador e uma memória volátil em cache interna. Se o navegador derrubar o armazenamento local para prevenir rastreamento, a aplicação não quebra e mantém o progresso do rascunho de estudo ativo na sessão atual.
* **Isolamento de Chaves (BYOK):** Usuários do plano gratuito salvam sua própria chave de API da Google Studio de forma criptografada na memória local do cliente, eliminando o custo de tokens do administrador da plataforma durante a fase de validação do MVP.
