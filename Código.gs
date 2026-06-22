/**
 * @Project Study Tools (MoogIA)
 * @Version 0.2 - Focado em Educação, IA e Gestão de Utilizadores
 */

var STUDY_TOOLS_CONFIG = {
  appName: "MoogIA",
  maxFileSizeMb: 35,
  // Aceita PDFs, Imagens e Documentos Word
  allowedMimeTypes: [
    "application/pdf", 
    "image/jpeg", 
    "image/png", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  enableDriveSync: true
};

// ID DA PLANILHA DE BASE DE DADOS
var DB_SHEET_ID = "1HWXzWFggi7U9po0gFLXluLCtRxTB5VTZvLYKvwSLdYg";

/**
 * ==========================================================================
 * PONTO DE ENTRADA (Renderização do HTML)
 * ==========================================================================
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index') // Seu arquivo principal de UI
      .evaluate()
      .setTitle(STUDY_TOOLS_CONFIG.appName)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function validarLoginDB(email, senha) {
  try {
    // 1. Acesso Master (Leonardo Rocha)
    if (email.toLowerCase() === "leonardo.rocha@gmail.com" && senha === "aabb123456") {
      return { success: true, nome: "Leonardo Rocha" };
    }

    // 2. Acesso Adicional (Lzigue - MVP Hardcoded)
    if (email.toLowerCase() === "lzigue@hcpa.edu.br" && senha === "aabb654321") {
      return { success: true, nome: "Lzigue" };
    }

    // 3. Validação via Planilha (Para outros usuários)
    var ss = SpreadsheetApp.openById(DB_SHEET_ID);
    var sheet = ss.getSheetByName("Usuarios");
    
    // Se a aba não existir, para o MVP ignoramos o erro e apenas retornamos que não achou
    if (!sheet) return { success: false, message: "Base de dados de usuários não configurada." };

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().toLowerCase() === email.toLowerCase() && 
          data[i][1].toString() === senha) {
        return { success: true, nome: data[i][2] };
      }
    }
    
    return { success: false, message: "E-mail ou palavra-passe incorretos." };
  } catch (error) {
    return { success: false, message: "Erro de sistema: " + error.message };
  }
}

/**
 * ==========================================================================
 * ROTEADOR DE AÇÕES GLOBAIS (O motor da sua API de Ficheiros)
 * ==========================================================================
 * Recebe as requisições do frontend (scripts.html)
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

/* ==========================================================================
   MÉTODOS PRIVADOS DE BACKEND (Essenciais para o fluxo de ficheiros)
   ========================================================================== */

/**
 * Converte ficheiros Word ou Imagens enviados pelo utilizador para PDF nativamente na Cloud.
 */
function _apiConvertToPdf(payload) {
  try {
    // 1. Decodifica o Base64 que veio do frontend e transforma num BLOB
    var blob = Utilities.newBlob(Utilities.base64Decode(payload.fileData), payload.mimeType || "application/octet-stream", payload.fileName);
    
    // 2. Cria um ficheiro temporário no Google Drive para forçar o motor de conversão
    var tempFile = DriveApp.createFile(blob);
    
    // 3. Pede ao Drive para devolver a versão PDF do ficheiro criado
    var pdfBlob = tempFile.getAs(MimeType.PDF);
    var pdfBase64 = Utilities.base64Encode(pdfBlob.getBytes());
    
    // 4. Faxina: Apaga o ficheiro temporário para não ocupar espaço no Drive do utilizador
    tempFile.setTrashed(true); 

    return { success: true, fileBase64: pdfBase64 };
  } catch (e) {
    return { success: false, error: "Falha na conversão via nuvem: " + e.message };
  }
}

/**
 * Salva um documento ou resumo finalizado no Google Drive do utilizador.
 */
function _apiSaveToDrive(payload) {
  try {
    var blob = Utilities.newBlob(Utilities.base64Decode(payload.base64Data), "application/pdf", payload.fileName);
    
    // Tenta guardar numa pasta específica, se fornecida, senão guarda na raiz do Drive
    var folder = payload.folderId ? DriveApp.getFolderById(payload.folderId) : DriveApp.getRootFolder();
    
    var file = folder.createFile(blob);
    return { success: true, fileUrl: file.getUrl() };
  } catch (e) {
    return { success: false, error: "Falha ao gravar no Google Drive: " + e.message };
  }
}

/* ==========================================================================
   MÓDULO DE BASE DE DADOS (JORNADAS E GAMIFICAÇÃO)
   ========================================================================== */

// 1. SINCRONIZAÇÃO DA GAMIFICAÇÃO (VAQUINHA)
function sincronizarGamificacao(email, xp, level) {
  try {
    const props = PropertiesService.getScriptProperties(); // Usamos ScriptProperties com prefixo de email
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

// 2. GESTÃO DE JORNADAS (Base de Dados em Folha de Cálculo)
// Esta função cria a aba "Jornadas" automaticamente se ela não existir.
function salvarJornadaBD(email, jornadaJSON) {
  Logger.log("Iniciando salvarJornadaBD para: " + email);
  try {
    const ss = SpreadsheetApp.openById(DB_SHEET_ID);
    Logger.log("Planilha aberta com sucesso.");
    
    let sheet = ss.getSheetByName("Jornadas_DB");
    
    if (!sheet) {
      Logger.log("Criando nova aba Jornadas_DB...");
      sheet = ss.insertSheet("Jornadas_DB");
      sheet.appendRow(["ID_Jornada", "Email_Aluno", "Data_Criacao", "Status", "Dados_JSON"]);
    }
    
    const idJornada = Utilities.getUuid();
    sheet.appendRow([
      idJornada, 
      email, 
      new Date(), 
      "Ativa", 
      JSON.stringify(jornadaJSON)
    ]);
    Logger.log("Dados gravados com sucesso, ID: " + idJornada);
    
    return { success: true, id: idJornada };
    
  } catch (e) {
    Logger.log("ERRO CRÍTICO NO BACKEND: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

// 3. COFRE DE MATERIAIS (Vinculação da Mesa)
function salvarMaterialNoCofreBD(email, materiaDestino, arquivosMeta) {
  try {
    const ss = SpreadsheetApp.openById(DB_SHEET_ID);
    let sheet = ss.getSheetByName("Cofre_DB");
    
    if (!sheet) {
      sheet = ss.insertSheet("Cofre_DB");
      sheet.appendRow(["ID_Material", "Email_Aluno", "Materia", "Data", "Metadados_Arquivo"]);
      sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#fce8b2");
    }
    
    const idMaterial = Utilities.getUuid();
    
    sheet.appendRow([
      idMaterial,
      email,
      materiaDestino,
      new Date(),
      JSON.stringify(arquivosMeta) // Guarda nomes, número de páginas, etc.
    ]);
    
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Ler Jornadas Ativas do Aluno
function carregarJornadasBD(email) {
  try {
    const ss = SpreadsheetApp.openById(DB_SHEET_ID);
    const sheet = ss.getSheetByName("Jornadas_DB");
    if (!sheet) return { success: true, jornadas: [] };
    
    const data = sheet.getDataRange().getValues();
    const jornadas = [];
    
    // Começa na linha 1 para saltar os cabeçalhos
    for (let i = 1; i < data.length; i++) {
      // Verifica se a linha tem conteúdo mínimo
      if (data[i][1] === email && data[i][3] === "Ativa") {
        try {
          // Extrai o JSON da coluna 4 (índice 4)
          const rawJson = data[i][4];
          if (rawJson) {
            jornadas.push({
              id: data[i][0],
              dataCriacao: data[i][2],
              dados: JSON.parse(rawJson)
            });
          }
        } catch (e) {
          Logger.log("Erro ao processar JSON da linha " + i + ": " + e.toString());
          // Ignora esta linha e continua para a próxima
        }
      }
    }
    return { success: true, jornadas: jornadas };
  } catch (e) {
    Logger.log("Erro fatal no carregarJornadasBD: " + e.toString());
    return { success: false, error: e.toString() };
  }
}
