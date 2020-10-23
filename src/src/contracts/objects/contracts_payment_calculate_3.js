const objectql = require('@steedos/objectql');
const moment = require('moment');

async function contracts_payment_calculate_3(contractId) 
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
  let fps = contract.free_period_start;
  let fpe = contract.free_period_end;
  let fpf = contract.free_period_fees;
  let fpfa = contract.free_period_fees_amount;
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

  let daysfreeperiod = moment(fpe).add(1, 'd').diff(moment(fps), 'days');
  let contractMonth = moment(ced).add(1, 'd').diff(moment(cst), 'months', true); 
  let circletimes = Math.ceil(contractMonth/pc);
  let j = circletimes;

  if (is_ft == 'yes' )
  {


    if (fpf == 'yes')
    {
       let freeperiodfeesamount = parseInt(daysfreeperiod*fpfa*rs);

       await receiptsObj.insert({
        fees_type: 'freeperiodfee',
        account: clientname,
        contract: contractId,
        contract_start_date: cst,
        contract_end_date: ced,
        fee_period_start: fps,
        fee_period_end: fpe,
        receipts_contractor: 'company1',
        amount: freeperiodfeesamount,
        paid_amount: 0,
        building: buildingin,
        space: contract.space,
        });
    }
    for (j;j>=1;j--)
    {
      let initialst1 = j*pc;
      let initialet1 = (j-1)*pc;
      let ccstmoment1 = moment(ced).subtract(initialst1, 'M').add(1, 'd').toDate();
      let ccedmoment1 = moment(ced).subtract(initialet1, 'M').toDate();
      let between = moment(fpe).isBetween(ccstmoment1, ccedmoment1, null, '(]');

      if (between == true)
      { 
        break;
      }
      
    }
    let k = j;
    let initialet2 = (k-1)*pc;
    let ccedmoment2 = moment(ced).subtract(initialet2, 'M').toDate();
    let rccstmoment = moment(fpe).add(1, 'd').toDate();
    let monthDiff = moment(ccedmoment2).add(1, 'd').diff(moment(rccstmoment), 'months', false);
    let daysDiff = moment(ccedmoment2).add(1, 'd').diff(moment(rccstmoment).add(monthDiff, 'M'), 'days', false);
    let freeperiodrestrental = monthDiff*standard_monthly_rental+parseInt(daysDiff*rs*srp);
    let freeperiodrestservice = monthDiff*standard_monthly_service+parseInt(daysDiff*rs*ssp); 

    await receiptsObj.insert({
      fees_type: 'rentalfee',
      account: clientname,
      contract: contractId,
      contract_start_date: cst,
      contract_end_date: ced,
      fee_period_start: rccstmoment,
      fee_period_end: ccedmoment2,
      receipts_contractor: rcontractor,
      amount: freeperiodrestrental,
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
      fee_period_start: rccstmoment,
      fee_period_end: ccedmoment2,
      receipts_contractor: 'company1',
      amount: freeperiodrestservice,
      paid_amount: 0,
      building: buildingin,
      space: contract.space,
      }); 
    }
    
    let l = k-1;
    for (l; l>=1;l--)
    {
      let initialst3 = l*pc;
      let initialet3 = (l-1)*pc;
      let ccstmoment3 = moment(ced).subtract(initialst3, 'M').add(1, 'd').toDate();
      let ccedmoment3 = moment(ced).subtract(initialet3, 'M').toDate();

      await receiptsObj.insert({
        fees_type: 'rentalfee',
        account: clientname,
        contract: contractId,
        contract_start_date: cst,
        contract_end_date: ced,
        fee_period_start: ccstmoment3,
        fee_period_end: ccedmoment3,
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
        fee_period_start: ccstmoment3,
        fee_period_end: ccedmoment3,
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

module.exports = {
  contracts_payment_calculate_3
};
