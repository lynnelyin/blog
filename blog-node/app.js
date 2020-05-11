const handleBlogRouter = require('./src/router/blog')
const handlerUserRouter = require('./src/router/user')
const querystring = require('querystring')

// 获取 cookie 过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

// session 数据
const SESSION_DATA = {}

const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
}
 
const serverHandler = (req, res) => {
  // 设置返回格式为 JSON
  res.setHeader('Content-type', 'application/json')

  // 获取 path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析 query
  req.query = querystring.parse(url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    // 拼接 cookie 的时候会添加空格
    const key = arr[0].trim()
    const value = arr[1].trim()
    req.cookie[key] = value
  })

  // 解析 session
  let needSetCookie = false
  let sessionId = req.cookie.sessionId
  if (sessionId) {
    if (!SESSION_DATA[sessionId]) {
      SESSION_DATA[sessionId] = {}
    }
  } else {
    needSetCookie = true
    sessionId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[sessionId] = {}
  }
  req.session = SESSION_DATA[sessionId]
  
  // 处理 post data
  getPostData(req).then(postData => {
    req.body = postData

    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `sessionId=${sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData))
      })
      return
    }
  
    // 处理 user 路由
    const userResult = handlerUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `sessionId=${sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 未命中路由，返回 404
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
  })
}

module.exports = serverHandler