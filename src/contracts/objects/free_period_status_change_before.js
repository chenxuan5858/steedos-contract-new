const objectql = require('@steedos/objectql');

async function free_period_status_change_before(contract) {

  let contractObj = objectql.getObject('contracts');
  let bop4 = contract.bop4;
  let freeperiodstart = contract.free_period_start;
  let freeperiodend = contract.free_period_end;
  let freeperiodfees = contract.free_period_fees;
  let freeperiodfeesamount = contract.free_period_fees_amount;

  if (bop4 == 'no' && freeperiodstart != null)
  { 
    throw new Error('不是说没免租期吗填什么免租期开始日期！！');
    //let freeperiodstart = null;
    //let freeperiodend = null;
    //if(freeperiodstart != null)
    //{
      //throw new Error('不是说没免租期吗填什么免租期开始日期！！');
    //}
    //if(freeperiodend != null)
    //{
      //throw new Error('不是说没免租期吗填什么免租期结束日期！！');
    //}
    //await contractObj.directUpdate(contract, { free_period_start: freeperiodstart, free_period_end: freeperiodend });
  }

  if (bop4 == 'no' && freeperiodend != null)
  {
    throw new Error('不是说没免租期吗填什么免租期结束日期！！');
  }

  if (bop4 == 'yes')
  {
    if(!freeperiodstart)
    {
      throw new Error('不是有免租期吗？免租期开始日期被吃了？');
    }
    if(!freeperiodend)
    {
      throw new Error('不是有免租期吗？免租期结束日期也被吃了');
    }
  }

  if (freeperiodfees == 'yes' && freeperiodfeesamount == 0)
  {
    throw new Error('不是说有免租期物业费吗！！多少钱啊？');
  }

  if (freeperiodfees == 'no' && freeperiodfeesamount != 0)
  {
    let freeperiodfeesamount = 0;
    await contractObj.directUpdate(contract, { free_period_fees_amount: freeperiodfeesamount});
    throw new Error('不是说没有有免租期物业费吗！！为啥还要写金额？');
  }
}

module.exports = 
{
  free_period_status_change_before
};