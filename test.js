'use strict'

const $ = require('jquery')
const ko = require('knockout')
const test = require('tape')

// polyfills
require('es6-promise').polyfill()
if (!window.requestAnimationFrame) {
  const raf = require('raf')
  window.requestAnimationFrame = raf
  window.cancelAnimationFrame = raf.cancel
}

require('./src')

function runTests(t, config) {
  return new Promise((resolve) => {
    t.comment(JSON.stringify(config))

    const dom = $(`
      <ko-component-router params="
        routes: routes,
        base: config.base,
        hashbang: config.hashbang
      ">
      </ko-component-router>
    `).get(0)

    if (!history.emulate) {
      history.pushState(null, null, config.base + (config.hashbang ? '/#!' : '') + '/about')
    } else {
      t.comment('history api is being emulated... config.base is being ignored...')
      config.base = window.location.pathname
      window.location.hash = '#!/about'
    }

    ko.applyBindings(new RoutingTest(config), dom)

    let router
    // init
    step(() => {
      router = ko.contextFor(dom).$router
    })

    // routing
    .step(() => {
      t.equal(router.component(), 'about', 'explicit path (and initialization)')
      router.update('/user/casey/')
    })
    .step(() => {
      t.equal(router.component(), 'user', 'routes w/ missing optional parameter')
      t.equal(router.params.name(), 'casey', 'attaches required param to ctx.params[PARAM_NAME]')
      t.equal(router.params.operation(), undefined, 'optional param is `undefined` when missing')
      router.update('/user/casey/edit')
    })
    .step(() => {
      t.equal(router.params.operation(), 'edit', 'attaches optional param to ctx.params[PARAM_NAME]')
      router.update('/this/page/does/not/exist')
    })
    .step(() => {
      t.equal(router.component(), '404', 'asterisk route catches 404s')
      router.update('/file/foo/bar.zip')
    })
    .step(() => {
      t.equal(router.params.file(), 'foo/bar.zip', 'named wildcard routes are attaches to ctx.params[PARAM_NAME]')
    })

    // nested routing
    .step(() => {
      router.update('/nested/foo')
    })
    .step(() => {
      const nestedRouter = ko.contextFor($('ko-component-router', dom).get(0)).$router
      t.equal(nestedRouter.component(), 'foo', 'nested routing works')
    })

    // hash
    .step(() => {
      router.update('/about#foobar')
    })
    .step(() => {
      t.equal(router.hash(), 'foobar', 'hash is attached to ctx.hash()')
    })

    // query
    .step(() => {
      router.update('/about', {}, false, { foo: 'foo' })
      router.query.get('foo', 'foo')
    })
    .step(() => {
      const foo = router.query.get('foo', 'foo')
      const query = router.query.getAll()
      t.equal(foo(), 'foo', 'ctx.query.get works')
      t.deepEqual(query, { foo: 'foo' }, 'ctx.query.getAll works')
      router.update('/about', {}, false, { foo: 'bar' })
    })
    .step((done) => {
      const foo = router.query.get('foo', 'foo')
      t.equal(foo(), 'bar', 'querystring param is writeable')
      t.ok(decodeURIComponent(window.location.href).indexOf('[foo]=bar') > -1, 'non-default params are written to the querystring')

      const killMe = foo.subscribe(() => {
        t.equal(router.query.get('foo')(), 'foo', 'ctx.query.clear sets the params to defaults')
        t.ok(window.location.href.indexOf('%5Bfoo%5D=foo') < 0, 'default params are not in the querystring')
        killMe.dispose()
        done()
      })

      router.query.clear()
    })
    .step((done) => {
      const baz = router.query.get('baz')

      const killMe = baz.subscribe(() => {
        t.deepEqual(router.query.getAll(), { foo: 'bar', baz: 'qux' }, 'ctx.query.update works')
        killMe.dispose()
        done()
      })

      router.query.update({
        foo: 'bar',
        baz: 'qux'
      })
    })

    // bindings
    .step(() => {
      router.update('/bindings')
    })
    .step((done) => window.requestAnimationFrame(done))
    .step(() => {
      const link = $('#all-bindings-anchor', dom).get(0)
      link.click()
    })
    .step(() => {
      t.equal(router.component(), 'about', 'path binding navigates (used together)')
      t.deepEqual(router.state(), { foo: 'foo' }, 'state binding sets state (used together)')
      t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'query binding sets query (used together)')
    })
    .step(() => {
      router.update('/bindings', {}, false, { bar: 'bar' })
    })
    .step((done) => window.requestAnimationFrame(done))
    .step(() => {
      const link = $('#state-binding-anchor', dom).get(0)
      link.click()
    })
    .step(() => {
      t.equal(router.component(), 'bindings', 'state binding preserves path when used alone')
      t.deepEqual(router.state(), { foo: 'foo' }, 'state binding sets state when used alone')
      t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'state binding preserves query when used alone')
    })
    .step(() => {
      router.reload()
      router.update('/bindings', { bar: 'bar' }, false, { })
    })
    .step((done) => window.requestAnimationFrame(done))
    .step(() => {
      const link = $('#query-binding-anchor', dom).get(0)
      link.click()
    })
    .step(() => {
      t.equal(router.component(), 'bindings', 'query binding preserves path when used alone')
      t.deepEqual(router.state(), { bar: 'bar' }, 'query binding preserves state when used alone')
      t.deepEqual(router.query.getAll(), { bar: 'bar' }, 'query binding sets query when used alone')
    })
    .step(() => {
      const activeLink = $('#should-be-active', dom)
      t.ok(activeLink.hasClass('active-path'), 'path binding sets `active` class')
    })

    // anchors
    .step(() => {
      router.update('/anchors')
    })
    .step(() => {
      $('body').append($('#about-link', dom))
      const aboutLink = $('#about-link').get(0)

      aboutLink.click()
    })
    .step(() => {
      const aboutLink = $('#about-link').get(0)
      t.equal(ko.contextFor(aboutLink).$router.component(), 'about', 'clicking a link navigates')
    })
    .step(() => {
      router.update('/anchors')
    })
    .step(() => {
      $('body').append($('#ignored-links', dom))

      let count = 0
      $('body').on('click', (e) => {
        count++
        e.preventDefault()
      })

      $('#ignored-links *').each((i, el) => {
        el.click()
      })

      t.equal(count, $('#ignored-links *').length, 'ignores appropriate links')
    })

    .step(() => resolve())
  })
}

