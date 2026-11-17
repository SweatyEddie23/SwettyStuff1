const games = [
  {id:"rhythm",name:"Rhythm Plus",desc:"Hit the notes to the beat.",icon:"🎵",category:"External",type:"external",url:"https://rhythm-plus.com/",note:"This site may block being shown inside another website. If the frame stays blank, open the game directly from its official site."},
  {id:"basket-random",name:"Basket Random",desc:"Chaotic two-player basketball.",icon:"🏀",category:"External",type:"external",url:"https://www.twoplayergames.org/Basket-Random/1742.html",note:"This site may block being shown inside another website. If the frame stays blank, the site does not allow this embed."},
  {id:"snake",name:"Snake",desc:"Eat, grow, and avoid yourself.",icon:"🐍",category:"Arcade",type:"mini"},
  {id:"2048",name:"2048",desc:"Combine tiles to reach 2048.",icon:"🔢",category:"Puzzle",type:"mini"},
  {id:"tetris",name:"Block Drop",desc:"Fit falling blocks into lines.",icon:"🧱",category:"Puzzle",type:"mini"},
  {id:"pong",name:"Pong",desc:"Keep the ball in play.",icon:"🏓",category:"Arcade",type:"mini"},
  {id:"breakout",name:"Breakout",desc:"Clear the wall of bricks.",icon:"🟪",category:"Arcade",type:"mini"},
  {id:"mines",name:"Minesweeper",desc:"Find the safe squares.",icon:"💣",category:"Puzzle",type:"mini"},
  {id:"connect",name:"Connect Four",desc:"Get four in a row.",icon:"🔴",category:"Strategy",type:"mini"},
  {id:"tictactoe",name:"Tic-Tac-Toe",desc:"Beat a friend or the computer.",icon:"❎",category:"Strategy",type:"mini"},
  {id:"memory",name:"Memory Match",desc:"Find all matching pairs.",icon:"🧠",category:"Puzzle",type:"mini"},
  {id:"platform",name:"Sky Hopper",desc:"Jump across floating platforms.",icon:"🪂",category:"Arcade",type:"mini"},
  {id:"reaction",name:"Reaction Time",desc:"Test your response speed.",icon:"⚡",category:"Skill",type:"mini"},
  {id:"mole",name:"Whack-a-Mole",desc:"Tap the mole before it vanishes.",icon:"🐹",category:"Skill",type:"mini"},
  {id:"basketball",name:"Hoop Shot",desc:"Time your shots and score.",icon:"🏀",category:"Sports",type:"mini"},
  {id:"football",name:"Fourth Down",desc:"Aim and throw for the target.",icon:"🏈",category:"Sports",type:"mini"}
];

const homeView=document.getElementById("homeView"), playerView=document.getElementById("playerView");
const grid=document.getElementById("gameGrid"), search=document.getElementById("searchInput");
const stage=document.getElementById("gameStage"), note=document.getElementById("gameNote");
let cleanupCurrent=null;

function renderCards(){
  const q=search.value.toLowerCase().trim();
  const filtered=games.filter(g=>(g.name+" "+g.desc+" "+g.category).toLowerCase().includes(q));
  grid.innerHTML=filtered.map(g=>`<button class="game-card" data-id="${g.id}"><span class="card-arrow">↗</span><div class="game-icon">${g.icon}</div><h3>${g.name}</h3><p>${g.desc}</p></button>`).join("");
  document.getElementById("gameCount").textContent=`${games.length} games in the library`;
  document.getElementById("noResults").classList.toggle("hidden",filtered.length>0);
}
renderCards();
search.addEventListener("input",renderCards);
grid.addEventListener("click",e=>{const card=e.target.closest("[data-id]");if(card)openGame(card.dataset.id);});
document.getElementById("backButton").onclick=showHome;
document.getElementById("homeLink").onclick=e=>{e.preventDefault();showHome();};

