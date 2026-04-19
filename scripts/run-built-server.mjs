import http from 'node:http'
import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const clientDir = path.join(rootDir, 'dist/client')
const serverModuleUrl = url.pathToFileURL(
  path.join(rootDir, 'dist/server/server.js'),
).href

const mod = await import(serverModuleUrl)
const app = mod.default || mod.app || mod
const port = Number(process.env.PORT || 3000)

const CACHEABLE_ASSET_PREFIXES = ['/assets/', '/fonts/']
const MIME_TYPES = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.glb': 'model/gltf-binary',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
}

function isCacheableAsset(pathname) {
  return CACHEABLE_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function getSafeClientPath(pathname) {
  const decodedPath = decodeURIComponent(pathname)
  const relativePath = decodedPath.replace(/^\/+/, '')
  const filePath = path.resolve(clientDir, relativePath)

  if (
    filePath !== clientDir &&
    !filePath.startsWith(`${clientDir}${path.sep}`)
  ) {
    return null
  }

  return filePath
}

async function sendFile(res, filePath, method, requestPathname) {
  const stat = await fs.stat(filePath)

  if (!stat.isFile()) {
    return false
  }

  const contentType =
    MIME_TYPES[path.extname(filePath).toLowerCase()] ||
    'application/octet-stream'
  res.statusCode = 200
  res.setHeader('content-type', contentType)
  res.setHeader('content-length', stat.size)

  if (isCacheableAsset(requestPathname)) {
    res.setHeader('cache-control', 'public, max-age=31536000, immutable')
  }

  if (method === 'HEAD') {
    res.end()
    return true
  }

  res.end(await fs.readFile(filePath))
  return true
}

async function tryServeStaticAsset(req, res) {
  const requestUrl = new URL(req.url || '/', `http://localhost:${port}`)
  const filePath = getSafeClientPath(requestUrl.pathname)

  if (!filePath) {
    return false
  }

  try {
    return await sendFile(
      res,
      filePath,
      req.method || 'GET',
      requestUrl.pathname,
    )
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return false
    }
    throw error
  }
}

async function tryServeNetlifyImagePassthrough(req, res) {
  const requestUrl = new URL(req.url || '/', `http://localhost:${port}`)

  if (requestUrl.pathname !== '/.netlify/images') {
    return false
  }

  const sourceUrl = requestUrl.searchParams.get('url')

  if (!sourceUrl?.startsWith('/')) {
    res.statusCode = 400
    res.end('Missing or invalid image url parameter')
    return true
  }

  const filePath = getSafeClientPath(sourceUrl)

  if (!filePath) {
    res.statusCode = 400
    res.end('Invalid image path')
    return true
  }

  try {
    return await sendFile(res, filePath, req.method || 'GET', sourceUrl)
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      res.statusCode = 404
      res.end('Image not found')
      return true
    }
    throw error
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (await tryServeNetlifyImagePassthrough(req, res)) {
      return
    }

    if (await tryServeStaticAsset(req, res)) {
      return
    }

    const requestUrl = new URL(req.url || '/', `http://localhost:${port}`)
    const chunks = []

    for await (const chunk of req) {
      chunks.push(chunk)
    }

    const request = new Request(requestUrl, {
      method: req.method,
      headers: req.headers,
      body:
        req.method === 'GET' || req.method === 'HEAD'
          ? undefined
          : Buffer.concat(chunks),
    })
    const response = await app.fetch(request)

    res.statusCode = response.status
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    if (!response.body || req.method === 'HEAD') {
      res.end()
      return
    }

    res.end(Buffer.from(await response.arrayBuffer()))
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.end(String(error?.stack || error))
  }
})

server.listen(port, () => {
  console.log(`Production server listening on http://localhost:${port}`)
})
