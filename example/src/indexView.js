define(['articleRepository', 'bindingLibrary', 'errorHandler', 'indexTemplate'], function (repository, binding, errorHandler, template) {
  'use strict';

  var View = function (options) {
  };

  // Simple view logic: render template, load data, apply bindings when data is loaded.
  View.prototype.render = function (element) {
    element.innerHTML = template();
    repository.getArticles(0, 20, this.getArticlesCallback.bind(this, element));
  };

  View.prototype.getArticlesCallback = function (element, error, data) {
    if (error) {
      errorHandler.handle(error);
    } else {
      binding.apply(data, element);
    }
  };

  return View;
});
