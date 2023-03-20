Este é um projeto para automatizar o processo de criação e finalização de relatórios de atendimentos técnicos. Ele utiliza a biblioteca Venom-bot para criar um chatbot no WhatsApp que pode ser usado pelos técnicos de campo.

O bot guia o usuário por uma série de perguntas e, com base nas respostas, cria um relatório detalhado do atendimento. Além disso, também permite a finalização de atendimentos anteriores, onde o técnico deve informar o horímetro e o Kwh final, além de uma observação.

O projeto utiliza o banco de dados MySQL e o ORM Sequelize para armazenar os dados dos relatórios e geradores.

Como Usar
Clone o repositório
Instale as dependências com npm install
Configure as credenciais do banco de dados no arquivo config.json
Execute o projeto com npm start
Adicione o número do bot no WhatsApp e escaneie o QR code para se autenticar
Envie a mensagem "inicio" para receber a lista de comandos disponíveis
Siga as instruções do bot para criar um relatório de atendimento ou finalizar um atendimento anterior
Tecnologias Utilizadas
Node.js
Venom-bot
Sequelize
MySQL

Desenvolvedor
Julio Ramos (julio@jcsr.com.br)
