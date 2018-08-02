'use strict';
/* use global api */

api.search({})
  .then(response => {
    console.log(response);
  });

// test get all with search term
api.search({searchTerm: 'lessons'})
  .then(response => {
    console.log(response);
  });

api.details(1001)
  .then(response => {
    console.log(response);
  });

api.update(1001, {title: 'api.update refactor test', content:'BLAHBLAH'})
  .then(response => {
    console.log(response);
  });

api.create({title: 'api.create refactor test', content: 'BLAHBLAH'})
  .then(response => {
    console.log(response);
  });

api.remove(1010)
  .then(()=>{
    api.search({})
      .then(response => {
        console.log(response);
      });
  });