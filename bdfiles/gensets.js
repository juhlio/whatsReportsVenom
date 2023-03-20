const Sequelize = require('sequelize');
const database = require('../config/bd');


const Genset = database.define('gensets', {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    idCliente: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    tipoEquipamento: {
        type: Sequelize.STRING(255),
    },
    identificacao: {
        type: Sequelize.STRING(255),
    },
    fabricante: {
        type: Sequelize.STRING(255),
    },
    numeroSerie: {
        type: Sequelize.STRING(255),
    },
    dataFabricacao: {
        type: Sequelize.STRING(255),
    },
    potencia: {
        type: Sequelize.STRING(255),
    },
    abrangencia: {
        type: Sequelize.STRING(255),
    },
    tanqueBase: {
        type: Sequelize.STRING(255),
    },
    aberturaJanelaBase: {
        type: Sequelize.STRING(255),
    },
    capacidadeTanqueBase: {
        type: Sequelize.STRING(255),
    },
    tanqueDiario: {
        type: Sequelize.STRING(255),
    },
    aberturaJanelaDiario: {
        type: Sequelize.STRING(255),
    },
    capacidadeTanqueDiario: {
        type: Sequelize.STRING(255),
    },
    tanqueMensal: {
        type: Sequelize.STRING(255),
    },
    aberturaJanelaMensal: {
        type: Sequelize.STRING(255),
    },
    capacidadeTanqueMensal: {
        type: Sequelize.STRING(255),
    },
    fabricanteMotor: {
        type: Sequelize.STRING(255),
    },
    modeloMotor: {
        type: Sequelize.STRING(255),
    },
    serieMotor: {
        type: Sequelize.STRING(255),
    },
    quantidadeOleoLubrificante: {
        type: Sequelize.STRING(255),
    },
    modeloFiltroCombustivel: {
        type: Sequelize.STRING(255),
    },
    quantidadeFiltroCombustivel: {
        type: Sequelize.STRING(255),
    },
    modeloFiltroSeparador: {
        type: Sequelize.STRING(255),
    },
    quantidadeFiltroSeparador: {
        type: Sequelize.STRING(255),
    },
    modeloFiltroAgua: {
        type: Sequelize.STRING(255),
    },
    quantidadeFiltroAgua: {
        type: Sequelize.STRING(255),
    },
    modeloFiltroOleo: {
        type: Sequelize.STRING(255),
    },
    quantidadeFiltroOleo: {
        type: Sequelize.STRING(255),
    },
    modeloFiltroAr: {
        type: Sequelize.STRING(255),
    },
    quantidadeFiltroAr: {
        type: Sequelize.STRING(255),
    },
    fabricanteAlternador: {
        type: Sequelize.STRING(255),
    },
    modeloAlternador: {
        type: Sequelize.STRING(255),
    },
    serieAlternador: {
        type: Sequelize.STRING(255),
    },
    fabricanteModuloGrupo: {
        type: Sequelize.STRING(255),
    },
    modeloModuloGrupo: {
        type: Sequelize.STRING(255),
    },
    fabricanteModuloQta: {
        type: Sequelize.STRING(255),
    },
    modeloModuloQta: {
        type: Sequelize.STRING(255),
    },
    fabricanteChaveGrupo: {
        type: Sequelize.STRING(255),
    },
    modeloChaveGrupo: {
        type: Sequelize.STRING
    },
    fabricanteChaveRede: {
        type: Sequelize.STRING(255),
    },
    modeloChaveRede: {
        type: Sequelize.STRING(255),
    },
    allexoId: {
        type: Sequelize.INTEGER(11),
    },
    created_at: {
        type: Sequelize.DATE,
    },
    updated_at: {
        type: Sequelize.DATE,
    },
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Genset;

