/**
 * @Project Study Tools (MoogIA)
 * @Version 0.3.1 - Correção de Datas e Inicialização Automática
 */

var STUDY_TOOLS_CONFIG = {
  appName: "MoogIA",
  maxFileSizeMb: 35,
  allowedMimeTypes: [
    "application/pdf", 
    "image/jpeg", 
    "image/png", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  enableDriveSync: true
};

/**
 * PUBLIC REPOSITORY NOTICE
 * --------------------------------------------------------------------------
 * This file is a sanitized portfolio/public-repository version.
 * Do not commit real credentials, private prompts, production folder IDs,
 * spreadsheet IDs, API keys, patient data, institutional data, or personal emails.
 * Runtime secrets should be stored in Apps Script PropertiesService.
 */

var MOOGIA_PUBLIC_PLACEHOLDERS = {
  defaultAdminEmail: "admin@example.com",
  defaultAdminPassword: "CHANGE_ME_IN_PRIVATE_DEPLOYMENT",
  assetsFolderProperty: "MOOGIA_ASSETS_FOLDER_ID",
  adminEmailsProperty: "MOOGIA_ADMIN_EMAILS"
};

function _getConfiguredAdminEmails_() {
  try {
    var raw = PropertiesService.getScriptProperties().getProperty(MOOGIA_PUBLIC_PLACEHOLDERS.adminEmailsProperty) || "";
    return raw.split(',').map(function(email) { return email.toLowerCase().trim(); }).filter(String);
  } catch (e) {
    return [];
  }
}

/**
 * ==========================================================================
 * PONTO DE ENTRADA (Renderização do HTML e Inicialização)
 * ==========================================================================
 */
function doGet(e) {
  inicializarEstruturaDB();
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle(STUDY_TOOLS_CONFIG.appName)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function inicializarEstruturaDB() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Tabela de Usuários (Já existente)
    var sheetUsuarios = ss.getSheetByName("Usuarios");
    if (!sheetUsuarios) {
      sheetUsuarios = ss.insertSheet("Usuarios");
      sheetUsuarios.appendRow(["Email", "Senha", "Nome", "Perfil", "Ultimo_Acesso"]);
      sheetUsuarios.getRange("A1:E1").setFontWeight("bold").setBackground("#e6ffed");
      sheetUsuarios.appendRow([MOOGIA_PUBLIC_PLACEHOLDERS.defaultAdminEmail, MOOGIA_PUBLIC_PLACEHOLDERS.defaultAdminPassword, "Administrador Demo", "Admin", new Date().toISOString()]);
    }
    
    var sheetJornadas = ss.getSheetByName("Jornadas_DB");
    if (!sheetJornadas) {
      sheetJornadas = ss.insertSheet("Jornadas_DB");
      sheetJornadas.appendRow(["ID_Jornada", "Email_Aluno", "Data_Criacao", "Status", "Dados_JSON"]);
      sheetJornadas.getRange("A1:E1").setFontWeight("bold").setBackground("#d2e3fc");
    }
    
    var sheetCofre = ss.getSheetByName("Cofre_DB");
    if (!sheetCofre) {
      sheetCofre = ss.insertSheet("Cofre_DB");
      sheetCofre.appendRow(["ID_Material", "Email_Aluno", "Materia", "Data", "Metadados_Arquivo"]);
      sheetCofre.getRange("A1:E1").setFontWeight("bold").setBackground("#fce8b2");
    }

    // ==========================================
    // NOVAS TABELAS: MOTOR DINÂMICO DE GAMIFICAÇÃO
    // ==========================================
    
    // NÍVEIS E PATENTES
    var sheetNiveis = ss.getSheetByName("Gamificacao_Niveis");
    if (!sheetNiveis) {
      sheetNiveis = ss.insertSheet("Gamificacao_Niveis");
      // Onde: Nível Máximo do Teto | Título | Imagem URL
      sheetNiveis.appendRow(["Level_Teto", "Titulo_Patente", "Imagem_URL"]);
      sheetNiveis.getRange("A1:C1").setFontWeight("bold").setBackground("#fef08a");
      // Inserindo dados padrão
      sheetNiveis.appendRow([5, "Bezerro Desmamado", "https://i.ibb.co/5WHfDf0R/vaquinha.png"]);
      sheetNiveis.appendRow([15, "Novilho do Baixo Clero", "https://i.ibb.co/5WHfDf0R/vaquinha.png"]);
    }

    // AÇÕES E PONTUAÇÕES
    var sheetAcoes = ss.getSheetByName("Gamificacao_Acoes");
    if (!sheetAcoes) {
      sheetAcoes = ss.insertSheet("Gamificacao_Acoes");
      // Onde: Código da Ação no JS | Nome de Exibição | PR ganhos | Limite Diário (0 = sem limite)
      sheetAcoes.appendRow(["Gatilho_Interno", "Nome_Acao", "PR_Recompensa", "Limite_Diario"]);
      sheetAcoes.getRange("A1:D1").setFontWeight("bold").setBackground("#fef08a");
      sheetAcoes.appendRow(["upload_pdf", "Pastar um novo material", 10, 50]);
      sheetAcoes.appendRow(["gerar_resumo", "Gerar Resumo Executivo", 25, 0]);
    }

    // CONQUISTAS OCULTAS
    var sheetConquistas = ss.getSheetByName("Gamificacao_Conquistas");
    if (!sheetConquistas) {
      sheetConquistas = ss.insertSheet("Gamificacao_Conquistas");
      // Onde: Gatilho no JS | Qtd Vezes Necessária | Recompensa Extra | Imagem Badge
      sheetConquistas.appendRow(["ID_Conquista", "Nome_Exibicao", "Gatilho_Alvo", "Qtd_Necessaria", "PR_Bonus", "Imagem_Badge"]);
      sheetConquistas.getRange("A1:F1").setFontWeight("bold").setBackground("#fef08a");
      sheetConquistas.appendRow(["badge_queijeiro", "Queijeiro Suíço", "gerar_resumo", 25, 100, "url_da_badge.png"]);
    }

    // REGISTO HISTÓRICO DE LOGS PARA CONTROLO DE SEQUÊNCIA (STREAK)
    var sheetLogs = ss.getSheetByName("Gamificacao_Logs");
    if (!sheetLogs) {
      sheetLogs = ss.insertSheet("Gamificacao_Logs");
      sheetLogs.appendRow(["Email", "Data_ISO", "Data_String", "Gatilho_Acao"]);
      sheetLogs.getRange("A1:D1").setFontWeight("bold").setBackground("#fed7aa");
    }

    return true;
  } catch (e) {
    Logger.log("Erro na inicialização: " + e.toString());
    return false;
  }
}

