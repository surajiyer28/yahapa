import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default async function Home() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  redirect('/dashboard')
}
