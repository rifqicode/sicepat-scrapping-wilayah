province = require('./sicepat/province_sicepat.json');
city = require('./sicepat/cities_sicepat.json');
subdistrict = require('./sicepat/suburbs_sicepat.json');

const Adapter = require('./adapter');
const adapter = new Adapter();
const fs = require('fs');
console.log(subdistrict.length);

let filterSub = subdistrict.filter((value) => {
  return Array.isArray(value.sicepat);
});

console.log('Executing : ' + filterSub.length);

const delay = (delayInms) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

const main = async () => {

  filterSub.map(value => {
    console.log(value.tada.name);
  });
  // for (const value of filterSub) {
  //   console.log('======= executing ========');
  //   let data = [];
  //   let testCase = /[()/]+/;
  //   let name = value.tada.name

  //   if (testCase.test(name)) {
  //     name = name.split(' (');
  //   } else {
  //     name = name.split(' ');
  //   }
    
  //   console.log(name);

  //   let result = {};

  //   for (let nm of name) {
  //     nm = nm.replace(/[^a-zA-Z ]/g, '')

  //     console.log(nm);

  //     const { body } = await adapter.getLocation({
  //       name: nm,
  //       type: 'subdistrict',
  //       pagination:{
  //         limit: 0
  //       }
  //     });

  //     let match = {};
  //     console.log(JSON.stringify(body));

  //     if (body.data.length > 1) {
  //       body.data.forEach((value) => {
  //         if (nm.toUpperCase() == value.subdistrict_name.toUpperCase()) {
  //           match = value;
  //         };
  //       });
  //     }

  //     let getData = {};
  //     if (match.subdistrict_name) {
  //       getData = match;
  //     } else {
  //       if (body.data.length == 1) {
  //         getData = body.data[0];
  //       } else {
  //         getData = body.data;
  //       }
  //     }

  //     if (body.data.length >= 1) {
  //       result = getData;
  //     } 

  //     await delay(5000);
  //   }

  //   console.log('======== result =========');
  //   console.log(result);

  //   data.push({
  //     name: value.tada.name,
  //     data: result
  //   });

  //   console.log('======= map ============');

  //   const map = subdistrict.map((value) => {
  //     let name = value.tada.name;

  //     let match = data.filter((v) => {
  //       return name.toUpperCase() == v.name.toUpperCase() &&
  //             v.provId == value.provId &&
  //             v.cityId == value.cityId;
  //     });

  //     if (match && match.length == 1) {
  //       return {
  //         tada: value.tada,
  //         sicepat: match[0].data,
  //         length: match[0].data.length,
  //         modified: true
  //       };
  //     }

  //     return value;
  //   });

  //   console.log('======= end map ============');
    
  //   fs.writeFileSync('./sicepat/suburbs_sicepat.json', JSON.stringify(map, null, 2));
  // }
}

main().then(() => {
  console.log('ok');
}).catch((e) => {
  console.log(e);
})

