'use strict'

const env = 'staging'
let suburbs = require('./datas/staging/shipper_suburbs_mapped.json');
if (env === 'production') {
  suburbs = require('./datas/production/shipper_suburbs_mapped.json');
}
const existing = require('./sicepat/suburbs_sicepat.json'); 

const Adapter = require('./adapter');
const fs = require('fs'); 
const adapter = new Adapter();

const getByFormatedName = async (data) => {
  let testCase = /[()/]+/;
  let name = data.shipper.name;
  data.tada.name = data.tada.name ? data.tada.name : data.shipper.name;

  if (!testCase.test(name)) {
    return {};
  }

  let split = name.split(' (');

  let map = split.map((value) => {
    return value.replace(/[^a-zA-Z ]/g, '');
  });

  for (const value of map) {
    const { body } = await adapter.getLocation({
      name: value,
      type: 'subdistrict',
      pagination:{
        limit: 0
      }
    });

    let match = {};
    if (body.data.length > 1) {
      body.data.forEach((value) => {
        if (name.toUpperCase() == value.subdistrict_name.toUpperCase()) {
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
    
    return {
      tada: data.tada,
      sicepat: result,
      length: body.data.length
    };
  }

  return {};
}

const get = async (data) => {
  let name = data.shipper.name;
  data.tada.name = data.tada.name ? data.tada.name : data.shipper.name; 

  const { body } = await adapter.getLocation({
    name: name,
    type: 'subdistrict',
    pagination:{
      limit: 0
    }
  });

  let match = {};

  if (body.data.length > 1) {
    body.data.forEach((value) => {
      if (name.toUpperCase() == value.subdistrict_name.toUpperCase()) {
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

  return {
    tada: data.tada,
    sicepat: result,
    length: body.data.length
  };
}

const main = async () => {
  let result = [];
  for (const suburb of suburbs) {
    console.log('=======');
    let copyOfExisting = existing; 
    let filter = copyOfExisting.filter((value) => {
      let name = suburb.tada.name ? suburb.tada.name : suburb.shipper.name;
      return value.tada.name.toUpperCase() == name.toUpperCase()
        && value.tada.provId == suburb.tada.provId
        && value.tada.cityId == suburb.tada.cityId;
    });

    if (filter && filter.length > 0) {
      console.log('skip');
      continue;
    }

    let testCase = /[()/]+/;
    let name = suburb.shipper.name;
    let getData = {};

    console.log(name);
    
    if (testCase.test(name)) {
      getData = await getByFormatedName(suburb);
    } else {
      getData = await get(suburb);
    }

    console.log(getData);
    fs.appendFileSync('./sicepat/suburbs_sicepat.json', JSON.stringify(getData, null, 2));
  }

  return {}
};

main().then(() => {
  console.log('Process child finished');
}).catch(err => {
  console.log('Process child error: ', err);
});