define(['httpUtil'], function (http) {
  'use strict';

  function getArticles(skip, take, callback) {
    var url = 'http://server/path?skip=' + skip + '&take=' + take;
    http.get(url, function (error, data) {
      if (!!error) {
        callback(error, data);
      } else {
        assignNumbers(data);
        callback(null, data);
      }
    });
  }

  function assignNumbers(data) {
    var index;
    for (index = 0; index < data.length; index++) {
      data[index].number = index + 1;
    }
  }

  return {
    getArticles: getArticles
  };
});
