import ko from 'knockout'
import pathtoRegexp from 'path-to-regexp'
import { isArray, isPlainObject, isString, runMiddleware, sequence } from './utils'

const appMiddleware = []

export default class Route {
  constructor(router, path, middleware) {
    this.middleware = []

    for (const m of isArray(middleware) ? middleware : [middleware]) {
      if (isString(m)) {
        this.component = m
      } else if (isPlainObject(m)) {
        path = path.replace(/\/?!?$/, '/!')
        this.children = m
        if (!this.component) {
          this.component = 'ko-component-router'
        }
      } else {
        this.middleware.push(m)
      }
    }

    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':__child_path__(.*)?')
    } else {
      path = path.replace(/\(?\*\)?/, '(.*)')
    }

    this._keys = []
    this._regexp = pathtoRegexp(path, this._keys)
  }

  matches(path) {
    return this._regexp.exec(path) !== null
  }

  parse(path) {
    let childPath
    const params = {}
    const matches = this._regexp.exec(path)

    for (let i = 1, len = matches.length; i < len; ++i) {
      const k = this._keys[i - 1]
      const v = matches[i] || ''
      if (k.name === '__child_path__') {
        childPath = '/' + v
      } else {
        params[k.name] = v
      }
    }

    return [params, path.replace(new RegExp(childPath + '$'), ''), childPath]
  }

  async run(ctx) {
    let disposals = []
    this.dispose = async () => {
      if (ctx.$child) {
        await ctx.$child.route.dispose()
      }
      return await sequence(disposals)
    }

    const [appUpstream, appNext] = runMiddleware(appMiddleware, ctx)
    disposals = [
      // before dispose
      appNext,
      // dispose
      appNext
    ]
    await appUpstream

    const [routeUpstream, routeNext] = runMiddleware(this.middleware, ctx)
    disposals = [
      // before dispose
      routeNext,
      appNext,
      () => {
        ctx.router.component(false)
        ko.tasks.runEarly()
      },
      // after dispose
      routeNext,
      appNext
    ]
    await routeUpstream

    if (ctx.route.component) {
      ctx.router.component(ctx.route.component)
      ko.tasks.runEarly()
    }

    // after render
    await appNext()
    await routeNext()
  }

  static use(fn) {
    appMiddleware.push(fn)
  }
}
