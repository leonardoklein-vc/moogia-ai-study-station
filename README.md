# 🐮🧠 MoogIA: Estação de Estudos Gamificada com IA

![Architecture](https://img.shields.io/badge/Architecture-Serverless_SPA-blue?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI_Engine-Google_Gemini-8b5cf6?style=for-the-badge&logo=google)
![Gamification](https://img.shields.io/badge/Gamification-Duolingo_Style-10b981?style=for-the-badge)
![Monetization](https://img.shields.io/badge/Business_Model-Freemium_SaaS-f59e0b?style=for-the-badge)

**MoogIA** é uma plataforma EdTech (Education Technology) revolucionária que une processamento de documentos *in-browser*, Inteligência Artificial Generativa e Gamificação avançada. Desenvolvida para otimizar a preparação para concursos públicos, exames universitários e estudos autodidatas.

A missão do MoogIA é transformar o estudo passivo (leitura exaustiva de PDFs) em uma **jornada ativa, engajante e estruturada**.

<img width="1774" height="887" alt="MoogIA Hero Cover" src="https://github.com/user-attachments/assets/7e00f15c-d6cc-461a-884e-20c5fe5012db" />

---

## 🎯 A Visão e o Potencial de Mercado
Estudantes de alta performance gastam milhares de reais anualmente em cursinhos, plataformas de questões e gerenciadores de PDF fragmentados. O MoogIA centraliza todo o ecossistema de aprendizagem em uma única **Single Page Application (SPA)** de custo de infraestrutura inicial zero (Serverless no Google Workspace).

A arquitetura foi desenhada com foco em **escalabilidade agressiva e retenção profunda**, utilizando gatilhos comportamentais validados para garantir um LTV (*Lifetime Value*) elevado.

---

## ✨ Features Premium e Orquestração de IA

### 🎮 Gamificação e Retenção (MooDicas)
A jornada do usuário é guiada pela nossa mascote inteligente. O sistema rastreia o comportamento e aplica gatilhos de dopamina para garantir o engajamento diário:
* **Sistema de XP e Streaks:** Cada interação, leitura concluída ou simulado gera Pontos de Ruminação (PR) em tempo real, retroalimentando as "Ofensivas" (Streaks) com animações de *Level Up*.
* **Conquistas Ocultas (Badges):** Sistema inteligente de recompensas dinâmicas, como a "Vaca Corujinha" (ganha ao estudar de madrugada) ou "Queijeiro Suíço" (por gerar resumos massivos).
* **MooDicas Contextuais:** A mascote entrega dicas comprovadas sobre a neurociência da aprendizagem dependendo da ferramenta que o usuário abriu.

<img width="1006" height="570" alt="Gamificação e Dashboard" src="https://github.com/user-attachments/assets/2f90fbc6-47a6-4715-85bc-74f7af388cea" />

### 🤖 Assistência Generativa Avançada (Powered by Gemini)
A integração com a API do Google Gemini atua diretamente no texto extraído da Mesa de Estudos, protegendo o usuário contra "alucinações" da IA (contexto fechado):
* **Smart Parsing de Editais:** O usuário faz upload de um Edital de Concurso. A IA localiza o Quadro de Provas, cruza com o Conteúdo Programático e gera uma **Jornada de Estudo Estruturada em JSON**, montando a grade de disciplinas e distribuindo na Agenda Inteligente.
* **Copiloto IA (Chat com PDF):** Um tutor particular com "memória" do PDF disponível 24/7 para explicar conceitos complexos usando analogias, respondendo exclusivamente com base no material fornecido.
* **Geração Ativa de Conhecimento:** * Mapas Mentais iterativos (renderizados via Mermaid.js com função de Pan/Zoom e exportação PNG).
  * Flashcards baseados em repetição espaçada (estilo Anki).
  * Simulados com arquitetura adaptável (Estilo Cebraspe, Somatória UFPR, Múltipla Escolha) e Gabarito Comentado.

<img width="1001" height="550" alt="Copiloto IA e Estúdio" src="https://github.com/user-attachments/assets/a372fda2-880c-40a8-8bff-e5cad160f6f8" />

### 📚 Mesa de Estudos e Processamento (Client-Side)
* **Manipulação Nativa In-Browser:** Mais de 15 ferramentas nativas rodando offline (`pdf-lib` e `pdf.js`). Juntar, dividir, extrair, achatar (flatten), marca d'água, e exclusão automática de páginas em branco (Faxina Inteligente). Privacidade absoluta (bypass de limites de upload).
* **Ferramenta Lasso & Lupa Inspection:** Seleção de páginas em massa desenhando um quadrado na tela e inspeção minuciosa com lupa de zoom fullscreen.
* **Leitor Imersivo (Teleprompter TTS):** Motor *Text-To-Speech* com recurso de marcação de palavras lidas em tempo real (Karaokê), mitigando a fadiga visual e auxiliando estudantes neurodivergentes.
* **OCR Local:** Imagens e cadernos são escaneados utilizando `tesseract.js` nativamente, injetando uma camada de texto invisível e transformando fotos em arquivos pesquisáveis pela IA.
* **Engine de Resgate (Fallback):** Se um PDF corrompido quebrar a manipulação binária, o sistema rasteriza as páginas em *canvas* e reconstrói o arquivo silenciosamente, garantindo estabilidade máxima.

---

## 🚀 Roadmap de Monetização (SaaS Freemium)

O MoogIA foi arquitetado desde o dia zero para escalar financeiramente. Como as chamadas de IA representam o custo variável, o modelo de negócios baseia-se em **Assinaturas em Camadas (Tiered Subscriptions)** atreladas ao limite de uso do motor:

### 🥉 Plano Free (Isca de Aquisição)
* Acesso total à "Mesa de Estudos" (ferramentas locais de PDF: Juntar, Dividir, OCR Básico, Remoção de Páginas).
* Gerenciamento de até 1 Jornada de Estudo manual.
* **Limite de IA:** 5 *Prompts* gratuitos por dia.
* *Gatilho de Crescimento (BYOK):* O usuário pode inserir a própria chave API do Google Gemini para ter uso irrestrito da inteligência.

### 🥈 Plano Pro (Foco em Concurseiros / Universitários)
* Jornadas de Estudo ilimitadas com **Leitura de Edital Inteligente**.
* Geração de Flashcards ilimitados com exportação em massa.
* **Limite de IA:** Tokens suficientes para gerar dezenas de mapas mentais, simulados completos e chat contínuo com as apostilas.
* Acesso ao Leitor Imersivo de voz premium.

### 🥇 Plano Master / Mentoria (High-Ticket)
* **API Ilimitada (Uso Fair-Play):** Processamento de apostilas completas.
* Geração de Áudio-Resumos (Podcasts da matéria baixáveis).
* Análise de Desempenho e Estatísticas avançadas de retenção nos simulados com sugestão ativa de revisão espaçada.

---

## 📐 Arquitetura do Software e Governança

A aplicação foi construída como uma Single Page Application (SPA) reativa e descentralizada:
* **Backend & Banco de Dados (NoSQL-like):** Google Apps Script e Google Sheets operam como banco central, registrando o progresso de usuários (Gamificação, Cofre de Materiais e Jornadas) através de *payloads* em JSON serializado.
* **Torre de Controle (Real-Time Admin):** Painel administrativo que monitora *heartbeats* (pings) da aplicação. Os administradores visualizam usuários online, módulos sendo utilizados no exato segundo e gerenciam as regras matemáticas de XP e Badges remotamente.
* **Gestão de Estado (SafeStorage):** Implementação robusta que burla bloqueios agressivos de *Tracking Prevention*, unindo `localStorage` e memória volátil em cache para proteger rascunhos e manter sessões ativas com segurança.
* **Performance e UI:** Histórico de `Undo/Redo` *in-browser*, *Lazy Loading* de bibliotecas pesadas de PDF e um Theming Engine poderoso que alterna estilos visuais, garantindo velocidade máxima mesmo em conexões lentas.