/**
 * ==========================================================================
 * SISTEMA DE AUTENTICAÇÃO E PERFIS
 * ==========================================================================
 */
function validarLoginDB(email, senha) {
  try {
    var emailClean = email.toString().toLowerCase().trim();

    // Public-safe version: no hardcoded personal/admin credentials.
    // Configure real admins in Script Properties under MOOGIA_ADMIN_EMAILS
    // and manage user credentials in the private deployment database.

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Usuarios");
    if (!sheet) return { success: false, message: "Aba de usuários ausente. Atualize a app." };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().toLowerCase().trim() === emailClean && data[i][1].toString() === senha) {
        
        // REGISTAR O ÚLTIMO ACESSO NA COLUNA E (5)
        sheet.getRange(i + 1, 5).setValue(new Date().toISOString());

        return { 
          success: true, 
          nome: data[i][2], 
          email: emailClean,
          role: data[i][3] || "Aluno"
        };
      }
    }
    return { success: false, message: "E-mail ou senha incorretos." };
  } catch (error) {
    return { success: false, message: "Erro crítico no login: " + error.message };
  }
}

function _verificarSeEhAdmin(email) {
  var emailClean = email.toLowerCase().trim();
  var configuredAdmins = _getConfiguredAdminEmails_();
  if (configuredAdmins.indexOf(emailClean) > -1) return true;
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Usuarios");
  if (!sheet) return false;
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase().trim() === emailClean && data[i][3] === "Admin") {
      return true;
    }
  }
  return false;
}

/**
 * Lista todos os usuários no painel Admin com estatísticas agregadas em tempo real
 */
