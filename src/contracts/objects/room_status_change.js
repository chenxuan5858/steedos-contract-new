const objectql = require('@steedos/objectql');

async function room_status_change(contractId) 
{
  console.log('room_status_change', contractId); 
  let contractObj = objectql.getObject('contracts');
  let roomObj = objectql.getObject('room');
  let contract = await contractObj.findOne(contractId);
  let contractstatus = contract.contract_fulfillment_state;
  let room_selected = await roomObj.find({filters:[["_id", "in" , contract.room_number]]});


if (contractstatus == 'end')
{
for(let room of room_selected)
{
await roomObj.update(room._id, {rentalstatus: 'yes'});
}
}



}

module.exports = {
  room_status_change
};
