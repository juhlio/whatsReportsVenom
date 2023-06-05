const venom = require('venom-bot');
const { Op } = require('sequelize');
const { ControlsLayer } = require('venom-bot/dist/api/layers/controls.layer');
const atendimentoReports = require('./bdfiles/atendimentoreports')
const gensets = require('./bdfiles/gensets')
const moment = require('moment');

const conversations = {};

/* venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  }); */

  venom
  .create(
    //session
    'sessionName', //Pass the name of the client you want to start the bot
    //catchQR
    (base64Qrimg, asciiQR, attempts, urlCode) => {
      console.log('Number of attempts to read the qrcode: ', attempts);
      console.log('Terminal qrcode: ', asciiQR);
      console.log('base64 image string qrcode: ', base64Qrimg);
      console.log('urlCode (data-ref): ', urlCode);
    },
    // statusFind
    (statusSession, session) => {
      console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
      //Create session wss return "serverClose" case server for close
      console.log('Session name: ', session);
    },
    // options
    {
      folderNameToken: 'tokens', //folder name when saving tokens
      mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
      headless: true, // you should no longer use boolean false or true, now use false, true or 'new' learn more https://developer.chrome.com/articles/new-headless/
      devtools: false, // Open devtools by default
      debug: true, // Opens a debug session
      logQR: true, // Logs QR automatically in terminal
      browserWS: '', // If u want to use browserWSEndpoint
      browserArgs: [''], // Original parameters  ---Parameters to be added into the chrome browser instance
      addBrowserArgs: [''], // Add broserArgs without overwriting the project's original
      puppeteerOptions: {}, // Will be passed to puppeteer.launch
      disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updatesLog: true, // Logs info updates automatically in terminal
      autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
      createPathFileToken: false, // creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
      addProxy: [''], // Add proxy server exemple : [e1.p.webshare.io:01, e1.p.webshare.io:01]
      userProxy: '', // Proxy login username
      userPass: '' // Proxy password
    },

    // BrowserInstance
    (browser, waPage) => {
      console.log('Browser PID:', browser.process().pid);
      waPage.screenshot({ path: 'screenshot.png' });
    }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async (message) => {
    console.log(message)



    if (message.type === 'chat') {
      const userId = message.from;
      const command = message.body.toLowerCase();
      console.log(`Esse é o UserID: ${userId}`)
      if (command === 'inicio') {
        await workflowEvents.inicio(client, message);
        console.log('Era mensage inicio')
        return;
      }

      let whiteList = ['5511972083773@c.us', '5511963004849@c.us']

      if (!whiteList.includes(userId)) {
        client.sendText(userId, 'Desculpe, você não tem autorização para utilizar essas funções');
        return
      }

      const conversation = conversations[userId];
      if (conversation) {
        await handleConversation(client, message, conversation);
      } else {
        if (workflowEvents.hasOwnProperty(command)) {
          await workflowEvents[command](client, message);
        } else {
          await client.sendText(userId, 'Desculpe, não entendi o comando. Envie "ajuda" para ver a lista de comandos disponíveis.');
        }
      }
    }
  });
}

