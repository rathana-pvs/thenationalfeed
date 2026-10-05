import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.pdf': 'application/pdf',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  const { filename } = await params
  if (!filename || filename.length === 0) {
    return new NextResponse('File Not Found', { status: 404 })
  }

  const rawFilename = filename.join('/')
  const baseDir = path.resolve(process.cwd(), 'public/media')
  const filePath = path.resolve(baseDir, rawFilename)

  // Security check: prevent directory traversal
  if (!filePath.startsWith(baseDir)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File Not Found', { status: 404 })
  }

  try {
    const stats = fs.statSync(filePath)
    if (!stats.isFile()) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_MAP[ext] || 'application/octet-stream'
    const fileBuffer = fs.readFileSync(filePath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving media file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  const { filename } = await params
  if (!filename || filename.length === 0) {
    return new NextResponse(null, { status: 404 })
  }

  const rawFilename = filename.join('/')
  const baseDir = path.resolve(process.cwd(), 'public/media')
  const filePath = path.resolve(baseDir, rawFilename)

  if (!filePath.startsWith(baseDir) || !fs.existsSync(filePath)) {
    return new NextResponse(null, { status: 404 })
  }

  const stats = fs.statSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_MAP[ext] || 'application/octet-stream'

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': stats.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
