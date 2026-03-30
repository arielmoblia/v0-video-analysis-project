import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'payments_config')
      .maybeSingle()
    const key = data?.value?.stripe_publishable_key || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
    return NextResponse.json({ publishableKey: key })
  } catch (e) {
    return NextResponse.json({ publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '' })
  }
}
