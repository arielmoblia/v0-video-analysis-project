1:"$Sreact.fragment"
4:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/5c74a79c39959cb8.js"],"OutletBoundary"]
5:"$Sreact.suspense"
2:T1387,<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #ffffff; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, sans-serif; position: relative; }
  .side-label { position: fixed; right: 0; top: 50%; transform: translateY(-50%) rotate(90deg); transform-origin: center center; color: #8899aa; font-size: 13px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; }
  .calc { background: #1a2035; border-radius: 32px; padding: 20px 16px 16px; width: 300px; }
  .badge { display: flex; justify-content: center; margin-bottom: 12px; }
  .badge span { background: #1e2d45; color: #4fc3f7; font-size: 11px; font-weight: 600; padding: 5px 14px; border-radius: 20px; border: 1px solid #2a3f5c; display: flex; align-items: center; gap: 6px; }
  .badge span::before { content: ''; width: 7px; height: 7px; background: #4caf50; border-radius: 50%; display: inline-block; }
  .title { text-align: center; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: 1px; margin-bottom: 16px; }
  .title .blue { color: #4fc3f7; }
  .title .pro { color: #8899aa; font-size: 14px; font-weight: 400; letter-spacing: 3px; }
  .display { background: #141928; border-radius: 20px; padding: 20px 24px 16px; margin-bottom: 16px; min-height: 90px; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-end; gap: 4px; }
  .display .expr { color: #556677; font-size: 14px; min-height: 18px; }
  .display .result { color: #fff; font-size: 48px; font-weight: 300; word-break: break-all; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .btn { border: none; border-radius: 16px; height: 64px; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity 0.1s, transform 0.1s; }
  .btn:active { opacity: 0.7; transform: scale(0.95); }
  .btn-num { background: #232d42; color: #fff; }
  .btn-op  { background: #2563eb; color: #fff; }
  .btn-ac  { background: #232d42; color: #f87171; font-size: 18px; font-weight: 700; }
  .btn-del { background: #232d42; color: #fff; }
  .btn-pct { background: #232d42; color: #4fc3f7; }
  .btn-eq  { background: linear-gradient(145deg, #3b82f6, #2dd4bf); color: #fff; }
  .span2 { grid-column: span 2; }
</style>
</head>
<body>
<div class="side-label">calculadora</div>
<div class="calc">
  <div class="badge"><span>ONLINE PRO VERSION</span></div>
  <div class="title"><span class="blue">CALCMASTER</span> <span class="pro">PRO</span></div>
  <div class="display">
    <div class="expr" id="expr"></div>
    <div class="result" id="result">0</div>
  </div>
  <div class="grid">
    <button class="btn btn-ac" onclick="ac()">AC</button>
    <button class="btn btn-del" onclick="del()">⌫</button>
    <button class="btn btn-pct" onclick="pct()">%</button>
    <button class="btn btn-op" onclick="op('/')">÷</button>
    <button class="btn btn-num" onclick="num('7')">7</button>
    <button class="btn btn-num" onclick="num('8')">8</button>
    <button class="btn btn-num" onclick="num('9')">9</button>
    <button class="btn btn-op" onclick="op('*')">×</button>
    <button class="btn btn-num" onclick="num('4')">4</button>
    <button class="btn btn-num" onclick="num('5')">5</button>
    <button class="btn btn-num" onclick="num('6')">6</button>
    <button class="btn btn-op" onclick="op('-')">−</button>
    <button class="btn btn-num" onclick="num('1')">1</button>
    <button class="btn btn-num" onclick="num('2')">2</button>
    <button class="btn btn-num" onclick="num('3')">3</button>
    <button class="btn btn-op" onclick="op('+')">+</button>
    <button class="btn btn-num span2" onclick="num('0')">0</button>
    <button class="btn btn-num" onclick="num('.')">.</button>
    <button class="btn btn-eq" onclick="eq()">=</button>
  </div>
</div>
<script>
  let current='0', expr='', fresh=false;
  const R=document.getElementById('result'), E=document.getElementById('expr');
  function update(){R.textContent=current;}
  function num(n){if(fresh){current='';fresh=false;}if(n==='.'&&current.includes('.'))return;current=(current==='0'&&n!=='.')?n:current+n;update();}
  function op(o){expr=current+' '+o;E.textContent=expr;fresh=true;}
  function eq(){if(!expr)return;const p=expr.trim().split(' '),a=parseFloat(p[0]),o=p[1],b=parseFloat(current);let r;if(o==='+')r=a+b;if(o==='-')r=a-b;if(o==='*')r=a*b;if(o==='/')r=b===0?'Error':a/b;E.textContent=expr+' '+current+' =';current=typeof r==='number'?parseFloat(r.toPrecision(10)).toString():r;expr='';fresh=true;update();}
  function ac(){current='0';expr='';E.textContent='';fresh=false;update();}
  function del(){current=current.length>1?current.slice(0,-1):'0';update();}
  function pct(){current=(parseFloat(current)/100).toString();update();}
</script>
</body>
</html>0:{"buildId":"nIoqfUUkrSHueY-27IVJ_","rsc":["$","$1","c",{"children":[["$","iframe",null,{"srcDoc":"$2","style":{"width":"100%","height":"100vh","border":"none"}}],null,"$L3"]}],"loading":null,"isPartial":false}
3:["$","$L4",null,{"children":["$","$5",null,{"name":"Next.MetadataOutlet","children":"$@6"}]}]
6:null