async function handleConversation(client, message, conversation) {
  const userId = message.from;


  if (conversation.type === 'atendimento') {

    switch (conversation.step) {
      case 0:
        conversation.data.idEquip = message.body;
        conversation.step = 1;
        await client.sendText(userId, 'Qual o endereço do atendimento');
        break;

      case 1:
        conversation.data.endereco = message.body;
        conversation.step = 2;
        await client.sendText(userId, 'Qual o tipo do chamado? Digite apenas o número \n\n 1 - Emergencial \n 2 - Programado');
        break;

      case 2:
        if (message.body === '1') {
          conversation.data.tipoAtendimento = "Emergencial"
        } else if (message.body === '2') {
          conversation.data.tipoAtendimento = "Programado"
        }
        conversation.step = 3;
        await client.sendText(userId, 'Qual o dia e horário da abertura do chamado? Exemplo: 03/04/2023 17:45');
        break;

      case 3:
        conversation.data.horaChamado = message.body;
        conversation.step = 4;
        await client.sendText(userId, 'Qual o tipo de conexão? Digite apenas o número correspondente \n\n 1 - Aérea \n 2 -  Subterrânea');
        break;

      case 4:
        if (message.body === '1') {
          conversation.data.tipoConexao = "Aerea"
        } else if (message.body === '2') {
          conversation.data.tipoConexao = "Subterrânea"
        }
        conversation.step = 5;
        await client.sendText(userId, 'Qual o caminhão usado na operação? ');
        break;

      case 5:
        conversation.data.caminhao = message.body;
        conversation.step = 6;
        await client.sendText(userId, 'Qual a data e horário da chegada do GMG ao local? Exemplo: 03/04/2023 13:21');
        break;

      case 6:
        let chegadaGmgDigitada = message.body
        let chegadaGmgFormatada = moment(chegadaGmgDigitada, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
        conversation.data.chegadaGmg = chegadaGmgFormatada;
        conversation.step = 7;
        await client.sendText(userId, 'E o status do equipamento? Digite apenas o número correspondente \n\n 1 -  Stand By \n 2 - Aguardando COD \n 3 - Gerador Ligado');
        break;

      case 7:
        conversation.data.status = message.body
        conversation.step = 8;
        await client.sendText(userId, 'Sobre o cabeamento transportado: Qual secção do condutor? Digite apenas o número correspondente \n\n 1 -  70mm \n 2 - 95mm \n 3 - 120mm \n 4 - 240mm');
        break;


      case 8:
        if (message.body === '1') {
          conversation.data.seccaoCondutorTransportado = "70"
        } else if (message.body === '2') {
          conversation.data.seccaoCondutorTransportado = "95"
        } else if (message.body === '3') {
          conversation.data.seccaoCondutorTransportado = "120"
        } else if (message.body === '4') {
          conversation.data.seccaoCondutorTransportado = "240"
        }
        conversation.step = 9;
        await client.sendText(userId, 'Sobre o cabeamento transportado: Quantos lances por fase? 1, 2, 3, 4, 5, 6');
        break;

      case 9:
        conversation.data.lancesPorFaseTransportado = message.body;
        conversation.step = 10;
        await client.sendText(userId, 'Sobre o cabeamento transportado: Quantos lances neutro? 1, 2, 3, 4, 5, 6');
        break;

      case 10:
        conversation.data.lancesNeutroTransportado = message.body;
        if (conversation.data.status === "1" || conversation.data.status === "2") {
          conversation.step = 17
          await client.sendText(userId, 'Alguma Observação?');
          break
        }
        conversation.step = 11;
        await client.sendText(userId, 'Qual o horimetro inicial?');
        break;

      case 11:
        conversation.data.horimetroInicial = message.body;
        conversation.step = 14;
        await client.sendText(userId, 'Qual o Kwh inicial?');
        break;

      case 12:
        conversation.data.horimetroFinal = message.body;
        conversation.step = 13;
        await client.sendText(userId, 'Qual o Kwh inicial?');
        break;

      case 13:
        conversation.data.kwhInicial = message.body;
        conversation.step = 15;
        await client.sendText(userId, 'Qual a data e horário do inicio da Operação?');
        break;

      case 14:
        conversation.data.kwhFinal = message.body;
        conversation.step = 15;
        await client.sendText(userId, 'Qual a data e horário do inicio da Operação?');
        break;

      case 15:
        let inicioOperacaoDigitada = message.body
        let inicioOperacaoFormatada = moment(inicioOperacaoDigitada, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
        conversation.data.inicioOperacao = inicioOperacaoFormatada
        conversation.step = 17;
        await client.sendText(userId, 'Alguma Observação?');
        break;

      case 16:
        let terminoOperacaoDigitada = message.body
        let terminoOperacaoFormatada = moment(terminoOperacaoDigitada, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
        conversation.data.terminoOperacao = terminoOperacaoFormatada;
        conversation.step = 17;
        await client.sendText(userId, 'Alguma Observação?');
        break;

      case 17:
        conversation.data.obs = message.body;
        conversation.step = 18;
        await finishConversation(client, message, conversation);
        break;

      default:
        await client.sendText(userId, 'Desculpe, ocorreu um erro na conversa. Por favor, tente novamente.');
        delete conversations[userId];
    }
  } else if (conversation.type === 'finalizar') {
    switch (conversation.step) {
      case 0:
        conversation.data.idAtendimento = message.body;
        conversation.step = 1;
        await client.sendText(userId, 'Qual o horímetro final');
        break;

      case 1:
        conversation.data.horimetroFinal = message.body;
        conversation.step = 2;
        await client.sendText(userId, 'Qual o Kwh final?');
        break;

      case 2:
        conversation.data.kwhFinal = message.body;
        conversation.step = 3;
        await client.sendText(userId, 'Alguma Observação?');
        break;

      case 3:
        conversation.data.obs = message.body;
        conversation.step = 4;
        await finishConversation(client, message, conversation);
        break;

      default:
        await client.sendText(userId, 'Desculpe, ocorreu um erro na conversa. Por favor, tente novamente.');
        delete conversations[userId];
    }
  }

}

async function finishConversation(client, message, conversation) {
  const userId = message.from;

  let report;
  if (conversation.type === 'atendimento') {
    report = `Nome: ${conversation.data.name}\nIdade: ${conversation.data.age}`;
    console.log(conversation)
    const saveReport = await atendimentoReports.create({
      idEquip: conversation.data.idEquip,
      endereco: conversation.data.endereco,
      tipoAtendimento: conversation.data.tipoAtendimento,
      caminhao: conversation.data.caminhao,
      horaChamado: conversation.data.horaChamado,
      tipoConexao: conversation.data.tipoConexao,
      seccaoCondutorTransportado: conversation.data.seccaoCondutorTransportado,
      lancesPorFaseTransportado: conversation.data.lancesPorFaseTransportado,
      lancesNeutroTransportado: conversation.data.lancesNeutroTransportado,
      horimetroInicial: conversation.data.horimetroInicial,
      horimetroFinal: conversation.data.horimetroFinal,
      kwhInicial: conversation.data.kwhInicial,
      kwhFinal: conversation.data.kwhFinal,
      chegadaGmg: conversation.data.chegadaGmg,
      inicioOperacao: conversation.data.inicioOperacao,
      terminoOperacao: conversation.data.terminoOperacao,
      obs: conversation.data.obs,
      statusRelatorio: conversation.data.status,
    })
  } else if (conversation.type === 'finalizar') {
    console.log(conversation)
    const closeReport = atendimentoReports.update({
      horimentoFinal: conversation.data.horimentroFinal,
      kwhFinal: conversation.data.kwhFInal,
      obs: conversation.data.obs,
      statusRelatorio: 4
    }, {
      where: {
        id: conversation.data.idAtendimento
      }
    })

    report = `Profissão: ${conversation.data.profession}\nCidade: ${conversation.data.city}`;
  } else {
    await client.sendText(userId, 'Desculpe, ocorreu um erro na conversa. Por favor, tente novamente.');
    delete conversations[userId];
    return;
  }

  // Envie o relatório para o usuário
  await client.sendText(userId, `Obrigado por responder às perguntas! Aqui está o seu relatório:\n\n${report}`);

  // Remova a conversa do objeto de conversas
  delete conversations[userId];

  // Você também pode armazenar o relatório em um banco de dados ou tomar outras ações com os dados
}

const workflowEvents = {
  ajuda: async (client, message) => {
    await client.sendText(message.from, 'Digite a palavra Correspondente.\nAqui estão os comandos disponíveis:\n\n1 - Atendimento\n2- Finalizar\n\n\n\n\Digite Inicio a qualquer momento para voltar a este menu');
  },
  exemplo: async (client, message) => {
    await client.sendText(message.from, 'Este é um exemplo de resposta para o comando "exemplo".');
  },

  atendimento: async (client, message) => {
    const userId = message.from;
    if (!conversations[userId]) {
      conversations[userId] = {
        type: 'atendimento',
        step: 0,
        data: {},
      };
    }

    let geradores = await gensets.findAll({
      attributes: ['id', 'fabricante', 'numeroSerie'],
      where: {
        idCliente: 775,
      },
    })
    let listageradores = ''
    geradores.forEach((gerador) => {
      listageradores += `*${gerador.id}* - ${gerador.fabricante} | ${gerador.numeroSerie}\n`;
    });
    console.log(geradores)
    await client.sendText(userId, `Vamos lá, qual o número da máquina que faremos o relatório?\n\nDigite Apenas o Número Correspondente:\n\n${listageradores}`);
  },

  finalizar: async (client, message) => {
    const userId = message.from;
    if (!conversations[userId]) {
      conversations[userId] = {
        type: 'finalizar',
        step: 0,
        data: {},
      };
    }
    let atendimentosAbertos = await atendimentoReports.findAll({
      where: {
        statusRelatorio: {
          [Op.ne]: 4
        }
      }
    })
    let listaAtendimentos = ''
    atendimentosAbertos.forEach((atendimento) => {
      listaAtendimentos += `*${atendimento.id}* - ${atendimento.endereco}\n`;
    });


    await client.sendText(userId, `Qual atendimento você quer finalizar?\n\nDigite apenas o número correspondente\n${listaAtendimentos}`);
  },

  inicio: async (client, message) => {
    const userId = message.from;
    if (conversations[userId]) {
      delete conversations[userId];
    }
    await client.sendText(userId, 'A conversa foi reiniciada. Digite a palavra Correspondente.\n\nAqui estão os comandos disponíveis:\n1 -  Atendimento\n2 - Finalizar\n\n\n\n\Digite Inicio a qualquer momento para voltar a este menu');
  },



};
