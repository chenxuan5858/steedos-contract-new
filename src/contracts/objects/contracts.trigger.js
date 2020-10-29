//const FPSC = require('./free_period_status_change');
const FPSCB = require('./free_period_status_change_before');
const PI = require('./price_increase');
const PIB = require('./price_increase_before');
const TTS = require('./contracts_totalsquare');
const RSC = require('./room_status_change');
const CSC = require('./contract_status_change');
const CPC1 = require('./contracts_payment_calculate_1');
const CPC2 = require('./contracts_payment_calculate_2');
const CPC3 = require('./contracts_payment_calculate_3');
const CTE = require('./contracts_to_events');
const CTD = require('./contracts_delete');
//const CPC4 = require('./contracts_payment_calculate_3');
//const CPC5 = require('./contracts_payment_calculate_5');

module.exports = {

  listenTo: 'contracts',

  beforeInsert: async function () {
    await FPSCB.free_period_status_change_before(this.doc);
    await PIB.price_increase_before(this.doc);
  },

  afterInsert: async function () {
    await TTS.contracts_totalsquare(this.doc._id);
    await CPC1.contracts_payment_calculate_1(this.doc._id);
    await CPC2.contracts_payment_calculate_2(this.doc._id);
    await CPC3.contracts_payment_calculate_3(this.doc._id);
    await CTE.contracts_to_events(this.doc._id);
  },

  afterUpdate: async function () {
    //await FPSC.free_period_status_change(this.id);
    await PI.price_increase(this.id);
    await TTS.contracts_totalsquare(this.id);
    await CSC.contract_status_change(this.id);
    await RSC.room_status_change(this.id);
  },

  afterDelete: async function () {
    await CTD.contracts_delete(this.previousDoc);
  },

};