const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware('/api/todo', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/api/todo/edit', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/api/changeUrgentState', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/api/deleteTodo', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/api/todo/new', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/api/todo/register', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/api/todo/login', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/api/todo/logout', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/getAccessToken', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
  app.use(createProxyMiddleware('/getUserData', {
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
  )
}
