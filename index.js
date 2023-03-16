const venom = require('venom-bot');
const { ControlsLayer } = require('venom-bot/dist/api/layers/controls.layer');

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
        conversation.data.name = message.body;
        conversation.step = 1;
        await client.sendText(userId, 'Qual é a sua idade?');
        break;

      case 1:
        conversation.data.age = message.body;
        conversation.step = 2;
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

    await client.sendText(userId, 'Qual é o seu nome?');
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
