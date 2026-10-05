import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')
    if (!key) {
      return NextResponse.json({ ok: false, error: 'Key required' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'share-links' as any,
      where: { key: { equals: key } },
      limit: 1,
    })

    if (result.docs && result.docs.length > 0) {
      const link = result.docs[0] as any
      await payload.update({
        collection: 'share-links' as any,
        id: link.id,
        data: {
          clicks: (link.clicks || 0) + 1,
        },
      })
      return NextResponse.json({ ok: true, clicks: (link.clicks || 0) + 1 })
    }

    return NextResponse.json({ ok: false, error: 'Link not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to track' }, { status: 500 })
  }
}
