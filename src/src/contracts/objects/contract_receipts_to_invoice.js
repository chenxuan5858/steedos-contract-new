const objectql = require('@steedos/objectql');
const moment = require('moment');

async function contract_receipts_to_invoice(receiptId) 
{
  
  let receiptsObj = objectql.getObject('contract_receipts');
  let invoiceObj = objectql.getObject('contract_invoice');
  let refundObj = objectql.getObject('contract_refund');
  let accountObj = objectql.getObject('accounts');
  let receipt = await receiptsObj.findOne(receiptId);
  let ft = receipt.fees_type;
  let rcontract = receipt.contract;
  let rcsd = receipt.contract_start_date;
  let rced = receipt.contract_end_date;
  let bd = receipt.building;
  let rfps = receipt.fee_period_start;
  let rfpe = receipt.fee_period_end;
  let rpa = receipt.paid_amount;
  let ra = receipt.amount;
  let rprd = receipt.paid_real_date;
  let rpd = receipt.paid_date;
  let rcontractor = receipt.receipts_contractor;
  let rff = receipt.fees_finished;
  let raccount = receipt.account;
  let accountin = await accountObj.find({filters:[["_id", "=" , receipt.account]]});
  let invoicetype = "";
  accountin.forEach(function(find){
  invoicetype = find.invoice_type;
  });
  let taxmumber = "";
  accountin.forEach(function(find){
  taxmumber = find.tax_number;
  });
  //console.log('accountin',accountin);


  let invoicename = '';
  {
    if (ft == 'rentalfee')
    {invoicename = 'invoicename1'}
    else if (ft == 'servicefee1')
    {invoicename = 'invoicename2'}
    else if (ft == 'servicefee2')
    {invoicename = 'invoicename3'}
    else if (ft == 'servicefee3')
    {invoicename = 'invoicename4'}
    else if (ft == 'servicefee4')
    {invoicename = 'invoicename5'}
    else if (ft == 'freeperiodfee')
    {invoicename = 'invoicename6'}
  };

  let refundtype = '';
  {
    if (ft == 'rentaldeposit')
    {refundtype = 'rentaldeposit'}
    else if (ft == 'servicedeposit')
    {refundtype = 'servicedeposit'}
  };

  if (rpa == ra && rpd != null)
  {
    await receiptsObj.directUpdate(receiptId, { paid_real_date: rpd });
  }

  if (rpa == ra && rpd != null && rprd != null && rff == true )
  {
    if (ft == 'rentalfee' || ft == 'servicefee1' || ft == 'servicefee2' || ft == 'servicefee3' || ft == 'servicefee4' || ft == 'freeperiodfee')
    {
    await invoiceObj.insert({
      invoice_name: invoicename,
      invoice_contractor: rcontractor,
      contract: rcontract,
      contract_start_date: rcsd,
      contract_end_date: rced,
      invoice_period_start: rfps,
      invoice_period_end: rfpe,
      invoice_amount: rpa,
      paid_time: rprd,
      account: raccount,
      invoice_type: invoicetype,
      tax_number: taxmumber,
      building: bd,
      space: receipt.space,
      }); 
    }

    if (ft == 'rentaldeposit' || ft == 'servicedeposit')
    {
    let rft = moment(rfpe).add(10,'d').toDate();
    await refundObj.insert({
      refund_type: refundtype,
      refund_contractor: rcontractor,
      contract: rcontract,
      contract_start_date: rcsd,
      contract_end_date: rced,
      refund_amount: rpa,
      refund_date: rft,
      account: raccount,
      building: bd,
      space: receipt.space,
      }); 
    }
  }
}

module.exports = 
{
  contract_receipts_to_invoice
};