function listarUsuariosAdmin(solicitanteEmail) {
  if (!_verificarSeEhAdmin(solicitanteEmail)) {
    return { success: false, error: "Acesso negado. Permissão insuficiente." };
  }
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetUsers = ss.getSheetByName("Usuarios");
    if (!sheetUsers) return { success: false, error: "Aba Usuarios não encontrada." };
    
    var dataUsers = sheetUsers.getDataRange().getValues();
    
    // Objetos de acumulação rápida para evitar lentidão na planilha
    var contagemJornadas = {};
    var contagemMateriais = {};
    
    // 1. Contabiliza as Jornadas Ativas de cada usuário na aba Jornadas_DB
    var sheetJor = ss.getSheetByName("Jornadas_DB");
    if (sheetJor) {
      var dataJor = sheetJor.getDataRange().getValues();
      for (var j = 1; j < dataJor.length; j++) {
        var emailJor = dataJor[j][1].toString().toLowerCase().trim();
        var statusJor = dataJor[j][3];
        if (statusJor === "Ativa") {
          contagemJornadas[emailJor] = (contagemJornadas[emailJor] || 0) + 1;
        }
      }
    }
    
    // 2. Contabiliza os Materiais de cada usuário no Acervo_IA_DB
    var sheetMat = ss.getSheetByName("Acervo_IA_DB");
    if (sheetMat) {
      var dataMat = sheetMat.getDataRange().getValues();
      for (var k = 1; k < dataMat.length; k++) {
        var emailMat = dataMat[k][0].toString().toLowerCase().trim();
        contagemMateriais[emailMat] = (contagemMateriais[emailMat] || 0) + 1;
      }
    }
    
    var lista = [];
    
    // 3. Monta a lista cruzando os dados de Usuários e formatando as datas de acesso
    for (var i = 1; i < dataUsers.length; i++) {
      var userEmail = dataUsers[i][0].toString().toLowerCase().trim();
      var valAcesso = dataUsers[i][4]; // Coluna E (índice 4) - Último Acesso
      var dataISOString = null;
      
      if (valAcesso && valAcesso.toString().trim() !== "" && valAcesso.toString() !== "Nunca") {
        
        // CENÁRIO A: É um objeto Date nativo do Google Sheets
        if (valAcesso instanceof Date || Object.prototype.toString.call(valAcesso) === '[object Date]') {
          if (!isNaN(valAcesso.getTime())) {
            dataISOString = valAcesso.toISOString();
          }
        }
        
        // CENÁRIO B: Chegou como string de texto no padrão brasileiro (DD/MM/YYYY HH:mm:ss)
        if (!dataISOString) {
          var strData = valAcesso.toString().trim();
          var regBr = /^(\d{2})\/(\d{2})\/(\d{4})(.*)$/;
          
          if (regBr.test(strData)) {
            var partes = strData.match(regBr);
            var dia = partes[1];
            var mes = partes[2];
            var ano = partes[3];
            var restoHora = partes[4].trim(); // Ex: "17:14:02"
            
            // Reorganiza no formato universal YYYY-MM-DD que o navegador ama
            var formatoUniversal = ano + "-" + mes + "-" + dia;
            if (restoHora) {
              formatoUniversal += "T" + restoHora;
            }
            
            var dTest = new Date(formatoUniversal);
            if (!isNaN(dTest.getTime())) {
              dataISOString = dTest.toISOString();
            }
          }
        }
        
        // CENÁRIO C: Fallback genérico para outros formatos de string
        if (!dataISOString) {
          var dGeneric = new Date(valAcesso.toString());
          if (!isNaN(dGeneric.getTime())) {
            dataISOString = dGeneric.toISOString();
          }
        }
      }
      
      lista.push({ 
          email: dataUsers[i][0], 
          nome: dataUsers[i][2], 
          role: dataUsers[i][3] || "Aluno",
          ultimoAcesso: dataISOString, // Envia o ISO limpo ou null
          totalJornadas: contagemJornadas[userEmail] || 0,
          totalMateriais: contagemMateriais[userEmail] || 0 // Correção do erro de digitação
      });
    }
    
    return { success: true, usuarios: lista };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Busca todos os dados em tempo real para o Dashboard do Aluno (Perfil)
 * Lê as Jornadas, Estatísticas do Acervo e os Logs de Gamificação
 */
function buscarDadosPerfilBD(email) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var emailLimpo = email.toLowerCase().trim();
    
    var dadosPerfil = {
      logs: [],
      jornadas: [],
      stats: { resumos: 0, quizzes: 0, mapas: 0, cartoes: 0 }
    };

    // 1. Busca Histórico (Últimos 10 Logs)
    var sheetLogs = ss.getSheetByName("Gamificacao_Logs");
    if(sheetLogs) {
      var dataLogs = sheetLogs.getDataRange().getValues();
      for(var i = dataLogs.length - 1; i >= 1; i--) {
        if(dataLogs[i][0].toString().toLowerCase().trim() === emailLimpo) {
          dadosPerfil.logs.push({ dataIso: dataLogs[i][1], acao: dataLogs[i][3] });
          if(dadosPerfil.logs.length >= 10) break;
        }
      }
    }

    // 2. CORREÇÃO: Busca Jornadas Ativas do Aluno na aba correta (Jornadas_DB)
    var sheetJornadas = ss.getSheetByName("Jornadas_DB");
    if(sheetJornadas) {
      var dataJor = sheetJornadas.getDataRange().getValues();
      for(var j = 1; j < dataJor.length; j++) {
        // Coluna B (índice 1) é o Email | Coluna D (índice 3) é o Status | Coluna E (índice 4) é o JSON
        if(dataJor[j][1].toString().toLowerCase().trim() === emailLimpo && dataJor[j][3] === "Ativa") {
          try {
            var jData = JSON.parse(dataJor[j][4]);
            dadosPerfil.jornadas.push({
              titulo: jData.titulo || "Jornada sem título",
              tipo: jData.tipo || "Geral",
              nivel: jData.nivel || "Livre",
              qtdMaterias: jData.materias ? jData.materias.length : 0
            });
          } catch(e) {}
        }
      }
    }

    // 3. Conta Estatísticas do Acervo de IA
    var sheetAcervo = ss.getSheetByName("Acervo_IA_DB");
    if(sheetAcervo) {
      var dataAcervo = sheetAcervo.getDataRange().getValues();
      for(var k = 1; k < dataAcervo.length; k++) {
        // Coluna A (0) é o Email | Coluna C (2) é o Tipo
        if(dataAcervo[k][0].toString().toLowerCase().trim() === emailLimpo) {
          var tipo = dataAcervo[k][2]; 
          if(tipo === 'summarize') dadosPerfil.stats.resumos++;
          else if(tipo === 'quiz_generator') dadosPerfil.stats.quizzes++;
          else if(tipo === 'mindmap') dadosPerfil.stats.mapas++;
          else if(tipo === 'flashcards') dadosPerfil.stats.cartoes++;
        }
      }
    }

    return { success: true, dados: dadosPerfil };
  } catch(e) { 
    return { success: false, error: e.toString() }; 
  }
}