class RoutingTest {
  constructor(c) {
    this.config = c
    this.routes = {
      // explicit path
      '/about': 'about',

      // one required param (`name`)
      // one optional param (`operation`)
      '/user/:name/:operation?': 'user',

      // route w/ nested router
      '/nested/!': 'nested',

      // various test components
      '/bindings': 'bindings',
      '/anchors': 'anchors',

      // named wildcard segment
      '/file/:file(*)': 'file',

      // wildcard segment
      '/*': '404'
    }
  }
}

ko.components.register('about',   { synchronous: true, template: 'ABOUT' })
ko.components.register('user',    { synchronous: true, template: 'USER' })
ko.components.register('404',     { synchronous: true, template: '404' })
ko.components.register('file',    { synchronous: true, template: 'FILE' })
ko.components.register('foo',     { synchronous: true, template: 'FOO' })
ko.components.register('nested',  {
  synchronous: true,
  template: 'NESTED <ko-component-router params="routes: routes"></ko-component-router>',
  viewModel: class Nested {
    constructor() {
      this.routes = {
        '/foo': 'foo'
      }
    }
  }
})
ko.components.register('bindings', {
  synchronous: true,
  template: `
    BINDINGS
    <a id="should-be-active" data-bind="path: \'/bindings\'"></a>
    <a id="all-bindings-anchor" data-bind="path: \'/about\', state: { foo: 'foo' }, query: { bar: 'bar' }"></a>
    <a id="path-binding-anchor" data-bind="path: \'/about\'"></a>
    <a id="state-binding-anchor" data-bind="state: { foo: 'foo' }"></a>
    <a id="query-binding-anchor" data-bind="query: { bar: 'bar' }"></a>
  `
})
ko.components.register('anchors', {
  synchronous: true,
  template: `
    <a id="about-link" href="/about"></a>
    <div id="ignored-links">
      <button id="not-a-link"></button>
      <a id="download-link" download="/foo"></a>
      <a id="blank-target-link" target="_blank"></a>
      <a id="external-link" rel="external"></a>
      <a id="mailto-link" href="mailto:foobar@example.com"></a>
      <a id="cross-origin-link" href="http://example.com/"></a>
    </div>
  `
})

test('ko-component-router', (t) => {
  const NUM_TESTS = 28 * 4 + 4
  t.plan(NUM_TESTS)

  t.assert(ko.components.isRegistered('ko-component-router'), 'should register <ko-component-router />')
  t.ok(ko.bindingHandlers.path, 'should register path binding')
  t.ok(ko.bindingHandlers.state, 'should register state binding')
  t.ok(ko.bindingHandlers.query, 'should register query binding')

  runTests(t, { hashbang: false, base: '' })
    .then(() =>
  runTests(t, { hashbang: false, base: '/base' }))
    .then(() =>
  runTests(t, { hashbang: true, base: '' }))
    .then(() =>
  runTests(t, { hashbang: true, base: '/base' }))
})

function step(fn) {
  const p = new Promise((resolve) => {
    if (fn.length === 1) {
      fn(resolve)
    } else {
      fn()
      resolve()
    }
  })

  return {
    step(nextFn) {
      if (nextFn.length === 1) {
        return step((done) => {
          p.then(() => {
            nextFn(done)
          })
        })
      } else {
        return step((done) => {
          p.then(() => {
            nextFn()
            done()
          })
        })
      }
    }
  }
}