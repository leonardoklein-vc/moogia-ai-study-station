# 🐮🧠 MoogIA: Estação de Estudos Gamificada com IA

![Architecture](https://img.shields.io/badge/Architecture-Serverless_SPA-blue?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI_Engine-Google_Gemini-8b5cf6?style=for-the-badge&logo=google)
![Gamification](https://img.shields.io/badge/Gamification-Duolingo_Style-10b981?style=for-the-badge)
![Monetization](https://img.shields.io/badge/Business_Model-Freemium_SaaS-f59e0b?style=for-the-badge)

**MoogIA** é uma plataforma EdTech (Education Technology) revolucionária que une processamento de documentos *in-browser*, Inteligência Artificial Generativa e Gamificação avançada. Desenvolvida para otimizar a preparação para concursos públicos, exames universitários e estudos autodidatas.

A missão do MoogIA é transformar o estudo passivo (leitura exaustiva de PDFs) em uma **jornada ativa, engajante e estruturada**.

<img width="1774" height="887" alt="ChatGPT Image 21 de jun  de 2026, 22_19_15" src="https://github.com/user-attachments/assets/7e00f15c-d6cc-461a-884e-20c5fe5012db" />

---

## 🎯 A Visão e o Potencial de Mercado
Estudantes de alta performance gastam milhares de reais anualmente em cursinhos, plataformas de questões e gerenciadores de PDF fragmentados. O MoogIA centraliza todo o ecossistema de aprendizagem em uma única **Single Page Application (SPA)** de custo de infraestrutura inicial zero (Serverless no Google Workspace).

---

## ✨ Features Premium e Orquestração de IA

### 🎮 Gamificação e Retenção (MooDicas)
A jornada do usuário é guiada pela nossa mascote inteligente. O sistema rastreia o comportamento e aplica gatilhos de dopamina para garantir o engajamento diário (LTV elevado):
* **Sistema de XP e Streaks:** Cada interação, leitura concluída ou simulado gera pontos de experiência (XP) em tempo real com animações visuais (Popups flutuantes e Level Ups).
* **MooDicas Contextuais:** A mascote entrega dicas comprovadas sobre a neurociência da aprendizagem dependendo da ferramenta que o usuário abriu.
<img width="1006" height="570" alt="image" src="https://github.com/user-attachments/assets/2f90fbc6-47a6-4715-85bc-74f7af388cea" />


### 🤖 Assistência Generativa (Powered by Gemini)
A integração com a API do Google Gemini atua diretamente no texto extraído da Mesa de Estudos, protegendo o usuário contra "alucinações" da IA (contexto fechado):
* **Smart Parsing de Editais:** O usuário faz upload de um Edital de Concurso. A IA localiza o Quadro de Provas, cruza com o Conteúdo Programático e gera uma **Jornada de Estudo Estruturada**, montando a grade de disciplinas e pesos automaticamente.
* **Copiloto IA (Chat com PDF):** Um tutor particular disponível 24/7 para explicar conceitos complexos usando analogias, respondendo exclusivamente com base no material fornecido.
* **Geração Ativa de Conhecimento:** Criação automática de Mapas Mentais (Mermaid.js), Flashcards (estilo Anki) e Simulados com Gabarito Comentado.
<img width="1001" height="550" alt="moog3" src="https://github.com/user-attachments/assets/a372fda2-880c-40a8-8bff-e5cad160f6f8" />


### 📚 Mesa de Estudos (Processamento Client-Side)
* **Manipulação Nativa:** Uso de `pdf-lib` e `pdf.js` diretamente no navegador. Privacidade absoluta e bypass de limites de upload de servidores.
* **Leitor Imersivo (Teleprompter TTS):** Motor Text-To-Speech com recurso de marcação de palavras em tempo real, mitigando a fadiga visual e auxiliando estudantes com TDAH ou dislexia.
* **OCR In-Browser:** Escaneamento de imagens de cadernos utilizando `tesseract.js` localmente, tornando fotos pesquisáveis pela IA.

*(Insira aqui um print do Leitor Imersivo ou da Extração OCR)*
> `![Leitor Imersivo e OCR](./assets/leitor_imersivo.png)`

---

## 🚀 Roadmap de Monetização (SaaS Freemium)

O MoogIA foi arquitetado desde o dia zero para escalar financeiramente. Como as chamadas de IA (Tokens) representam o custo variável da plataforma, o modelo de negócios baseia-se em **Assinaturas em Camadas (Tiered Subscriptions)** atreladas ao limite de uso do motor de IA:

### 🥉 Plano Free (Isca de Aquisição)
* Acesso total à "Mesa de Estudos" (ferramentas locais de PDF: Juntar, Dividir, OCR Básico).
* Gerenciamento de até 1 Jornada de Estudo manual.
* **Limite de IA:** 5 *Prompts* / requisições gratuitas por dia (ideal para testar resumos e chat básico).

### 🥈 Plano Pro (Foco em Concurseiros - R$ X/mês)
* Jornadas de Estudo ilimitadas com **Leitura de Edital Inteligente**.
* Geração de Flashcards ilimitados com exportação em massa.
* **Limite de IA:** 150 *Prompts* diários (Tokens suficientes para gerar dezenas de mapas mentais, simulados completos e chat contínuo com os PDFs).
* Acesso ao Leitor Imersivo de voz premium.

### 🥇 Plano Master / Mentoria (High-Ticket - R$ Y/mês)
* **API Ilimitada (Uso Fair-Play):** Limites altíssimos de tokens de IA para processamento de apostilas completas.
* Geração de Áudio-Resumos (Podcasts da matéria baixáveis em MP3).
* Análise de Desempenho e Estatísticas avançadas de retenção nos simulados com sugestão ativa de revisão espaçada.

---

## 📐 Arquitetura do Software

A aplicação foi construída como uma Single Page Application (SPA) reativa e descentralizada:
* **Backend & BD (NoSQL-like):** Google Apps Script e Google Sheets operam como banco central para registrar o progresso (Gamificação, Cofre de Materiais e Jornadas) através de *payloads* em JSON serializado.
* **Gestão de Estado:** Uso intensivo de `localStorage` para manter a sessão ativa, guardar tokens de API com segurança local e proteger rascunhos de estudo.
* **Performance:** Histórico de `Undo/Redo` (Stack = 20) in-browser e *Lazy Loading* de bibliotecas pesadas de PDF e OCR para garantir velocidade máxima em conexões lentas.
