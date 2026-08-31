import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tuznlaqncbrsbokbbzhy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2JHcnNib2tiYnpoeSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQyNjQ3NjQ5LCJleHAiOjIwNTgyMjM2NDl9.LkA0s9QSMGQ6VKB6BZMrr7UUlLQO6jK5OLLsLh0y9ls'
)

const { data, error } = await supabase
  .from('stores')
  .select('id, status', { count: 'exact', head: true })
  .eq('status', 'inactive')

if (error) {
  console.log('ERROR:', error.message)
} else {
  console.log('CANTIDAD INACTIVAS:', data.length)
}
