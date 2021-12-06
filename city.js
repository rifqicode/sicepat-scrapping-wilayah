'use strict'

const env = 'staging'
let cities = require('./datas/staging/shipper_cities_mapped.json');
if (env === 'production') {
  cities = require('./datas/production/shipper_cities_mapped.json');
}

const Adapter = require('./adapter');
const fs = require('fs'); 
const adapter = new Adapter();

const get = async (data) => {
  let name = data.shipper.name;

  const { body } = await adapter.getLocation({
    name: name,
    type: 'city',
    pagination:{
      limit: 0
    }
  });

  let match = {};
  if (body.data.length > 1) {
    body.data.forEach((value) => {
      if (name.toUpperCase() == value.city_name.toUpperCase()) {
        match = value;
      };
    });
  }

  let result = {};
  if (match.subdistrict_name) {
    result = match;
  } else {
    if (body.data.length == 1) {
      result = body.data[0];
    } else {
      result = body.data;
    }
  }

  data.tada.name = data.tada.name ? data.tada.name : data.shipper.name; 
  return {
    tada: data.tada,
    sicepat: result,
    length: body.data.length
  };
}
const main = async () => {
  let result = [];
  for (const city of cities) {
    console.log(city.shipper.name);

    let getData = await get(city);
    console.log(getData);

    result.push(getData);
  }

  fs.appendFileSync('./sicepat/cities_sicepat.json', JSON.stringify(result, null, 2));

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