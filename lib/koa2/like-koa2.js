const http = require('http')

// 组合中间件
function compose(middlewareList) {
  return function (ctx) {
    function dispatch(i) {
      const fn = middlewareList[i]
      try {
        // 用 Promise.resolve 包裹，兼容 fn 不是 async 函数的情况，保证每个中间件都返回 Promise 对象
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i + 1))
        )
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}

class LikeKoa2 {
  constructor() {
    this.middlewareList = []
  }

  use(fn) {
    this.middlewareList.push(fn)
    return this
  }

  createContext(req, res) {
    const ctx = {
      request: req, 
      response: res
    }
    ctx.query = req.query
    return ctx
  }

  handleRequest(fn, ctx) {
    return fn(ctx)
  }

  callback() {
    const fn = compose(this.middlewareList)

    return (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(fn, ctx)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = LikeKoa2