function salvarUsuarioAdmin(solicitanteEmail, userPayload) {
  if (!_verificarSeEhAdmin(solicitanteEmail)) {
    return { success: false, error: "Acesso negado. Permissão insuficiente." };
  }
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Usuarios");
    var data = sheet.getDataRange().getValues();
    var targetEmail = userPayload.email.toLowerCase().trim();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().toLowerCase().trim() === targetEmail) {
        sheet.getRange(i + 1, 2).setValue(userPayload.senha);
        sheet.getRange(i + 1, 3).setValue(userPayload.nome); 
        sheet.getRange(i + 1, 4).setValue(userPayload.role); 
        return { success: true, message: "Usuário atualizado com sucesso!" };
      }
    }
    
    sheet.appendRow([targetEmail, userPayload.senha, userPayload.nome, userPayload.role]);
    return { success: true, message: "Novo usuário registrado!" };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function deletarUsuarioAdmin(solicitanteEmail, targetEmail) {
  if (!_verificarSeEhAdmin(solicitanteEmail)) {
    return { success: false, error: "Acesso negado. Permissão insuficiente." };
  }
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Usuarios");
    var data = sheet.getDataRange().getValues();
    var cleanTarget = targetEmail.toLowerCase().trim();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().toLowerCase().trim() === cleanTarget) {
        sheet.deleteRow(i + 1);
        return { success: true, message: "Usuário removido da base de dados." };
      }
    }
    return { success: false, error: "Usuário não localizado." };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * ==========================================================================
 * ROTEADOR DE AÇÕES GLOBAIS (API de Arquivos)
 * ==========================================================================
 */
