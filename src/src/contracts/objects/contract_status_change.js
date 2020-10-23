const objectql = require('@steedos/objectql');

async function contract_status_change(contractId) 
{
  
  let contractObj = objectql.getObject('contracts');
  let contract = await contractObj.findOne(contractId);
  let cfs = contract.contract_fulfillment_state;
  let remark = contract.remark3;
  let cet= contract.contract_end_time;

  
  if (cfs == 'end') 
  {
    if (!cet)
    {
      throw new Error('请填写合同终止时间');
    }
    if (!remark)
    {
      throw new Error('请在终止说明填写终止情况');
    }
  } 
  else if (cfs == 'running')
  {
    await contractObj.directUpdate(contractId, {remark3:''});
    await contractObj.directUpdate(contractId, {contract_end_time: null});
  }
    
  
}

module.exports = 
{
  contract_status_change
};
