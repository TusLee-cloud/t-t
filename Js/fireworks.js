/* ===============================
   FIREWORKS – TẾT COUNTDOWN PRO
   Bắn chậm – ít – sang
================================ */

const container = document.querySelector(".right");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

/* resize theo .right */
function resize(){
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}
window.addEventListener("resize", resize);
resize();

/* ================= CONFIG ================= */
const GRAVITY = 0.045;
const AIR = 0.998;

const COLORS = [
  ["#ffcc00", "#ff8800"],
  ["#ff4d4d", "#ffcc00"],
  ["#66ffcc", "#00ffaa"],
  ["#ff66cc", "#ff99ff"]
];

/* ================= ROCKET ================= */
class Rocket{
  constructor(type="small"){
    this.type = type;
    this.x = canvas.width / 2;
    this.y = canvas.height + 10;

    if(type === "big"){
      this.targetY = canvas.height * (0.18 + Math.random() * 0.08);
      this.speed = 8 + Math.random() * 1.5;
    }else{
      this.targetY = canvas.height * (0.45 + Math.random() * 0.25);
      this.speed = 6.5 + Math.random() * 1.5;
    }

    const angle = (-Math.PI/2) + (Math.random()-0.5)*0.9;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;

    this.colors = COLORS[Math.floor(Math.random()*COLORS.length)];
    this.trail = [];
  }

  update(){
    this.trail.push({x:this.x, y:this.y});
    if(this.trail.length > (this.type==="big"?22:16)) this.trail.shift();

    this.x += this.vx;
    this.y += this.vy;
    this.vy += GRAVITY;

    if(this.y <= this.targetY){
      explode(this.x, this.y, this.colors, this.type);
      return false;
    }
    return true;
  }

  draw(){
    /* đuôi pháo */
    ctx.beginPath();
    this.trail.forEach((p,i)=>{
      ctx.strokeStyle = `rgba(255,255,255,${i/this.trail.length*0.4})`;
      if(i===0) ctx.moveTo(p.x,p.y);
      else ctx.lineTo(p.x,p.y);
    });
    ctx.stroke();

    /* đầu pháo */
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.type==="big"?2.6:2.1,0,Math.PI*2);
    ctx.fillStyle="#fff";
    ctx.fill();
  }
}

/* ================= PARTICLE ================= */
class Particle{
  constructor(x,y,color,isBig){
    const angle = Math.random()*Math.PI*2;
    const speed = isBig
      ? Math.random()*2.6 + 1.4
      : Math.random()*1.8 + 0.9;

    this.x=x; this.y=y;
    this.vx=Math.cos(angle)*speed;
    this.vy=Math.sin(angle)*speed;

    this.alpha=1;
    this.color=color;
    this.size=isBig?2.2:1.7;

    this.spark = Math.random() > 0.7;
    this.twinkle = Math.random()*Math.PI*2;
  }

  update(){
    this.vy += GRAVITY * 0.35;
    this.vx += (Math.random()-0.5)*0.012;

    this.vx *= AIR;
    this.vy *= AIR;

    this.x += this.vx;
    this.y += this.vy;

    this.alpha -= this.spark ? 0.005 : 0.0038;
    this.twinkle += 0.16;

    return this.alpha > 0;
  }

  draw(){
    ctx.globalAlpha = this.alpha;

    if(this.spark){
      const glow = (Math.sin(this.twinkle)+1)/2;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size+glow,0,Math.PI*2);
      ctx.fill();
    }else{
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }
}

/* ================= ARRAYS ================= */
const rockets=[];
const particles=[];

/* ================= EXPLODE ================= */
function explode(x,y,colors,type){
  const isBig = type==="big";
  const count = isBig ? 80 : 38;

  for(let i=0;i<count;i++){
    const c = colors[Math.floor(Math.random()*colors.length)];
    particles.push(new Particle(x,y,c,isBig));
  }
}

/* ================= LAUNCH ================= */
function launchSmall(){ rockets.push(new Rocket("small")); }
function launchBig(){ rockets.push(new Rocket("big")); }

/* ================= MODE BẮN CHẬM ================= */
setInterval(()=>{
  launchSmall();          // 1 pháo nhỏ
  setTimeout(launchBig, 800); // 1 pháo lớn sau đó
}, 2200);                 // chu kỳ chậm hơn

/* click bắn thêm */
container.addEventListener("click", launchBig);

/* ================= ANIMATE ================= */
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=rockets.length-1;i>=0;i--){
    if(!rockets[i].update()) rockets.splice(i,1);
    else rockets[i].draw();
  }

  for(let i=particles.length-1;i>=0;i--){
    if(!particles[i].update()) particles.splice(i,1);
    else particles[i].draw();
  }

  requestAnimationFrame(animate);
}
animate();
