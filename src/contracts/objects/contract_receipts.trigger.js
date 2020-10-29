const CRTI = require('./contract_receipts_to_invoice');
const CRTIA = require('./contract_receipts_to_invoice_alarm');


module.exports = {

  listenTo: 'contract_receipts',

  beforeInsert: async function () {

  },

  afterInsert: async function () {


  },
  

  afterUpdate: async function () {
    await CRTIA.contract_receipts_to_invoice_alarm(this.id);
    await CRTI.contract_receipts_to_invoice(this.id);
  
  },
  
  beforeUpdate: async function () {
    //await CRTIA.contract_receipts_to_invoice_alarm(this.id);
  },

};
