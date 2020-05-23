const Koa = require('./like-koa2')
const app = new Koa()

// logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx['X-Response-Time']
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`)
})

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx['X-Response-Time'] = `${ms}ms`
})

// response
app.use(async ctx => {
  ctx.response.end('This is like koa2')
})

app.listen(3000)