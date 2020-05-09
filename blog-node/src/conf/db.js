const env = process.env.NODE_ENV      // 环境参数

// 配置
let MYSQL_CONF

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '199687+-+2',
    port: 3306,
    database: 'myblog'
  }
}

if (env === 'productin') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '199687+-+2',
    port: 3306,
    database: 'myblog'
  }
}

module.exports = {
  MYSQL_CONF
}