const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://tuznlaqncbrsbokbbzhy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzY1NTY4NSwiZXhwIjoyMDUzMjMxNjg1fQ.9FYYYwqR_F5dOASy8ub4FffKF-vICdYdLw3Mqo5SEic');
(async () => {
  const { data, error } = await supabase.from('stores').select('status');
  if (error) console.error('ERROR:', error);
  else {
    const counts = {};
    data.forEach(s => { counts[s.status] = (counts[s.status] || 0) + 1; });
    console.log('STATUS:', JSON.stringify(counts));
  }
})();
