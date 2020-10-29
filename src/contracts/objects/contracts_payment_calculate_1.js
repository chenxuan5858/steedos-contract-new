const objectql = require('@steedos/objectql');
//const moment = require('moment');

async function contracts_payment_calculate_1(contractId) 
{
 
  let contractObj = objectql.getObject('contracts');
  let receiptsObj = objectql.getObject('contract_receipts');
  let contract = await contractObj.findOne(contractId);
  let rs = contract.rentalsquare;
  let srp = contract.rentalamount;
  let ssp = contract.serviceamount;
  let dc = contract.depositcycle;
  let cst = contract.start_date;
  let ced = contract.end_date;
  let ct2 = contract.contract_type2;
  let clientname = contract.clientname;
  let contractor = contract.contractor;
  let buildingin = contract.building_select;
  

  let rentaltemp = 0;
  rentaltemp = rs*srp*365;
  let standard_monthly_rental = 0;
  standard_monthly_rental = parseInt(rentaltemp/12);
  let servicetemp = 0;
  servicetemp = rs*ssp*365;
  let standard_monthly_service = 0;
  standard_monthly_service = parseInt(servicetemp/12);
  let rental_deposit = 0;
  rental_deposit = standard_monthly_rental*dc;
  let service_deposit = 0;
  service_deposit = standard_monthly_service*dc;

  let servicefeestype = '';
  {
  if (ct2 == 'servicecontract1')
  {servicefeestype = 'servicefee1'}
  else if (ct2 == 'servicecontract2')
  {servicefeestype = 'servicefee2'}
  else if (ct2 == 'servicecontract3')
  {servicefeestype = 'servicefee3'}
  else if (ct2 == 'servicecontract4')
  {servicefeestype = 'servicefee4'}
  };

  let rcontractor = '';
  {
  if (contractor == 'company1')
  {rcontractor = 'company1'}
  else if (contractor == 'company2')
  {rcontractor = 'company2'}
  else if (contractor == 'company3')
  {rcontractor = 'company3'}
  };

  await receiptsObj.insert({
    fees_type: 'rentaldeposit',
    account: clientname,
    contract: contractId,
    contract_start_date: cst,
    contract_end_date: ced,
    fee_period_start: cst,
    fee_period_end: ced,
    receipts_contractor: rcontractor,
    building: buildingin,
    amount: rental_deposit,
    paid_amount: 0,
    space: contract.space,
    });
  
  if (ssp != 0)
  {
  await receiptsObj.insert({
    fees_type: 'servicedeposit',
    account: clientname,
    contract: contractId,
    contract_start_date: cst,
    contract_end_date: ced,
    fee_period_start: cst,
    fee_period_end: ced,
    receipts_contractor: 'company1',
    building: buildingin,
    amount: service_deposit,
    paid_amount: 0,
    space: contract.space,
    });
  }
}

module.exports = {
  contracts_payment_calculate_1
};
