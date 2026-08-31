import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tuznlaqncbrsbokbbzhy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyNzg0MiwiZXhwIjoyMDg5NjAzODQyfQ.LzSvnfBVSN_EqJTs7JqoRhIxa3dQ5CxFrxd4JmRER68'
)

const { count, error } = await supabase
  .from('stores')
  .select('*', { count: 'exact', head: true })

console.log('Total tiendas:', count)
if (error) console.log('Error:', error)
process.exit(0)
