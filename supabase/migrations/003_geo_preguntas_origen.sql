ALTER TABLE public.geo_preguntas
  ADD COLUMN IF NOT EXISTS origen TEXT NOT NULL DEFAULT 'semilla_serp';

UPDATE public.geo_preguntas SET origen = 'ganadora'
  WHERE pregunta IN (
    '¿Cuál es la mejor plataforma para crear una tienda online?',
    '¿Dónde puedo hacer mi tienda online gratis?',
    '¿Cuál es la plataforma de tienda online más barata?',
    '¿Cuál es la tienda online más rápida de armar?'
  );

NOTIFY pgrst, 'reload schema';
