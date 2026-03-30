import urllib.request, json

url = "https://tuznlaqncbrsbokbbzhy.supabase.co/rest/v1/products?select=id,name,store_id,image_url&limit=2000"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyNzg0MiwiZXhwIjoyMDg5NjAzODQyfQ.LzSvnfBVSN_EqJTs7JqoRhIxa3dQ5CxFrxd4JmRER68"
req = urllib.request.Request(url, headers={"apikey": key, "Authorization": "Bearer " + key})
data = json.loads(urllib.request.urlopen(req).read())
print("=== PRODUCTOS SIN IMAGEN ===")
for row in data:
    img = (row.get("image_url") or "").strip()
    if not img:
        print(f"ID: {row[\"id\"]}  |  Tienda: {row[\"store_id\"]}  |  Nombre: {row[\"name\"]}")
