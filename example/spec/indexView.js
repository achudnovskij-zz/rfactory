define(['rfactory!indexView'], function (viewModuleFactory) {
  'use strict';

  describe('UnitTest: indexView', function () {

    var dummyTemplate,
      repositoryMock,
      errorHandlerMock,
      handlebarsMock,
      compiledTemplate,
      ViewConstructor;

    beforeEach(function () {
      dummyTemplate = '<div id="articlesList"></div>';
      compiledTemplate = jasmine.createSpy().and.returnValue(dummyTemplate);
      repositoryMock = {
        getArticles: jasmine.createSpy()
      };
      errorHandlerMock = {
        handle: jasmine.createSpy()
      };
      handlebarsMock = {
        compile: jasmine.createSpy().and.returnValue(compiledTemplate)
      }

      ViewConstructor = viewModuleFactory({
        'articleRepository': repositoryMock,
        'handlebars': handlebarsMock,
        'text!indexTemplate.html': dummyTemplate,
        'errorHandler': errorHandlerMock
      });
    });

    describe('render', function () {
      var view, el;
      beforeEach(function () {
        el = document.createElement('div');
        view = new ViewConstructor();
      });

      it('should start loading first articles page', function () {
        view.render(el);
        expect(repositoryMock.getArticles).toHaveBeenCalledWith(0, 20, jasmine.any(Function));
      });

      describe('getArticles callback', function () {
        var getArticlesCallback, data = [{}, {}];

        beforeEach(function () {
          view.render(el);
          getArticlesCallback = repositoryMock.getArticles.calls.first().args[2];
        });

        it('should compile and render template', function () {
          getArticlesCallback(null, data);

          expect(handlebarsMock.compile).toHaveBeenCalledWith(dummyTemplate);
          expect(el.innerHTML).toEqual(dummyTemplate);
        });

        it('should bind first page to the template when articles loaded', function () {
          getArticlesCallback(null, data);

          expect(compiledTemplate).toHaveBeenCalledWith({
            header: 'Articles list',
            articles: data
          });
        });

        it('should show error message if articles loading failed', function () {
          var error = new Error();

          getArticlesCallback(error);

          expect(errorHandlerMock.handle).toHaveBeenCalledWith(error);
          expect(compiledTemplate).not.toHaveBeenCalled();
        });
      });
    })

  })

});
