const venom = require('venom-bot');
const { ControlsLayer } = require('venom-bot/dist/api/layers/controls.layer');
const atendimentoReports = require('./bdfiles/atendimentoreports')
const moment = require('moment');

const conversations = {};

venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async (message) => {

    if (message.isGroupMsg === false) {
      const userId = message.from;
      const command = message.body.toLowerCase();

      if (command === 'inicio') {
        await workflowEvents.inicio(client, message);
        return;
      }

      let whiteList = ['5511972083773@c.us']

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
        /* if (message.body === '1') {
          conversation.data.status = "Stand by"
        } else if (message.body === '2') {
          conversation.data.status = "Aguardando COD"
        } else if (message.body === '3') {
          conversation.data.status = "Gerador Ligado"
        } */
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
        conversation.step = 12;
        await client.sendText(userId, 'Qual o horímetro final?');
        break;

      case 12:
        conversation.data.horimetroFinal = message.body;
        conversation.step = 13;
        await client.sendText(userId, 'Qual o Kwh inicial?');
        break;

      case 13:
        conversation.data.kwhInicial = message.body;
        conversation.step = 14;
        await client.sendText(userId, 'Qual o Kwh Final?');
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
        conversation.step = 16;
        await client.sendText(userId, 'Qual a data e horário do término da Operação?');
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
  } else if (conversation.type === 'entrevista2') {
    switch (conversation.step) {
      case 0:
        conversation.data.profession = message.body;
        conversation.step = 1;
        await client.sendText(userId, 'Em que cidade você trabalha?');
        break;

      case 1:
        conversation.data.city = message.body;
        conversation.step = 2;
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
      /*  created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
       updated_at: moment().format('YYYY-MM-DD HH:mm:ss'), */
    })
  } else if (conversation.type === 'entrevista2') {
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
    await client.sendText(message.from, 'Digite a palavra Correspondente.\nAqui estão os comandos disponíveis:\n\n1. Atendimento\n\n\n\n\Digite Inicio a qualquer momento para voltar a este menu');
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

    await client.sendText(userId, 'Vamos lá, qual o número da máquina que faremos o relatório?');
  },

  entrevista2: async (client, message) => {
    const userId = message.from;
    if (!conversations[userId]) {
      conversations[userId] = {
        type: 'entrevista2',
        step: 0,
        data: {},
      };
    }

    await client.sendText(userId, 'Qual é a sua profissão?');
  },

  inicio: async (client, message) => {
    const userId = message.from;
    if (conversations[userId]) {
      delete conversations[userId];
    }
    await client.sendText(userId, 'A conversa foi reiniciada. Digite a palavra Correspondente.\n\nAqui estão os comandos disponíveis:\n1. Atendimento\n\n\n\n\Digite Inicio a qualquer momento para voltar a este menu');
  },



};
