const Sequelize = require('sequelize');
const database = require('../config/bd');

const atendimentoReports = database.define('atendimentoreports', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idEquip: Sequelize.INTEGER,
    endereco: Sequelize.STRING,
    tipoAtendimento: Sequelize.STRING,
    horaChamado: Sequelize.DATE,
    tipoConexao: Sequelize.STRING,
    caminhao: Sequelize.INTEGER,
    seccaoCondutorTransportado: Sequelize.INTEGER,
    lancesPorFaseTransportado: Sequelize.INTEGER,
    lancesNeutroTransportado: Sequelize.INTEGER,
    seccaoCondutorUtilizado: Sequelize.INTEGER,
    lancesPorFaseUtilizado: Sequelize.INTEGER,
    lancesNeutroUtilizado: Sequelize.INTEGER,
    horimetroInicial: Sequelize.INTEGER,
    horimetroFinal: Sequelize.INTEGER,
    kwhInicial: Sequelize.INTEGER,
    kwhFinal: Sequelize.INTEGER,
    chegadaGmg: Sequelize.DATE,
    inicioOperacao: Sequelize.DATE,
    terminoOperacao: Sequelize.DATE,
    obs: Sequelize.STRING,
    statusRelatorio: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
},{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})
module.exports = atendimentoReports;