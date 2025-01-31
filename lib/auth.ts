import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './supabase/types'

export async function getCurrentCompany() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    throw new Error("Not authenticated")
  }

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select(`
      *,
      settings (*)
    `)
    .eq('id', session.user.id)
    .single()

  if (companyError || !company) {
    throw new Error("Company not found")
  }

  return company
}