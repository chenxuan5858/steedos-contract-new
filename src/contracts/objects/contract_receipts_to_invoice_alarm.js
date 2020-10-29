const objectql = require('@steedos/objectql');

async function contract_receipts_to_invoice_alarm(receiptId) 
{
  
  let receiptsObj = objectql.getObject('contract_receipts');
  let receipt = await receiptsObj.findOne(receiptId);
  let rpd = receipt.paid_date;
  let rprd = receipt.paid_real_date;
  let rpa = receipt.paid_amount;
  let rff = receipt.fees_finished;
  let ra = receipt.amount;

  if (rpd == null)
  { 
    await receiptsObj.directUpdate(receiptId, { paid_amount: 0 });
    await receiptsObj.directUpdate(receiptId, { fees_finished: false });
    await receiptsObj.directUpdate(receiptId, { paid_real_date: null });
    throw new Error('请输入到账时间');
  }
  
  if (rpa != ra && rff == true)
  {
    await receiptsObj.directUpdate(receiptId, { fees_finished: false });
    throw new Error('请再次确认实收金额');
  }
  
}

module.exports = 
{
  contract_receipts_to_invoice_alarm
};
