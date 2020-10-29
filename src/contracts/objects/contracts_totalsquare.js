const objectql = require('@steedos/objectql');

async function contracts_totalsquare(contractId) 
{
  //console.log('contracts_totalsquare contractId', contractId); 
  let contractObj = objectql.getObject('contracts');
  let roomObj = objectql.getObject('room');
  let contract = await contractObj.findOne(contractId);

  // let square = contract.rentalsquare;

 let room_selected = await roomObj.find({filters:[["_id", "in" , contract.room_number]]});
 let totalsquare = 0;
 room_selected.forEach(function(item){
 totalsquare = totalsquare + item.area;
 });

for(let room of room_selected)
{
await roomObj.update(room._id, {rentalstatus: 'no'});
}

await contractObj.directUpdate(contractId, { rentalsquare: totalsquare});

}

module.exports = {
  contracts_totalsquare
};
