const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://tuznlaqncbrsbokbbzhy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzUzMjEsImV4cCI6MjA1NDE1MTMyMX0.SV0_Hq5akrnAjXjw8dqPmMZLUBuHRRRNEPOJi4EB1B4'
);
supabase.from('stores').select('id').then(r => {
  console.log('TOTAL:', r.data?.length);
  console.log('ERROR:', r.error);
  if (r.data) console.log('PRIMEROS 3:', r.data.slice(0,3));
  process.exit(0);
});
