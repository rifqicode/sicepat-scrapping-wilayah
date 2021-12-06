'use strict'

const env = 'staging'
let provinces = require('./datas/staging/shipper_provinces_mapped.json');
if (env === 'production') {
  provinces = require('./datas/production/shipper_provinces_mapped.json');
}

const Adapter = require('./adapter');
const fs = require('fs'); 
const adapter = new Adapter();

const get = async (data) => {
  const { body } = await adapter.getLocation({
    name: data.shipper.name,
    type: 'province',
    pagination:{
      limit: 0
    }
  });

  return {
    tada: data.tada,
    sicepat: body.data[0],
    length: body.length
  };
}
const main = async () => {
  let result = [];
  for (const province of provinces) {
    let getData = await get(province);
    result.push(getData);
  }

  fs.appendFileSync('./sicepat/province_sicepat.json', JSON.stringify(result, null, 2));

  return {
    reporting: result.filter((value) => {
      return value.length > 1;
    })
  }
};

main().then(({reporting}) => {
  console.log('Process child finished');
  console.log('Finish with reporting : ');
  console.log(reporting);
}).catch(err => {
  console.log('Process child error: ', err);
});