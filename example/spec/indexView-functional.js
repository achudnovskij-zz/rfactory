define(['rfactory!indexView'], function (viewModuleFactory) {
  'use strict';

  describe('Function tests: Articles Index View', function () {

    var httpMock,
        ViewConstructor;

    beforeEach(function () {
      httpMock = {
        get: jasmine.createSpy()
      };

      ViewConstructor = viewModuleFactory({
        $maxDepth: 0,
        'httpUtil': httpMock
      });
    });

    describe('render', function () {
      var view, el;
      beforeEach(function () {
        el = document.createElement('div');
        view = new ViewConstructor();
      });

      describe('articles list loaded', function () {
        var httpGetCallback,
          data = [{
            name: 'First Article',
            author: 'First Author',
            date: '01/01/2015'
          }, {
            name: 'Second Article',
            author: 'Second Author',
            date: '01/02/2015'
          }];

        beforeEach(function () {
          view.render(el);
          httpGetCallback = httpMock.get.calls.first().args[1];
        });

        it('should render header', function () {
          httpGetCallback(null, {});
          expect(el.getElementsByTagName('h3')[0].innerHTML).toEqual('Articles list');
        });

        it('should build articles list HTML', function () {
          httpGetCallback(null, data);
          var articleItems = el.getElementsByTagName('li');
          expect(articleItems.length).toEqual(2);
        });

        it('should set article number', function () {
          httpGetCallback(null, data);
          var articleItems = el.getElementsByTagName('li');
          expect(articleItems[0].getElementsByClassName('num')[0].innerHTML).toEqual('1');
          expect(articleItems[1].getElementsByClassName('num')[0].innerHTML).toEqual('2');
        });

      });

    })

  })


});
