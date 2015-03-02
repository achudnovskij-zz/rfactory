define(['handlebars', 'articleRepository', 'errorHandler', 'text!indexTemplate.html'],
  function (handlebars, repository, errorHandler, rawTemplate) {
    'use strict';

    var View = function (options) {};

    // Simple view logic: render template, load data, apply bindings when data is loaded.
    View.prototype.render = function (element) {
      var template = handlebars.compile(rawTemplate);
      repository.getArticles(0, 20, this.getArticlesCallback.bind(this, element, template));
    };

    View.prototype.getArticlesCallback = function (element, template, error, data) {
      if (error) {
        errorHandler.handle(error);
      } else {
        element.innerHTML = template({
          header: 'Articles list',
          articles: data
        });
      }
    };

    return View;
  });