function executeBackendAction(action, payload) {
  try {
    switch (action) {
      case "CONVERT_TO_PDF":      
        return _apiConvertToPdf(payload);
      case "SAVE_PDF_TO_DRIVE":        
        return _apiSaveToDrive(payload);
      default: 
        throw new Error("Ação de backend não implementada: " + action);
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function _apiConvertToPdf(payload) {
  try {
    var blob = Utilities.newBlob(Utilities.base64Decode(payload.fileData), payload.mimeType || "application/octet-stream", payload.fileName);
    var tempFile = DriveApp.createFile(blob);
    var pdfBlob = tempFile.getAs(MimeType.PDF);
    var pdfBase64 = Utilities.base64Encode(pdfBlob.getBytes());
    tempFile.setTrashed(true); 
    return { success: true, fileBase64: pdfBase64 };
  } catch (e) {
    return { success: false, error: "Falha na conversão: " + e.message };
  }
}

function _apiSaveToDrive(payload) {
  try {
    var blob = Utilities.newBlob(Utilities.base64Decode(payload.base64Data), "application/pdf", payload.fileName);
    var folder = payload.folderId ? DriveApp.getFolderById(payload.folderId) : DriveApp.getRootFolder();
    var file = folder.createFile(blob);
    return { success: true, fileUrl: file.getUrl() };
  } catch (e) {
    return { success: false, error: "Falha ao gravar no Drive: " + e.message };
  }
}

/**
 * ==========================================================================
 * MÓDULO DE JORNADAS E GAMIFICAÇÃO
 * ==========================================================================
 */
function sincronizarGamificacao(email, xp, level) {
  try {
    const props = PropertiesService.getScriptProperties();
    props.setProperty('xp_' + email, xp.toString());
    props.setProperty('level_' + email, level.toString());
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function carregarGamificacao(email) {
  try {
    const props = PropertiesService.getScriptProperties();
    const xp = props.getProperty('xp_' + email) || '0';
    const level = props.getProperty('level_' + email) || '1';
    return { success: true, xp: parseInt(xp), level: parseInt(level) };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function salvarJornadaBD(email, jornadaJSON) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Jornadas_DB");
    
    if (!sheet) {
      sheet = ss.insertSheet("Jornadas_DB");
      sheet.appendRow(["ID_Jornada", "Email_Aluno", "Data_Criacao", "Status", "Dados_JSON"]);
    }
    
    const idJornada = Utilities.getUuid();
    // BLINDAGEM: Converte objeto Date para String
    const dataString = new Date().toISOString(); 
    
    sheet.appendRow([idJornada, email, dataString, "Ativa", JSON.stringify(jornadaJSON)]);
    return { success: true, id: idJornada };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function carregarJornadasBD(email) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Jornadas_DB");
    if (!sheet) return { success: true, jornadas: [] };
    
    const data = sheet.getDataRange().getValues();
    const jornadas = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === email && data[i][3] === "Ativa") {
        try {
          if (data[i][4]) {
            jornadas.push({
              id: data[i][0],
              // BLINDAGEM: Converte possível objeto Date do Google Sheets para string
              dataCriacao: data[i][2] ? data[i][2].toString() : "", 
              dados: JSON.parse(data[i][4])
            });
          }
        } catch (e) {
          Logger.log("Erro no JSON linha " + i);
        }
      }
    }
    return { success: true, jornadas: jornadas };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function salvarMaterialNoCofreBD(email, materiaDestino, arquivosMeta) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Cofre_DB");
    
    if (!sheet) {
      sheet = ss.insertSheet("Cofre_DB");
      sheet.appendRow(["ID_Material", "Email_Aluno", "Materia", "Data", "Metadados_Arquivo"]);
    }
    
    sheet.appendRow([Utilities.getUuid(), email, materiaDestino, new Date().toISOString(), JSON.stringify(arquivosMeta)]);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function deletarJornadaBD(email, idJornada) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Jornadas_DB");
    if (!sheet) return { success: false, error: "Aba de Jornadas ausente." };
    
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString() === idJornada.toString() && data[i][1].toString().toLowerCase().trim() === email.toLowerCase().trim()) {
        // Soft Delete: Muda o status para Inativa (deixa de listar no app, mantendo integridade)
        sheet.getRange(i + 1, 4).setValue("Inativa");
        return { success: true };
      }
    }
    return { success: false, error: "Jornada não localizada." };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function renomearJornadaBD(email, idJornada, novoTitulo) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Jornadas_DB");
    if (!sheet) return { success: false, error: "Aba de Jornadas ausente." };
    
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString() === idJornada.toString() && data[i][1].toString().toLowerCase().trim() === email.toLowerCase().trim()) {
        let dadosJSON = JSON.parse(data[i][4]);
        dadosJSON.titulo = novoTitulo; // Atualiza o título dentro da estrutura JSON
        
        sheet.getRange(i + 1, 5).setValue(JSON.stringify(dadosJSON));
        return { success: true };
      }
    }
    return { success: false, error: "Jornada não localizada." };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * ==========================================================================
 * MOTOR DE GAMIFICAÇÃO & ASSETS (BACKEND) - COLE NO FINAL DO CODE.GS
 * ==========================================================================
 */

function carregarRegrasGamificacaoBD() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var config = { niveis: [], acoes: [], conquistas: [] };
    
    var sheetNiveis = ss.getSheetByName("Gamificacao_Niveis");
    if (sheetNiveis) {
      var dataN = sheetNiveis.getDataRange().getValues();
      for (var i = 1; i < dataN.length; i++) {
        config.niveis.push({ teto: parseInt(dataN[i][0]), titulo: dataN[i][1], imagem: dataN[i][2] });
      }
      config.niveis.sort((a, b) => a.teto - b.teto);
    }
    
    var sheetAcoes = ss.getSheetByName("Gamificacao_Acoes");
    if (sheetAcoes) {
      var dataA = sheetAcoes.getDataRange().getValues();
      for (var j = 1; j < dataA.length; j++) {
        config.acoes.push({ gatilho: dataA[j][0], nome: dataA[j][1], pr: parseInt(dataA[j][2]), limite: parseInt(dataA[j][3]) });
      }
    }
    
    var sheetConquistas = ss.getSheetByName("Gamificacao_Conquistas");
    if (sheetConquistas) {
      var dataC = sheetConquistas.getDataRange().getValues();
      for (var k = 1; k < dataC.length; k++) {
        config.conquistas.push({ id: dataC[k][0], nome: dataC[k][1], alvo: dataC[k][2], meta: parseInt(dataC[k][3]), bonus: parseInt(dataC[k][4]), imagem: dataC[k][5] });
      }
    }
    
    return { success: true, regras: config };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// 1. Upload Direto para a sua Pasta Específica (COM LINK CORRIGIDO PARA IMAGENS)
function uploadImagemAsset(base64Data, fileName) {
  try {
    var folderId = PropertiesService.getScriptProperties().getProperty(MOOGIA_PUBLIC_PLACEHOLDERS.assetsFolderProperty);
    if (!folderId) {
      throw new Error("Configure a propriedade de script " + MOOGIA_PUBLIC_PLACEHOLDERS.assetsFolderProperty + " antes de usar upload de assets.");
    }
    var folder = DriveApp.getFolderById(folderId);
    
    // Garante que os ficheiros ali dentro podem ser vistos na web
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var cleanBase64 = base64Data;
    if (base64Data.indexOf(',') > -1) cleanBase64 = base64Data.split(',')[1];
    
    var blob = Utilities.newBlob(Utilities.base64Decode(cleanBase64), 'image/png', fileName);
    var file = folder.createFile(blob);
    
    // O SEGREDO ESTÁ AQUI: Usa o lh3.googleusercontent para permitir hotlink em tags <img>
    var directUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
    
    return { success: true, url: directUrl };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function salvarRegraNivelBD(teto, titulo, imagemUrl) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Gamificacao_Niveis");
    sheet.appendRow([teto, titulo, imagemUrl]);
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).sort(1);
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function salvarRegraAcaoBD(gatilho, nome, pr, limite) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Gamificacao_Acoes").appendRow([gatilho, nome, pr, limite]);
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function salvarRegraConquistaBD(id, nome, alvo, meta, bonus, imagemUrl) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Gamificacao_Conquistas").appendRow([id, nome, alvo, meta, bonus, imagemUrl]);
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function excluirRegraGamificacaoBD(abaName, colunaId, valorId) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(abaName);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][colunaId - 1].toString() === valorId.toString()) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: "Regra não encontrada." };
  } catch (e) { return { success: false, error: e.toString() }; }
}