function openGame(id){
  const game=games.find(g=>g.id===id); if(!game)return;
  homeView.classList.add("hidden");playerView.classList.remove("hidden");
  document.getElementById("playerTitle").textContent=game.name;
  document.getElementById("playerCategory").textContent=game.category;
  stage.innerHTML="";note.textContent=game.note||"";
  if(cleanupCurrent){cleanupCurrent();cleanupCurrent=null;}
  if(game.type==="external"){
    stage.innerHTML=`<iframe class="external-frame" src="${game.url}" title="${game.name}" allow="fullscreen; autoplay; gamepad" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  } else launchMiniGame(id);
  window.scrollTo({top:0,behavior:"smooth"});
}
function showHome(){
  if(cleanupCurrent){cleanupCurrent();cleanupCurrent=null;}
  stage.innerHTML="";playerView.classList.add("hidden");homeView.classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});
}
function ui(title,help=""){
  stage.innerHTML=`<div class="game-ui"><h3>${title}</h3>${help?`<p>${help}</p>`:""}<div id="gameMount"></div></div>`;
  return document.getElementById("gameMount");
}
function button(label,fn){const b=document.createElement("button");b.textContent=label;b.onclick=fn;return b;}
function canvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;c.className="game-canvas";return c;}
function launchMiniGame(id){
  const mount=ui(games.find(g=>g.id===id).name);
  const listen=[];let interval=null,raf=null;
  const on=(target,event,fn)=>{target.addEventListener(event,fn);listen.push(()=>target.removeEventListener(event,fn));};
  const finish=()=>{listen.forEach(f=>f());if(interval)clearInterval(interval);if(raf)cancelAnimationFrame(raf);};
  cleanupCurrent=finish;

  if(id==="snake"){
    mount.innerHTML='<p class="controls">Use arrow keys or WASD. Press Restart to begin again.</p><p class="scoreline" id="sc">Score: 0</p>';
    const c=canvas(400,400),ctx=c.getContext("2d");mount.append(c);
    let snake,dir,next,food,score,dead;
    function reset(){snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};next=dir;food={x:15,y:10};score=0;dead=false;draw();}
    function draw(){ctx.fillStyle="#090d1c";ctx.fillRect(0,0,400,400);ctx.fillStyle="#61e4df";snake.forEach(p=>ctx.fillRect(p.x*20+2,p.y*20+2,16,16));ctx.fillStyle="#ff7a9d";ctx.fillRect(food.x*20+3,food.y*20+3,14,14);document.getElementById("sc").textContent="Score: "+score;if(dead){ctx.fillStyle="white";ctx.font="bold 26px sans-serif";ctx.fillText("Game over",135,205);}}
    function tick(){if(dead)return;dir=next;let h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.x>=20||h.y<0||h.y>=20||snake.some(p=>p.x===h.x&&p.y===h.y)){dead=true;draw();return;}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};}else snake.pop();draw();}
    on(window,"keydown",e=>{const m={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};const v=m[e.key];if(v&&!(v[0]===-dir.x&&v[1]===-dir.y)){next={x:v[0],y:v[1]};e.preventDefault();}});
    mount.append(button("Restart",()=>{reset();if(interval)clearInterval(interval);interval=setInterval(tick,115);}));reset();interval=setInterval(tick,115);
  }

  if(id==="2048"){
    mount.innerHTML='<p class="controls">Use arrow keys. Combine matching numbers.</p><div class="big-number" id="score">Score: 0</div><div id="board" class="grid-board" style="grid-template-columns:repeat(4,1fr)"></div>';
    let a,score=0,over=false;const board=document.getElementById("board"),sc=document.getElementById("score");
    function add(){let z=[];a.forEach((v,i)=>{if(!v)z.push(i)});if(z.length)a[z[Math.floor(Math.random()*z.length)]]=Math.random()<.9?2:4;}
    function draw(){board.innerHTML=a.map(v=>`<div class="cell ${v?"active": "empty"}" style="${v?`background:${v>=128?"#a45bd0":v>=32?"#6756bb":"#39335e"}`:""}">${v||""}</div>`).join("");sc.textContent="Score: "+score;}
    function move(d){if(over)return;let old=a.join(",");for(let k=0;k<4;k++){let line=[];for(let j=0;j<4;j++){let i=d==="left"?k*4+j:d==="right"?k*4+3-j:d==="up"?j*4+k:(3-j)*4+k;line.push(a[i]);}let vals=line.filter(Boolean);for(let j=0;j<vals.length-1;j++)if(vals[j]===vals[j+1]){vals[j]*=2;score+=vals[j];vals.splice(j+1,1);}while(vals.length<4)vals.push(0);for(let j=0;j<4;j++){let i=d==="left"?k*4+j:d==="right"?k*4+3-j:d==="up"?j*4+k:(3-j)*4+k;a[i]=vals[j];}}if(old!==a.join(","))add();draw();}
    function reset(){a=Array(16).fill(0);score=0;add();add();draw();}
    on(window,"keydown",e=>{let m={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"};if(m[e.key]){e.preventDefault();move(m[e.key]);}});mount.append(button("New game",reset));reset();
  }

  if(id==="tetris"){
    mount.innerHTML='<p class="controls">← → move · ↑ rotate · ↓ drop faster</p><p class="scoreline" id="ts">Lines: 0</p>';
    const c=canvas(240,400),ctx=c.getContext("2d");mount.append(c);
    const shapes=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];
    let board,shape,x,y,lines=0,dead=false;
    function spawn(){shape=shapes[Math.floor(Math.random()*shapes.length)].map(r=>r.slice());x=3;y=0;if(hit(x,y,shape))dead=true;}
    function hit(nx,ny,s){return s.some((r,dy)=>r.some((v,dx)=>v&&(nx+dx<0||nx+dx>=10||ny+dy>=20||(ny+dy>=0&&board[ny+dy][nx+dx]))));}
    function rotate(){let r=shape[0].map((_,i)=>shape.map(row=>row[i]).reverse());if(!hit(x,y,r))shape=r;}
    function draw(){ctx.fillStyle="#090d1c";ctx.fillRect(0,0,240,400);for(let yy=0;yy<20;yy++)for(let xx=0;xx<10;xx++){if(board[yy][xx]){ctx.fillStyle="#9a79ff";ctx.fillRect(xx*24+1,yy*20+1,22,18);}}shape.forEach((r,dy)=>r.forEach((v,dx)=>{if(v){ctx.fillStyle="#61e4df";ctx.fillRect((x+dx)*24+1,(y+dy)*20+1,22,18);}}));document.getElementById("ts").textContent="Lines: "+lines;if(dead){ctx.fillStyle="white";ctx.font="20px sans-serif";ctx.fillText("Game over",72,205);}}
    function tick(){if(dead)return;if(!hit(x,y+1,shape))y++;else{shape.forEach((r,dy)=>r.forEach((v,dx)=>{if(v&&y+dy>=0)board[y+dy][x+dx]=1;}));for(let yy=19;yy>=0;yy--)if(board[yy].every(Boolean)){board.splice(yy,1);board.unshift(Array(10).fill(0));lines++;yy++;}spawn();}draw();}
    function reset(){board=Array.from({length:20},()=>Array(10).fill(0));lines=0;dead=false;spawn();draw();}
    on(window,"keydown",e=>{if(e.key==="ArrowLeft"&&!hit(x-1,y,shape))x--;if(e.key==="ArrowRight"&&!hit(x+1,y,shape))x++;if(e.key==="ArrowDown")tick();if(e.key==="ArrowUp")rotate();draw();});
    mount.append(button("Restart",()=>{reset();clearInterval(interval);interval=setInterval(tick,550);}));reset();interval=setInterval(tick,550);
  }

  if(id==="pong"||id==="breakout"){
    const isPong=id==="pong";mount.innerHTML=`<p class="controls">${isPong?"Move your mouse or use ↑ ↓ to control the paddle.":"Move your mouse or use ← →. Clear every brick."}</p><p class="scoreline" id="ps">Score: 0</p>`;
    const c=canvas(500,300),ctx=c.getContext("2d");mount.append(c);
    let px=220,ball={x:250,y:150,vx:3.2,vy:2.5},score=0,bricks=[];
    if(!isPong)for(let r=0;r<4;r++)for(let col=0;col<9;col++)bricks.push({x:14+col*53,y:25+r*24,on:true});
    function draw(){ctx.fillStyle="#090d1c";ctx.fillRect(0,0,500,300);ctx.fillStyle="#61e4df";ctx.fillRect(px,270,isPong?80:90,10);ctx.beginPath();ctx.arc(ball.x,ball.y,7,0,Math.PI*2);ctx.fill();if(isPong){ctx.setLineDash([7,8]);ctx.strokeStyle="#777";ctx.beginPath();ctx.moveTo(250,0);ctx.lineTo(250,300);ctx.stroke();}else bricks.forEach(b=>{if(b.on){ctx.fillStyle="#9a79ff";ctx.fillRect(b.x,b.y,45,15);}});document.getElementById("ps").textContent="Score: "+score;}
    function tick(){ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x<7||ball.x>493)ball.vx*=-1;if(ball.y<7)ball.vy*=-1;if(ball.y>260&&ball.x>px&&ball.x<px+(isPong?80:90)){ball.vy=-Math.abs(ball.vy);score++;}if(isPong&&ball.x>480){ball.x=250;ball.y=150;ball.vx=-3.2;}if(!isPong){let b=bricks.find(b=>b.on&&ball.x>b.x&&ball.x<b.x+45&&ball.y>b.y&&ball.y<b.y+15);if(b){b.on=false;ball.vy*=-1;score+=10;}}if(ball.y>310){ball={x:250,y:150,vx:3.2,vy:2.5};}draw();}
    on(c,"mousemove",e=>{let r=c.getBoundingClientRect();px=(e.clientX-r.left)*500/r.width-(isPong?40:45);px=Math.max(0,Math.min(500-(isPong?80:90),px));});
    on(window,"keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowUp")px=Math.max(0,px-25);if(e.key==="ArrowRight"||e.key==="ArrowDown")px=Math.min(410,px+25);});
    mount.append(button("Restart",()=>{score=0;bricks.forEach(b=>b.on=true);ball={x:250,y:150,vx:3.2,vy:2.5};}));draw();interval=setInterval(tick,16);
  }

  if(id==="mines"){
    mount.innerHTML='<p class="controls">Reveal every safe square. Right-click to flag a suspected mine.</p><div id="mineBoard" class="grid-board" style="grid-template-columns:repeat(9,1fr);max-width:360px"></div>';
    const b=document.getElementById("mineBoard");let mines,open,flags,done=false;
    function reset(){mines=new Set();while(mines.size<10)mines.add(Math.floor(Math.random()*81));open=new Set();flags=new Set();done=false;draw();}
    function draw(){b.innerHTML="";for(let i=0;i<81;i++){let el=document.createElement("div");el.className="cell "+(open.has(i)?"active":"empty");el.textContent=flags.has(i)?"⚑":open.has(i)?(mines.has(i)?"✹":near(i)||""):"";el.oncontextmenu=e=>{e.preventDefault();if(!open.has(i)&&!done){flags.has(i)?flags.delete(i):flags.add(i);draw();}};el.onclick=()=>reveal(i);b.append(el);}}
    function near(i){let x=i%9,y=Math.floor(i/9),n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){let xx=x+dx,yy=y+dy;if(xx>=0&&xx<9&&yy>=0&&yy<9&&mines.has(yy*9+xx))n++;}return n;}
    function reveal(i){if(done||open.has(i)||flags.has(i))return;open.add(i);if(mines.has(i)){done=true;open=new Set(Array.from({length:81},(_,k)=>k));note.textContent="Mine hit! Press New board to try again.";}else if(open.size===71){done=true;note.textContent="You cleared the board!";}draw();}
    mount.append(button("New board",reset));reset();
  }

  if(id==="connect"||id==="tictactoe"){
    const connect=id==="connect",n=connect?42:9;
    mount.innerHTML=`<p class="controls">${connect?"Take turns dropping discs. First to connect four wins.":"You are X. The computer is O."}</p><p class="scoreline" id="turn"></p><div id="playBoard" class="grid-board" style="grid-template-columns:repeat(${connect?7:3},1fr);max-width:${connect?420:300}px"></div>`;
    const b=document.getElementById("playBoard"),turn=document.getElementById("turn");let a,player="X",over=false;
    function reset(){a=Array(n).fill("");player="X";over=false;note.textContent="";draw();}
    function winner(p){const dirs=connect?[[1,0],[0,1],[1,1],[1,-1]]:[[1,0],[0,1],[1,1],[1,-1]];let w=connect?4:3,wid=connect?7:3,hei=connect?6:3;for(let y=0;y<hei;y++)for(let x=0;x<wid;x++)if(a[y*wid+x]===p)for(let[dX,dY]of dirs){let ok=true;for(let k=1;k<w;k++){let xx=x+dX*k,yy=y+dY*k;if(xx<0||xx>=wid||yy<0||yy>=hei||a[yy*wid+xx]!==p){ok=false;break;}}if(ok)return true;}return false;}
    function draw(){b.innerHTML="";for(let i=0;i<n;i++){let el=document.createElement("div");el.className="cell "+(a[i]?"active":"empty");el.style.aspectRatio=connect?"1":"1";el.textContent=a[i];el.style.color=a[i]==="X"?"#61e4df":"#ff8eaa";el.onclick=()=>play(i);b.append(el);}turn.textContent=over?"Round over":`Turn: ${player}`;}
    function play(i){if(over)return;if(connect){let col=i%7,row=-1;for(let y=5;y>=0;y--)if(!a[y*7+col]){row=y;break;}if(row<0)return;i=row*7+col;}if(a[i])return;a[i]=player;if(winner(player)){over=true;note.textContent=player+" wins!";}else if(a.every(Boolean)){over=true;note.textContent="It's a draw!";}else{player=player==="X"?"O":"X";if(!connect&&player==="O")setTimeout(computer,250);}draw();}
    function computer(){if(over)return;let empties=a.map((v,i)=>v?null:i).filter(v=>v!==null);let choice=empties.find(i=>{a[i]="O";let w=winner("O");a[i]="";return w;});if(choice===undefined)choice=empties.find(i=>{a[i]="X";let w=winner("X");a[i]="";return w;});if(choice===undefined)choice=empties[Math.floor(Math.random()*empties.length)];if(choice!==undefined)play(choice);}
    mount.append(button("New game",reset));reset();
  }

  if(id==="memory"){
    mount.innerHTML='<p class="controls">Flip two cards. Match all the pairs.</p><p class="scoreline" id="mm">Matches: 0 / 8</p><div id="mem" class="memory-grid"></div>';
    const b=document.getElementById("mem"),icons=["🍉","🚀","🎮","🐸","⭐","🍕","🎧","🦊"];let deck,opened,matches,lock;
    function reset(){deck=[...icons,...icons].sort(()=>Math.random()-.5);opened=[];matches=0;lock=false;draw();}
    function draw(){b.innerHTML="";deck.forEach((v,i)=>{let el=button(opened.includes(i)||deck[i]===null?v:"?",()=>flip(i));el.className="memory-card"+(opened.includes(i)||v===null?" revealed":"");if(v===null)el.textContent="✓";b.append(el);});document.getElementById("mm").textContent=`Matches: ${matches} / 8`;}
    function flip(i){if(lock||opened.includes(i)||deck[i]===null)return;opened.push(i);draw();if(opened.length===2){lock=true;setTimeout(()=>{let[a,bx]=opened;if(deck[a]===deck[bx]){deck[a]=deck[bx]=null;matches++;}opened=[];lock=false;draw();if(matches===8)note.textContent="Perfect memory! You found every pair.";},650);}}
    mount.append(button("Shuffle",reset));reset();
  }

  if(id==="platform"){
    mount.innerHTML='<p class="controls">Use ← → or A/D to move, Space or ↑ to jump. Land on platforms and climb.</p><p class="scoreline" id="heightScore">Height: 0</p>';
    const c=canvas(440,420),ctx=c.getContext("2d");mount.append(c);let keys={},p,plats,camera,score,dead;
    function reset(){p={x:205,y:350,vx:0,vy:0};plats=[];for(let i=0;i<10;i++)plats.push({x:Math.random()*360,y:390-i*48,w:75});camera=0;score=0;dead=false;draw();}
    function draw(){ctx.fillStyle="#090d1c";ctx.fillRect(0,0,440,420);ctx.fillStyle="#9a79ff";plats.forEach(o=>ctx.fillRect(o.x,o.y-camera,o.w,9));ctx.fillStyle="#61e4df";ctx.fillRect(p.x,p.y-camera,25,30);document.getElementById("heightScore").textContent="Height: "+score;if(dead){ctx.fillStyle="white";ctx.font="24px sans-serif";ctx.fillText("Try again!",160,210);}}
    function tick(){if(dead)return;p.vx=(keys.ArrowLeft||keys.a?-3.8:0)+(keys.ArrowRight||keys.d?3.8:0);p.x+=p.vx;p.x=Math.max(0,Math.min(415,p.x));p.vy+=.35;p.y+=p.vy;if(p.vy>0)plats.forEach(o=>{if(p.x+25>o.x&&p.x<o.x+o.w&&p.y+30>o.y&&p.y+30<o.y+13+ p.vy){p.y=o.y-30;p.vy=-9;}});if(p.y<camera+160){let shift=camera+160-p.y;camera+=shift;score=Math.max(score,Math.floor(camera));plats.forEach(o=>o.y+=shift);if(Math.min(...plats.map(o=>o.y))>0)plats.push({x:Math.random()*360,y:Math.min(...plats.map(o=>o.y))-48,w:75});}if(p.y-camera>440)dead=true;draw();}
    on(window,"keydown",e=>{keys[e.key]=true;if((e.key===" "||e.key==="ArrowUp")&&Math.abs(p.vy)<.2)p.vy=-9;e.preventDefault();});on(window,"keyup",e=>keys[e.key]=false);
    mount.append(button("Restart",reset));reset();interval=setInterval(tick,25);
  }

  if(id==="reaction"){
    mount.innerHTML='<p class="controls">Click start, wait for green, then click as fast as you can.</p><div id="reactBox" style="padding:55px 20px;border-radius:15px;background:#252b46;font:700 20px Space Grotesk;cursor:pointer">Press start when ready</div><p id="reactResult" class="big-number"></p>';
    const box=document.getElementById("reactBox"),result=document.getElementById("reactResult");let state="idle",startAt=0,timeout;
    function begin(){clearTimeout(timeout);state="wait";box.style.background="#8a344e";box.textContent="Wait for green...";result.textContent="";timeout=setTimeout(()=>{state="go";startAt=performance.now();box.style.background="#176b61";box.textContent="CLICK NOW!";},1000+Math.random()*3000);}
    on(box,"click",()=>{if(state==="idle"||state==="done"){begin();return;}if(state==="wait"){clearTimeout(timeout);state="done";box.style.background="#252b46";box.textContent="Too soon! Click to try again.";result.textContent="False start";}else{let t=Math.round(performance.now()-startAt);state="done";box.style.background="#252b46";box.textContent="Nice! Click to go again.";result.textContent=t+" ms";}});
    box.onclick=box.onclick; 
  }

  if(id==="mole"){
    mount.innerHTML='<p class="controls">Click the mole as many times as you can in 20 seconds.</p><p class="scoreline" id="moleScore">Score: 0 · Time: 20</p><div id="moleBoard" class="grid-board" style="grid-template-columns:repeat(3,1fr);max-width:330px"></div>';
    const b=document.getElementById("moleBoard");let score=0,time=20,pos=-1,started=false;
    function draw(){b.innerHTML="";for(let i=0;i<9;i++){let el=document.createElement("div");el.className="cell";el.textContent=i===pos?"🐹":"·";el.style.fontSize="27px";el.onclick=()=>{if(!started)return;if(i===pos){score++;pos=Math.floor(Math.random()*9);draw();}};b.append(el);}document.getElementById("moleScore").textContent=`Score: ${score} · Time: ${time}`;}
    function start(){score=0;time=20;started=true;pos=Math.floor(Math.random()*9);draw();interval=setInterval(()=>{time--;pos=Math.floor(Math.random()*9);draw();if(time<=0){clearInterval(interval);started=false;pos=-1;draw();note.textContent="Time! Final score: "+score;}},1000);}
    mount.append(button("Start 20-second round",start));draw();
  }

  if(id==="basketball"){
    mount.innerHTML='<p class="controls">Click and hold the shot button to build power. Release to shoot. Try to land 5 baskets.</p><p class="scoreline" id="hoopScore">Shots: 0 · Baskets: 0</p><div style="font-size:95px;margin:18px">🏀　🏀</div><div id="shotMsg" class="big-number">Ready?</div>';
    let shots=0,baskets=0,power=0,charging=false,powerTimer;
    const msg=document.getElementById("shotMsg"),sc=document.getElementById("hoopScore");
    const shoot=button("Hold to charge · Release to shoot",()=>{});
    shoot.onpointerdown=e=>{e.preventDefault();charging=true;power=0;powerTimer=setInterval(()=>{power=Math.min(100,power+4);msg.textContent="Power: "+power+"%";},35);};
    const release=()=>{if(!charging)return;charging=false;clearInterval(powerTimer);shots++;let good=power>=55&&power<=82&&Math.random()>.2;if(good) baskets++;msg.textContent=good?"SWISH! 🏀":power<55?"Short!":"Too strong!";sc.textContent=`Shots: ${shots} · Baskets: ${baskets}`;if(baskets>=5)note.textContent="You hit five baskets! Nice shooting.";};
    shoot.onpointerup=release;shoot.onpointerleave=release;mount.append(shoot);
  }

  if(id==="football"){
    mount.innerHTML='<p class="controls">Pick a direction and power, then throw. Score by hitting the target.</p><p class="scoreline" id="fbScore">Score: 0</p><div style="font-size:90px;margin:14px">🏈</div><label>Direction <input id="aim" type="range" min="0" max="100" value="50"></label><br><label>Power <input id="power" type="range" min="0" max="100" value="60"></label><div id="throwMsg" class="big-number">Ready to throw?</div>';
    let score=0,throws=0;const msg=document.getElementById("throwMsg");
    mount.append(button("Throw!",()=>{let aim=+document.getElementById("aim").value,power=+document.getElementById("power").value;let accuracy=100-Math.abs(aim-62)-Math.abs(power-72)*.7;throws++;let pts=accuracy>82?7:accuracy>65?3:0;score+=pts;msg.textContent=pts?`Complete! +${pts} points`:"Incomplete!";document.getElementById("fbScore").textContent=`Score: ${score} · Throws: ${throws}`;}));
  }
}
