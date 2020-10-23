const objectql = require('@steedos/objectql');

async function price_increase_before(contract) 
{
  
  //let contractObj = objectql.getObject('contracts');
  let bop3 = contract.bop3;
  let mark = contract.remark;
  
  if (bop3 == 'yes') 
  {
   if (!mark)
    {
      throw new Error('请在递增说明填写递增情况');
    }
  } 
   else if (bop3 == 'no') 
    {
      contract.remark = "无递增";
      //await contractObj.directUpdate(contract, { remark: mark });
    }
}

module.exports = 
{
  price_increase_before
};