// Atualizar Nome da Patente
function atualizarNomeNivelBD(teto, novoTitulo) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Gamificacao_Niveis");
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString() === teto.toString()) {
        sheet.getRange(i + 1, 2).setValue(novoTitulo);
        return { success: true };
      }
    }
    return { success: false, error: "Nível não encontrado." };
  } catch (e) { return { success: false, error: e.toString() }; }
}

// Atualizar Imagem da Patente
function atualizarImagemNivelBD(teto, novaUrl) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Gamificacao_Niveis");
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString() === teto.toString()) {
        sheet.getRange(i + 1, 3).setValue(novaUrl);
        return { success: true };
      }
    }
    return { success: false, error: "Nível não encontrado." };
  } catch (e) { return { success: false, error: e.toString() }; }
}

/**
 * Salva a árvore completa de dados modificada do repositório (NoSQL style)
 */
function salvarDadosCompletosJornadaBD(email, idJornada, dadosJSON) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Jornadas_DB");
    if (!sheet) return { success: false, error: "Aba Jornadas_DB não localizada no sistema." };
    
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString() === idJornada.toString() && data[i][1].toString().toLowerCase().trim() === email.toLowerCase().trim()) {
        // Substitui por completo a célula da coluna E (5) com o novo estado estruturado
        sheet.getRange(i + 1, 5).setValue(JSON.stringify(dadosJSON));
        return { success: true };
      }
    }
    return { success: false, error: "Jornada ativa não localizada para atualização." };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Puxa um ficheiro do Google Drive através da URL e converte em Base64 para a Mesa de Estudos
 */
