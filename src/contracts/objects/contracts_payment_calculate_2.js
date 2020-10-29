const objectql = require('@steedos/objectql');
const moment = require('moment');

async function contracts_payment_calculate_2(contractId) 
{
 
  let contractObj = objectql.getObject('contracts');
  let receiptsObj = objectql.getObject('contract_receipts');
  let contract = await contractObj.findOne(contractId);
  let is_ft = contract.bop4;
  let rs = contract.rentalsquare;
  let srp = contract.rentalamount;
  let ssp = contract.serviceamount;
  let pc = contract.paymentcycle;
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
  let cycle_rental = 0;
  cycle_rental = standard_monthly_rental*pc;
  let cycle_service = 0;
  cycle_service = standard_monthly_service*pc;


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

  let contractMonth1 = moment(ced).add(1, 'd').diff(moment(cst), 'months', true); 
  let circletimes1 = Math.ceil(contractMonth1/pc);

  if (is_ft == 'no')
  { 

    for (let i=circletimes1;i>=1;i--)
    {
      //console.log('circletimes1',circletimes1);
      let initialst = i*pc;
      let initialet = (i-1)*pc;
      let ccstmoment = moment(ced).subtract(initialst, 'M').add(1, 'd').toDate();
      let ccedmoment = moment(ced).subtract(initialet, 'M').toDate();
      let judgementbefore = moment(ccstmoment).isBefore(cst);
    
      if (judgementbefore == true)
      { 
        let monthsdifferent = moment(ccedmoment).add(1, 'd').diff(moment(cst), 'months');
        let daysdifferent = moment(ccedmoment).add(1, 'd').diff(moment(cst).add(monthsdifferent, 'M'), 'days');
        let differentrantal = parseInt(daysdifferent*rs*srp)+monthsdifferent*standard_monthly_rental;
        let differentservice = parseInt(daysdifferent*rs*ssp)+monthsdifferent*standard_monthly_service;

        await receiptsObj.insert({
          fees_type: 'rentalfee',
          account: clientname,
          contract: contractId,
          contract_start_date: cst,
          contract_end_date: ced,
          fee_period_start: cst,
          fee_period_end: ccedmoment,
          receipts_contractor: rcontractor,
          amount: differentrantal,
          paid_amount: 0,
          building: buildingin,
          space: contract.space,
          }); 
        
        if (ssp != 0)
        {
        await receiptsObj.insert({
          fees_type: servicefeestype,
          account: clientname,
          contract: contractId,
          contract_start_date: cst,
          contract_end_date: ced,
          fee_period_start: cst,
          fee_period_end: ccedmoment,
          receipts_contractor: 'company1',
          amount: differentservice,
          paid_amount: 0,
          building: buildingin,
          space: contract.space,
          }); 
        }
      }

      else if (judgementbefore == false)
      {
        await receiptsObj.insert({
          fees_type: 'rentalfee',
          account: clientname,
          contract: contractId,
          contract_start_date: cst,
          contract_end_date: ced,
          fee_period_start: ccstmoment,
          fee_period_end: ccedmoment,
          receipts_contractor: rcontractor,
          amount: cycle_rental,
          paid_amount: 0,
          building: buildingin,
          space: contract.space,
          }); 
        
        if (ssp != 0)
        {
        await receiptsObj.insert({
          fees_type: servicefeestype,
          account: clientname,
          contract: contractId,
          contract_start_date: cst,
          contract_end_date: ced,
          fee_period_start: ccstmoment,
          fee_period_end: ccedmoment,
          receipts_contractor: 'company1',
          amount: cycle_service,
          paid_amount: 0,
          building: buildingin,
          space: contract.space,
          }); 
        }
      }
    }
  }
}

module.exports = {
  contracts_payment_calculate_2
};
