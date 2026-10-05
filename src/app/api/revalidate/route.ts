import { revalidateTag, revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    revalidateTag('articles')
    revalidatePath('/', 'layout')
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