function obterFicheiroDoDriveBase64(url) {
  try {
    var id = "";
    // Tenta extrair o ID de diferentes formatos de URL do Drive
    if (url.indexOf('id=') > -1) {
      id = url.split('id=')[1].split('&')[0];
    } else if (url.indexOf('picture/') > -1) {
      var parts = url.split('picture/');
      id = parts[parts.length - 1]; 
    } else if (url.indexOf('/d/') > -1) {
      id = url.split('/d/')[1].split('/')[0];
    }
    
    if (!id) throw new Error("Não foi possível identificar o ID na URL: " + url);
    
    var file = DriveApp.getFileById(id);
    var blob = file.getBlob();
    var base64 = Utilities.base64Encode(blob.getBytes());
    var mime = file.getMimeType();
    
    return { success: true, base64: base64, mimeType: mime, name: file.getName() };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

/* ==========================================================================
   MÓDULO 17: ACERVO DA INTELIGÊNCIA ARTIFICIAL (NUVEM)
   ========================================================================== */

function salvarMaterialIABanco(email, idItem, tipo, titulo, dadosJSON) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Acervo_IA_DB");
    
    // Se a aba não existir, o sistema cria-a automaticamente!
    if (!sheet) {
      sheet = ss.insertSheet("Acervo_IA_DB");
      sheet.appendRow(["Email", "ID_Item", "Tipo", "Data", "Titulo", "Dados_JSON"]);
      sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#dcfce3");
    }
    
    var dataHoje = new Date().toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'});
    sheet.appendRow([email.toLowerCase().trim(), idItem, tipo, dataHoje, titulo, JSON.stringify(dadosJSON)]);
    
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function carregarAcervoIABanco(email) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Acervo_IA_DB");
    if (!sheet) return { success: true, itens: [] }; // Se não existe, está vazio
    
    var data = sheet.getDataRange().getValues();
    var itens = [];
    var emailBusca = email.toLowerCase().trim();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().toLowerCase().trim() === emailBusca) {
        itens.push({
          id: data[i][1],
          tipo: data[i][2],
          data: data[i][3],
          titulo: data[i][4],
          dados: JSON.parse(data[i][5])
        });
      }
    }
    return { success: true, itens: itens.reverse() }; // Retorna os mais recentes primeiro
  } catch (e) { return { success: false, error: e.toString() }; }
}

function excluirMaterialIABanco(email, idItem) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Acervo_IA_DB");
    if (!sheet) return { success: false, error: "Aba de Acervo não existe." };
    
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][1].toString() === idItem.toString() && data[i][0].toString().toLowerCase().trim() === email.toLowerCase().trim()) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: "Documento não encontrado na nuvem." };
  } catch (e) { return { success: false, error: e.toString() }; }
}

/**
 * Regista uma ação de estudo na folha de cálculo com carimbo de data/hora
 */
function registrarLogAcaoBD(email, gatilhoAcao) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Gamificacao_Logs");
    if (!sheet) return { success: false, error: "Aba de logs ausente." };
    
    var agora = new Date();
    var dataString = Utilities.formatDate(agora, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
    
    sheet.appendRow([email.toLowerCase().trim(), agora.toISOString(), dataString, gatilhoAcao]);
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

/**
 * Calcula matematicamente a sequência de dias consecutivos de estudo (Streak Engine)
 */
function calcularSequenciaEstudosBD(email) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Gamificacao_Logs");
    if (!sheet) return { success: true, streak: 0, subtexto: "Inicie uma nova sessão de estudos hoje." };
    
    var data = sheet.getDataRange().getValues();
    var emailBusca = email.toLowerCase().trim();
    var datasAtivas = new Set();
    var tz = ss.getSpreadsheetTimeZone();
    
    // Filtra e armazena apenas as datas únicas de atividade do utilizador logado
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().toLowerCase().trim() === emailBusca) {
        var valorData = data[i][2]; // Coluna C (Data_String)
        var stringDataLimpa = "";
        
        // BLINDAGEM: Se o Google Sheets converteu a célula para um Objeto de Data, formatamos de volta.
        if (valorData instanceof Date) {
            stringDataLimpa = Utilities.formatDate(valorData, tz, "yyyy-MM-dd");
        } else {
            // Se for só texto, garantimos que pega apenas os 10 primeiros caracteres (YYYY-MM-DD)
            stringDataLimpa = valorData.toString().trim().substring(0, 10);
        }
        
        datasAtivas.add(stringDataLimpa);
      }
    }
    
    var hoje = new Date();
    var hojeStr = Utilities.formatDate(hoje, tz, "yyyy-MM-dd");
    
    var ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    var ontemStr = Utilities.formatDate(ontem, tz, "yyyy-MM-dd");
    
    // Se não estudou hoje nem ontem, a sequência quebrou ou está em 0
    if (!datasAtivas.has(hojeStr) && !datasAtivas.has(ontemStr)) {
      return { success: true, streak: 0, subtexto: "Inicie uma nova sessão de estudos hoje." };
    }
    
    // Algoritmo de contagem regressiva consecutiva
    var streak = 0;
    var dataCheck = new Date();
    var dataCheckStr = Utilities.formatDate(dataCheck, tz, "yyyy-MM-dd");
    
    // Se ainda não pontuou hoje, começa a contar a partir de ontem para manter a chama acesa
    if (!datasAtivas.has(dataCheckStr)) {
      dataCheck.setDate(dataCheck.getDate() - 1);
      dataCheckStr = Utilities.formatDate(dataCheck, tz, "yyyy-MM-dd");
    }
    
    while (datasAtivas.has(dataCheckStr)) {
      streak++;
      dataCheck.setDate(dataCheck.getDate() - 1);
      dataCheckStr = Utilities.formatDate(dataCheck, tz, "yyyy-MM-dd");
    }
    
    // Customização do subtexto baseado no empenho do aluno
    var subtexto = "A chama está acesa! Estude amanhã para manter o foco.";
    if (datasAtivas.has(hojeStr)) {
      subtexto = "Missão cumprida hoje! Volte amanhã para aumentar a sequência.";
    } else {
      subtexto = "Sua sequência expira hoje à meia-noite! Faça alguma atividade.";
    }
    
    return { success: true, streak: streak, subtexto: subtexto };
  } catch (e) { return { success: false, error: e.toString() }; }
}

