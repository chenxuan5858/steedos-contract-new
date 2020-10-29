const objectql = require('@steedos/objectql');

async function contracts_delete(contract) 
{
//console.log('contracts_delete contract', receipts_in); 
//let contractObj = objectql.getObject('contracts');
let roomObj = objectql.getObject('room');
let receiptsObj = objectql.getObject('contract_receipts');
let invoiceObj = objectql.getObject('contract_invoice');
let refundObj = objectql.getObject('contract_refund');
let eventsObj = objectql.getObject('events');
//let contract = await contractObj.findOne(contractId);
//let contract_receipts = await receiptsObj.findOne(contract_receipts._id);
//let contract_invoice = await invoiceObj.findOne(contract_invoice._id);
//let contract_refund = await refundObj.findOne(contract_refund._id);
//let events = await eventsObj.findOne(events._id);
let contractId = contract._id;

let room_in = await roomObj.find({filters:[["_id", "in" , contract.room_number]]});
let receipts_in = await receiptsObj.find({filters:[["contract", "=" , contractId]]});
let invoice_in = await invoiceObj.find({filters:[["contract", "=" , contractId]]});
let refund_in = await refundObj.find({filters:[["contract", "=" , contractId]]});
let event_in = await eventsObj.find({filters:[["related_to_contract", "=" , contractId]]});
 
for (let contract_receipts of receipts_in)
{
await receiptsObj.delete(contract_receipts._id);
}

for (let contract_invoice of invoice_in)
{
await invoiceObj.delete(contract_invoice._id);
}

for (let contract_refund of refund_in)
{
await refundObj.delete(contract_refund._id);
}

for (let events of event_in)
{
await eventsObj.delete(events._id);
}

for(let room of room_in)
{
await roomObj.update(room._id, {rentalstatus: 'yes'});
}

}

module.exports = {
  contracts_delete
};
