const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/crpy')

const login = async (username, password) => {
  username = escape(username)

  // 生成加密密码
  password = genPassword(password)
  password = escape(password)

  const sql = `select username, realname from user where 
              username=${username} and password=${password}`
 
  const rows = await exec(sql)
  return rows[0] || {}
}

module.exports = {
  login
}