SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'store_purchased_features';

SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'store_purchased_features';
