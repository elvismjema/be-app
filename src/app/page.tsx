import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/home/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: couple } = await supabase
    .from('couples')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .single()

  if (!couple) redirect('/setup')

  const partnerId = couple.user1_id === user.id ? couple.user2_id : couple.user1_id
  const { data: partner } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', partnerId)
    .single()

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email!,
        display_name: profile?.display_name || null,
        avatar_url: profile?.avatar_url || null,
        timezone: profile?.timezone || null,
        last_seen_at: profile?.last_seen_at || null,
        created_at: profile?.created_at || '',
      }}
      couple={couple}
      partner={partner ? {
        id: partner.id,
        email: '',
        display_name: partner.display_name,
        avatar_url: partner.avatar_url,
        timezone: partner.timezone || null,
        last_seen_at: partner.last_seen_at || null,
        created_at: partner.created_at,
      } : null}
    />
  )
}
