define(['rfactory!indexView'], function (viewModuleFactory) {
  'use strict';

  describe('indexView', function () {

    var dummyTemplate
      , bindingMock
      , repositoryMock
      , errorHandlerMock
      , ViewConstructor;

    beforeEach(function () {
      dummyTemplate = function () { return '<div id="articlesList"></div>'; };
      bindingMock = {
        apply: jasmine.createSpy()
      };
      repositoryMock = {
        getArticles: jasmine.createSpy()
      };
      errorHandlerMock = {
        handle: jasmine.createSpy()
      };

      ViewConstructor = viewModuleFactory({
        'articleRepository'     : repositoryMock
        , 'bindingLibrary'      : bindingMock
        , 'indexTemplate'       : dummyTemplate
        , 'errorHandler'        : errorHandlerMock
      });
    });

    describe('render', function () {
      var view
        , el;
      beforeEach(function () {
        el = document.createElement('div');
        view = new ViewConstructor();
      });

      it('should render template', function () {
        view.render(el);
        expect(el.innerHTML).toEqual(dummyTemplate());
      });

      it('should start loading first articles page', function () {
        view.render(el);
        expect(repositoryMock.getArticles).toHaveBeenCalledWith(0, 20, jasmine.any(Function));
      });

      describe('getArticles callback', function () {
        var getArticlesCallback
          , data = [{}, {}];

        beforeEach(function () {
          view.render(el);
          getArticlesCallback = repositoryMock.getArticles.calls.first().args[2];
        });

        it('should bind first page to the template when articles loaded', function () {
          getArticlesCallback(null, data);

          expect(bindingMock.apply).toHaveBeenCalledWith(data, el);
        });

        it('should show error message if articles loading failed', function () {
          var error = new Error();

          getArticlesCallback(error);

          expect(errorHandlerMock.handle).toHaveBeenCalledWith(error);
          expect(bindingMock.apply).not.toHaveBeenCalled();
        });
      });
    })

  })

});
