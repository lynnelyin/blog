const handleBlogRouter = (req, res) => {
  const method = req.method

  if (method == 'GET' && req.path == '/api/blog/list') {
    return {
      msg: '博客列表接口'
    }
  }
  if (method == 'GET' && req.path == '/api/blog/detail') {
    return {
      msg: ' 博客详情接口'
    }
  }
  if (method == 'POST' && req.path == '/api/blog/new') {
    return {
      msg: '新建博客接口'
    }
  }
  if (method == 'POST' && req.path == '/api/blog/update') {
    return {
      msg: '更新博客接口'
    }
  }
  if (method == 'POST' && req.path == '/api/blog/del') {
    return {
      msg: '删除博客接口'
    }
  }
}

module.exports = handleBlogRouter