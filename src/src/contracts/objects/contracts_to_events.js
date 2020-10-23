const objectql = require('@steedos/objectql');
const moment = require('moment');

async function contracts_to_events(contractId) 
{
 
  let contractObj = objectql.getObject('contracts');
  //let accountsObj = objectql.getObject('accounts');
  let eventsObj = objectql.getObject('events');
  let contract = await contractObj.findOne(contractId);
  //let account = await accountsObj.find({filters:[["_id", "in" , contract.clientname]]});
  let nm = contract.name;
  //let cst = contract.start_date;
  let ced = contract.end_date;
  //let clientname = contract.clientname;
  let alarmtime = moment(ced).subtract(3, 'M').toDate();

  await eventsObj.insert({
    name: "续租提醒",
    start: alarmtime,
    end: ced,
    is_all_day: true,
    is_finished: false,
    owner: contract.owner,
    related_to_contract: contractId,
    related_to: {
      "o": "accounts",
      "ids": [contract.clientname]
    },
    description: "该谈续租啦！！！！",
    space: contract.space,
    }); 
}

module.exports = {
  contracts_to_events
};