/**
 * Atualiza o Título e o Contexto (Jornada/Matéria/Tópico) de um item no Acervo de IA
 */
function atualizarMetadadosAcervoIA(email, idItem, novoTitulo, novaJornada, novaMateria, novoTopico) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Acervo_IA_DB");
    if (!sheet) return { success: false, error: "Aba Acervo_IA_DB não encontrada." };
    
    var data = sheet.getDataRange().getValues();
    var emailLimpo = email.toLowerCase().trim();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][1].toString() === idItem.toString() && data[i][0].toString().toLowerCase().trim() === emailLimpo) {
        
        // 1. Atualiza o Título Visível na Coluna E (5)
        sheet.getRange(i + 1, 5).setValue(novoTitulo);
        
        // 2. Extrai e normaliza o JSON da Coluna F (6)
        var rawDados = data[i][5];
        var dadosJSON;
        try {
          dadosJSON = JSON.parse(rawDados);
        } catch(e) {
          dadosJSON = rawDados;
        }
        
        // BLINDAGEM MESTRE: Se for uma string primitiva (resumos antigos), transforma estruturalmente em objeto
        if (typeof dadosJSON !== 'object' || dadosJSON === null) {
          dadosJSON = { conteudo: dadosJSON };
        }
        
        // Garante que a árvore de contexto exista
        if (!dadosJSON.contexto) dadosJSON.contexto = {};
        
        dadosJSON.contexto.jornada = novaJornada;
        dadosJSON.contexto.materia = novaMateria;
        dadosJSON.contexto.topico = novoTopico; // NOVO CAMPO SALVO NO BANCO
        
        sheet.getRange(i + 1, 6).setValue(JSON.stringify(dadosJSON));
        
        return { success: true };
      }
    }
    return { success: false, error: "Documento não encontrado na nuvem para edição." };
  } catch (e) { 
    return { success: false, error: e.toString() }; 
  }
}

/**
 * Atualiza os dados de perfil do usuário (Nome) na planilha Usuarios
 */
function atualizarPerfilUsuarioBD(email, novoNome) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Usuarios");
    if (!sheet) return { success: false, error: "Aba Usuarios não encontrada." };
    
    var data = sheet.getDataRange().getValues();
    var emailLimpo = email.toLowerCase().trim();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().toLowerCase().trim() === emailLimpo) {
        // Atualiza a coluna do Nome (Coluna C - índice 2)
        sheet.getRange(i + 1, 3).setValue(novoNome);
        return { success: true };
      }
    }
    return { success: false, error: "Usuário não encontrado na base de dados." };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Registra o momento exato do login na aba Usuarios e adiciona ao log de Gamificação
 */
function registrarAcessoUsuario(email) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var emailLimpo = email.toLowerCase().trim();
    var dataAtual = new Date();

    // 1. Atualiza a coluna de Último Acesso na aba Usuarios
    var sheetUsers = ss.getSheetByName("Usuarios");
    if (sheetUsers) {
      var data = sheetUsers.getDataRange().getValues();
      var headers = data[0];
      
      // Procura onde está a coluna de acesso dinamicamente
      var idxAcesso = -1;
      for (var c = 0; c < headers.length; c++) {
        if (headers[c].toString().toLowerCase().includes("acesso")) idxAcesso = c;
      }
      if (idxAcesso === -1) idxAcesso = 4; // Fallback para a coluna E

      for (var i = 1; i < data.length; i++) {
        if (data[i][0].toString().toLowerCase().trim() === emailLimpo) {
          // Grava o objeto Date puro do Google Apps Script
          sheetUsers.getRange(i + 1, idxAcesso + 1).setValue(dataAtual);
          break;
        }
      }
    }

    // 2. Registra a ação 'login' no Gamificacao_Logs para manter o Streak vivo
    var sheetLogs = ss.getSheetByName("Gamificacao_Logs");
    if (sheetLogs) {
      var dataISO = dataAtual.toISOString();
      // Data String limpa para o motor de Gamificação (YYYY-MM-DD)
      var dataString = Utilities.formatDate(dataAtual, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd");
      sheetLogs.appendRow([emailLimpo, dataISO, dataString, "login", "Sessão iniciada"]);
    }

    return { success: true };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}
