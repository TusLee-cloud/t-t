/* ===============================
   FIREWORKS – TẾT COUNTDOWN PRO
   Rơi rất chậm – lơ lửng – sparkle
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
const AIR = 0.998; // GIỮ HẠT LÂU HƠN

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
      this.targetY = canvas.height * (0.15 + Math.random() * 0.08);
      this.speed = 9 + Math.random() * 2;
    }else{
      this.targetY = canvas.height * (0.35 + Math.random() * 0.3);
      this.speed = 7 + Math.random() * 2;
    }

    const angle = (-Math.PI/2) + (Math.random()-0.5)*1.2;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;

    this.colors = COLORS[Math.floor(Math.random()*COLORS.length)];
    this.trail = [];
  }

  update(){
    this.trail.push({x:this.x, y:this.y});
    if(this.trail.length > (this.type==="big"?20:14)) this.trail.shift();

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
      ctx.strokeStyle = `rgba(255,255,255,${i/this.trail.length*0.45})`;
      if(i===0) ctx.moveTo(p.x,p.y);
      else ctx.lineTo(p.x,p.y);
    });
    ctx.stroke();

    /* đầu pháo */
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.type==="big"?2.8:2.2,0,Math.PI*2);
    ctx.fillStyle="#fff";
    ctx.fill();
  }
}

/* ================= PARTICLE ================= */
class Particle{
  constructor(x,y,color,isBig){
    const angle = Math.random()*Math.PI*2;
    const speed = isBig
      ? Math.random()*3 + 1.8
      : Math.random()*2 + 1;

    this.x=x; this.y=y;
    this.vx=Math.cos(angle)*speed;
    this.vy=Math.sin(angle)*speed;

    this.alpha=1;
    this.color=color;
    this.size=isBig?2.4:1.9;

    this.spark = Math.random() > 0.65;
    this.twinkle = Math.random()*Math.PI*2;
  }

  update(){
    /* RƠI CHẬM */
    this.vy += GRAVITY * 0.4;
    this.vx += (Math.random()-0.5)*0.015;

    this.vx *= AIR;
    this.vy *= AIR;

    this.x += this.vx;
    this.y += this.vy;

    this.alpha -= this.spark ? 0.006 : 0.004;
    this.twinkle += 0.18;

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
  const count = isBig ? 110 : 55;

  for(let i=0;i<count;i++){
    const c = colors[Math.floor(Math.random()*colors.length)];
    particles.push(new Particle(x,y,c,isBig));
  }
}

/* ================= LAUNCH ================= */
function launchSmall(){ rockets.push(new Rocket("small")); }
function launchBig(){ rockets.push(new Rocket("big")); }

/* ================= COUNTDOWN MODE 😈 ================= */
setInterval(()=>{
  for(let i=0;i<4;i++){
    setTimeout(launchSmall,i*120);
  }
  setTimeout(launchBig,700);
},1300);

container.addEventListener("click",launchBig);

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
