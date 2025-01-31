import { NextResponse } from "next/server"
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/types'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const data = await req.formData()
    
    const callSid = data.get('CallSid') as string
    const callStatus = data.get('CallStatus') as string
    const duration = data.get('CallDuration') as string
    const recordingUrl = data.get('RecordingUrl') as string

    const { error } = await supabase
      .from('calls')
      .update({
        status: callStatus,
        duration: duration ? parseInt(duration) : null,
        recording_url: recordingUrl
      })
      .eq('call_sid', callSid)

    if (error) {
      throw error
    }

    return new NextResponse('OK')
  } catch (error) {
    console.error('Error updating call status:', error)
    return new NextResponse('Error', { status: 500 })
  }
}