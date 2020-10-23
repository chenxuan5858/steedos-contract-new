const objectql = require('@steedos/objectql');
async function price_increase(contractId) 
{
  let contractObj = objectql.getObject('contracts');
  let contract = await contractObj.findOne(contractId);
  let bop3 = contract.bop3;
  let mark = contract.remark;
  if (bop3 == 'yes') {
    if (mark == "无递增")
      {throw new Error('请在递增说明填写递增情况');
    }
    } 
    else if (bop3 == 'no') 
    {
    let mark = "无递增";
    await contractObj.directUpdate(contractId, { remark: mark });
    }
}


module.exports = {
  price_increase
};