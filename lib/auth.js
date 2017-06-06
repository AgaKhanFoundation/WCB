let accessToken = process.env.ACCESS_TOKEN

async function auth (ctx, next) {
  // for health check skipping / and retunrning 200
  if (ctx.request.url === '/') {
    return await next()
  }

  // Check if access_token is present in header
  if (Object.prototype.hasOwnProperty.call(ctx.request.headers, 'access_token') &&
      ctx.request.headers['access_token'] === accessToken) {
    return await next()
  }
  /*
  // Check if access_token is present in query
  if (Object.prototype.hasOwnProperty.call(ctx.request.query, 'access_token') &&
      ctx.request.query['access_token'] === accessToken) {
    return await next()
  }
  */
  ctx.body = `Please provide access_token to use WCB service.`
  ctx.response.status = 401
}

module.exports = auth
