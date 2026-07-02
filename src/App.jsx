import React, { useState, useEffect, useRef } from "react";

// ─── CONFIG — edit these to update the counter and settings ──────────────────
const CONFIG = {
  totalSlots:        50,   // total applications before form closes
  acceptedSlots:     50,    // how many will actually be accepted
  applicationsCount: 50,    // UPDATE THIS NUMBER as applications come in
  sheetsWebhook:     "https://script.google.com/macros/s/AKfycbyUHWIJFicss4f-1gnKycvE_kJAafmVVXYMYvfrbPWphXxpw6X4QZTAjNj1rhH2akiphw/exec",
  emailjsPublicKey:  "oTMW3y4KeQz57nKIz",
  emailjsServiceId:  "proveitbeta_gmail",
  emailjsTemplateId: "proveitbeta_notify",
};

// ─── EMAILJS ─────────────────────────────────────────────────────────────────
const loadEmailJS = () => {
  if (window.emailjs) return Promise.resolve();
  return new Promise(resolve => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => { window.emailjs.init(CONFIG.emailjsPublicKey); resolve(); };
    document.head.appendChild(s);
  });
};

const sendConfirmationEmail = async (name, email, role) => {
  try {
    await loadEmailJS();
    await window.emailjs.send(CONFIG.emailjsServiceId, CONFIG.emailjsTemplateId, {
      to_email:     email,
      student_name: name,
      subject:      "ProveIt! Beta — We've Received Your Application",
      message:      `Thank you for applying to the ProveIt! Beta Programme!\n\nWe are currently reviewing applications to match ${role === "parent" ? "your child" : "you"} with the right tutor. We will confirm your free 2-week slot within 24 hours.\n\nIn the meantime, if you have any questions, reach us at help.proveit@yahoo.com`,
      app_url:      window.location.origin,
    });
  } catch(e) { console.error("Email error:", e); }
};

const submitToSheets = async (data) => {
  if (!CONFIG.sheetsWebhook || CONFIG.sheetsWebhook.includes("YOUR_")) return;
  try {
    await fetch(CONFIG.sheetsWebhook, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submitForm", ...data }),
    });
  } catch(e) { console.error("Sheets error:", e); }
};

const uploadReportToDrive = async (file, applicantName) => {
  if (!CONFIG.sheetsWebhook || CONFIG.sheetsWebhook.includes("YOUR_")) return;
  if (!file) return;
  try {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
    await fetch(CONFIG.sheetsWebhook, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:        "uploadReport",
        fileName:      `${applicantName} — School Report.pdf`,
        mimeType:      file.type || "application/pdf",
        base64Data:    base64,
      }),
    });
  } catch(e) { console.error("Drive upload error:", e); }
};

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  navy:       "#0A0F1E",
  navyMid:    "#111827",
  navyLight:  "#1E2D4A",
  teal:       "#00D4C8",
  tealDim:    "#00A89E",
  tealGlow:   "rgba(0,212,200,0.15)",
  white:      "#F0F4FF",
  whiteDim:   "#8899BB",
  accent:     "#FF6B35",
  success:    "#22C55E",
  warning:    "#F59E0B",
  danger:     "#EF4444",
  glass:      "rgba(30,45,74,0.6)",
  glassBorder:"rgba(0,212,200,0.2)",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:${T.navy};color:${T.white};font-family:'Inter',sans-serif;min-height:100vh;overflow-x:hidden}
p,
span,
a{
  overflow-wrap:break-word;
}

img,
svg,
video{
  max-width:100%;
  height:auto;
}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:${T.navyMid}}
    ::-webkit-scrollbar-thumb{background:${T.tealDim};border-radius:3px}
    .display{font-family:'Space Grotesk',sans-serif}
    input,textarea,select{background:rgba(255,255,255,.06);border:1px solid ${T.glassBorder};border-radius:10px;color:${T.white};font-family:'Inter',sans-serif;font-size:15px;padding:13px 16px;width:100%;outline:none;transition:border-color .2s,box-shadow .2s}
    input:focus,textarea:focus,select:focus{border-color:${T.teal};box-shadow:0 0 0 3px ${T.tealGlow}}
    input::placeholder,textarea::placeholder{color:${T.whiteDim}}
    select option{background:${T.navyMid};color:${T.white}}
    label{display:block;font-size:12px;font-weight:600;color:${T.whiteDim};margin-bottom:6px;letter-spacing:.6px;text-transform:uppercase}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow{0%,100%{box-shadow:0 0 30px rgba(0,212,200,.2)}50%{box-shadow:0 0 60px rgba(0,212,200,.5)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes countUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .fade-up{animation:fadeUp .6s ease forwards}
    .fade-up-1{animation:fadeUp .6s .1s ease both}
    .fade-up-2{animation:fadeUp .6s .2s ease both}
    .fade-up-3{animation:fadeUp .6s .3s ease both}
    .fade-up-4{animation:fadeUp .6s .4s ease both}
    .fade-up-5{animation:fadeUp .6s .5s ease both}
    .btn-primary{background:linear-gradient(135deg,${T.teal},${T.tealDim});color:${T.navy};border:none;border-radius:12px;padding:16px 36px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:8px;letter-spacing:.3px}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,212,200,.35)}
    .btn-primary:active{transform:translateY(0)}
    .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .btn-ghost{background:transparent;color:${T.teal};border:1px solid ${T.glassBorder};border-radius:12px;padding:14px 28px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;cursor:pointer;transition:all .2s}
    .btn-ghost:hover{background:${T.tealGlow};border-color:${T.teal}}
    .glass{background:${T.glass};backdrop-filter:blur(16px);border:1px solid ${T.glassBorder};border-radius:20px}
    .error-text{color:${T.danger};font-size:12px;margin-top:5px;display:block}
    .spinner{width:20px;height:20px;border:2.5px solid rgba(10,15,30,.3);border-top-color:${T.navy};border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
    @keyframes spin{to{transform:rotate(360deg)}}
    section{padding:80px 24px}
    .container{max-width:1100px;margin:0 auto}
    .container-sm{max-width:680px;margin:0 auto}
    @media(max-width:768px){
  section{
    padding:56px 20px;
  }

  .btn-primary{
    padding:14px 28px;
    font-size:15px;
  }

  .mobile-stack{
    display:flex !important;
    flex-direction:column !important;
  }

  .mobile-grid-1{
    grid-template-columns:1fr !important;
  }

  .mobile-grid-2{
    grid-template-columns:1fr !important;
  }

  .mobile-grid-3{
    grid-template-columns:1fr !important;
  }

  .mobile-center{
    text-align:center !important;
  }

  .mobile-padding{
    padding:20px !important;
  }

  .mobile-full{
    width:100% !important;
  }

  .mobile-small-text{
    font-size:14px !important;
  }
}   
  `}</style>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 24px", height:64, display:"flex", alignItems:"center", background:scrolled?`${T.navyMid}ee`:"transparent", backdropFilter:scrolled?"blur(12px)":"none", borderBottom:scrolled?`1px solid ${T.glassBorder}`:"none", transition:"all .3s" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none"><polygon points="12,2 22,8 22,16 12,22 2,16 2,8" stroke={T.teal} strokeWidth="2"/><circle cx="12" cy="12" r="2" fill={T.teal}/></svg>
          <span className="display" style={{ fontSize:20, fontWeight:700 }}>Prove<span style={{ color:T.teal }}>It!</span></span>
          <span style={{ fontSize:11, background:T.tealGlow, color:T.teal, border:`1px solid ${T.glassBorder}`, borderRadius:20, padding:"2px 10px", fontWeight:600, letterSpacing:".5px" }}>BETA</span>
        </div>
        <a href="#apply" className="btn-primary" style={{ textDecoration:"none", padding:"9px 22px", fontSize:14, borderRadius:10 }}>Apply Now →</a>
      </div>
    </nav>
  );
};

// ─── COUNTER ──────────────────────────────────────────────────────────────────
const SpotsCounter = ({ style }) => {
  const pct = Math.min((CONFIG.applicationsCount / CONFIG.totalSlots) * 100, 100);
  const remaining = CONFIG.acceptedSlots - CONFIG.applicationsCount;
  const urgency = CONFIG.applicationsCount >= 40;

  return (
    <div style={{ background: urgency ? "rgba(239,68,68,.08)" : T.tealGlow, border:`1px solid ${urgency ? "rgba(239,68,68,.3)" : T.glassBorder}`, borderRadius:16, padding:"20px 24px", ...style }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div>
          <div style={{ fontSize:13, color:T.whiteDim, fontWeight:500, marginBottom:2 }}>Beta Applications</div>
          <div className="display" style={{ fontSize:26, fontWeight:800, color: urgency ? T.danger : T.teal, lineHeight:1 }}>
            {CONFIG.applicationsCount} <span style={{ fontSize:15, fontWeight:500, color:T.whiteDim }}>/ {CONFIG.totalSlots} received</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:22, fontWeight:800, color: urgency ? T.danger : T.success, animation: urgency ? "pulse 1.5s infinite" : "none" }}>
            {Math.max(remaining, 0)}
          </div>
          <div style={{ fontSize:12, color:T.whiteDim }}>slots left</div>
        </div>
      </div>
      <div style={{ height:8, background:"rgba(255,255,255,.08)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, borderRadius:4, background: urgency ? `linear-gradient(90deg,${T.warning},${T.danger})` : `linear-gradient(90deg,${T.teal},${T.tealDim})`, transition:"width 1s ease" }}/>
      </div>
      <div style={{ fontSize:11, color:T.whiteDim, marginTop:8 }}>
        {urgency ? "⚠️ Almost full — apply immediately" : `${CONFIG.acceptedSlots} spots available · Not all applications accepted`}
      </div>
    </div>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", paddingTop:80 }}>
    {/* Background effects */}
    <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(0,212,200,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,200,.025) 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" }}/>
    <div style={{ position:"absolute", top:"10%", right:"5%", width:"50vw",
height:"50vw",
maxWidth:500,
maxHeight:500, background:"radial-gradient(circle,rgba(0,212,200,.08) 0%,transparent 65%)", pointerEvents:"none" }}/>
    <div style={{ position:"absolute", bottom:"10%", left:"0%",width:"40vw",
height:"40vw",
maxWidth:400,
maxHeight:400, background:"radial-gradient(circle,rgba(255,107,53,.06) 0%,transparent 65%)", pointerEvents:"none" }}/>

    <div className="container">
      <div
  className="mobile-grid-1"
  style={{
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:60,
    alignItems:"center"
  }}
>
        {/* Left */}
        <div>
          <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, background:T.tealGlow, border:`1px solid ${T.glassBorder}`, borderRadius:20, padding:"6px 16px", marginBottom:24 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:T.teal, animation:"pulse 1.5s infinite", display:"inline-block" }}/>
            <span style={{ fontSize:12, fontWeight:600, color:T.teal, letterSpacing:".8px", textTransform:"uppercase" }}>Beta Programme — Grade 12 Only</span>
          </div>

          <h1 className="display fade-up-1" style={{ fontSize:"clamp(36px,4.5vw,58px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-1.5px", marginBottom:20 }}>
            Your Matric Year<br/>
            Just Got a <span style={{ color:T.teal, textDecoration:"underline", textDecorationColor:`${T.teal}44` }}>Free Upgrade.</span>
          </h1>

          <p className="fade-up-2" style={{ fontSize:18, color:T.whiteDim, lineHeight:1.75, marginBottom:16, maxWidth:520 }}>
            <strong style={{ color:T.white }}>50 spots. Zero cost. One condition: SHOW UP!</strong>
          </p>
          <p className="fade-up-2" style={{ fontSize:16, color:T.whiteDim, lineHeight:1.75, marginBottom:36, maxWidth:520 }}>
            ProveIt! is giving away 2 weeks of elite, personalised Grade 12 tutoring to students committed enough to help us build something great. You get premium lessons in Mathematics, Physics and Chemistry. We get honest feedback.
          </p>

          <div className="fade-up-3" style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:36 }}>
            <a href="#apply" className="btn-primary" style={{ textDecoration:"none" }}>Apply for Your Spot →</a>
            <a href="#how-it-works" className="btn-ghost" style={{ textDecoration:"none" }}>How it Works</a>
          </div>

          <div className="fade-up-4" style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            {[
              { emoji:"🎓", label:"Elite tutoring" },
              { emoji:"📱", label:"App + Dashboard" },
              { emoji:"📊", label:"Progress report" },
              { emoji:"🆓", label:"100% Free" },
            ].map(x => (
              <div key={x.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18 }}>{x.emoji}</span>
                <span style={{ fontSize:13, color:T.whiteDim, fontWeight:500 }}>{x.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — counter card */}
        <div className="fade-up-3">
          <div className="glass" style={{ padding:32, animation:"float 4s ease-in-out infinite" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:48, marginBottom:8 }}>🚀</div>
              <div className="display" style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Beta Applications Open</div>
              <p style={{ fontSize:14, color:T.whiteDim, lineHeight:1.6 }}>Applications are reviewed individually. Only committed learners get a slot.</p>
            </div>

            <SpotsCounter style={{ marginBottom:24 }}/>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { label:"Subjects", value:"3" },
                { label:"Duration", value:"2 weeks" },
                { label:"Cost", value:"R0.00" },
              ].map(x => (
                <div key={x.label} style={{ textAlign:"center", padding:"14px 8px", background:"rgba(255,255,255,.04)", borderRadius:10, border:`1px solid ${T.glassBorder}` }}>
                  <div className="display" style={{ fontSize:22, fontWeight:700, color:T.teal, marginBottom:2 }}>{x.value}</div>
                  <div style={{ fontSize:11, color:T.whiteDim }}>{x.label}</div>
                </div>
              ))}
            </div>

            <a href="#apply" className="btn-primary" style={{ textDecoration:"none", width:"100%", justifyContent:"center", marginTop:20, fontSize:15 }}>
              Apply Now — Free →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── WHAT YOU GET vs WHAT WE ASK ─────────────────────────────────────────────
const MutualAgreement = () => {
  const rows = [
    { get:"2 weeks of free tutoring — fully personalised Maths, Physics and Chemistry sessions", ask:"Attend your scheduled sessions on time, every time" },
    { get:"Early access to the ProveIt! platform before public launch", ask:"Test specific features as guided by your tutor" },
    { get:"A personal progress report at the end of the 2 weeks", ask:"Complete a short 3-minute feedback survey after each session" },
    { get:"Direct input into shaping the future of the platform", ask:"Respond to tutor communications within 24 hours" },
    { get:"A ProveIt! Beta Tester Certificate of Participation", ask:"Submit your most recent school report before sessions begin" },
  ];

  return (
    <section id="how-it-works" style={{ background:`linear-gradient(180deg,${T.navy} 0%,${T.navyMid} 100%)` }}>
      <div className="container">
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:12, color:T.teal, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>The Deal</div>
          <h2 className="display" style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-1px", marginBottom:16 }}>
            Transparent. Fair. Mutual.
          </h2>
          <p style={{ fontSize:16, color:T.whiteDim, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
            We're not looking for people who want something for nothing. We're looking for students serious enough to actually show up.
          </p>
        </div>

        {/* Table header */}
        <div
  className="mobile-grid-2"
  style={{
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:2,
    marginBottom:2
  }}
>
          {[
            { icon:"🎁", label:"What You Receive", color:T.teal },
            { icon:"🤝", label:"What We Ask From You", color:T.accent },
          ].map(h => (
            <div key={h.label} style={{ padding:"14px 24px", background:h.color==="T.teal"?T.tealGlow:"rgba(255,107,53,.12)", borderRadius:"12px 12px 0 0", border:`1px solid ${T.glassBorder}`, borderBottom:"none", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>{h.icon}</span>
              <span className="display" style={{ fontWeight:700, fontSize:15, color:h.color===T.teal?T.teal:T.accent }}>{h.label}</span>
            </div>
          ))}
        </div>

        {/* Table rows */}
        {rows.map((row, i) => (
          <div
  className="mobile-grid-2"
  style={{
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:2,
    marginBottom:2
  }}
>
            <div style={{ padding:"18px 24px", background:"rgba(0,212,200,.04)", border:`1px solid ${T.glassBorder}`, borderRadius:i===rows.length-1?"0 0 0 12px":"0", display:"flex", alignItems:"flex-start", gap:12 }}>
              <span style={{ color:T.teal, fontSize:16, marginTop:1, flexShrink:0 }}>✓</span>
              <span style={{ fontSize:14, color:T.whiteDim, lineHeight:1.65 }}>{row.get}</span>
            </div>
            <div style={{ padding:"18px 24px", background:"rgba(255,107,53,.03)", border:`1px solid ${T.glassBorder}`, borderRadius:i===rows.length-1?"0 0 12px 0":"0", display:"flex", alignItems:"flex-start", gap:12 }}>
              <span style={{ color:T.accent, fontSize:16, marginTop:1, flexShrink:0 }}>→</span>
              <span style={{ fontSize:14, color:T.whiteDim, lineHeight:1.65 }}>{row.ask}</span>
            </div>
          </div>
        ))}

        {/* Bottom note */}
        <div style={{ marginTop:24, padding:"18px 24px", background:T.tealGlow, border:`1px solid ${T.glassBorder}`, borderRadius:12, textAlign:"center" }}>
          <p style={{ fontSize:14, color:T.whiteDim, lineHeight:1.7 }}>
            <strong style={{ color:T.white }}>Not all applications will be accepted.</strong> We review each one individually and confirm within 24 hours. If your slot is confirmed, you'll receive login details to the ProveIt! platform by email from <span style={{ color:T.teal }}>info.proveit@yahoo.com</span>
          </p>
        </div>
      </div>
    </section>
  );
};

// ─── SUBJECTS ─────────────────────────────────────────────────────────────────
const Subjects = () => {
  const subjects = [
    { emoji:"∫", name:"Mathematics", desc:"Functions, calculus, algebra, trigonometry, statistics and more — aligned to the NSC curriculum.", color:T.teal, topics:["Algebra & Functions","Calculus","Trigonometry","Statistics & Probability","Geometry","AND MORE!"] },
    { emoji:"⚡", name:"Physics", desc:"Mechanics, electricity, waves, and modern physics — built around understanding, not memorisation.", color:T.accent, topics:["Newton's Laws","Electricity & Magnetism","Waves & Optics","Thermodynamics","Modern Physics","AND MORE!"] },
    { emoji:"⚗️", name:"Chemistry", desc:"Organic, inorganic, physical chemistry — with worked examples and practical exam strategies.", color:"#22C55E", topics:["Organic Chemistry","Electrochemistry","Chemical Equilibrium","Acid-Base Reactions","Stoichiometry","AND MORE!"] },
  ];

  return (
    <section style={{ background:T.navyMid }}>
      <div className="container">
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:12, color:T.teal, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Subjects</div>
          <h2 className="display" style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:14 }}>Three Subjects. One Platform.</h2>
          <p style={{ fontSize:15, color:T.whiteDim, maxWidth:460, margin:"0 auto", lineHeight:1.7 }}>Apply for one, two, or all three. Sessions are tailored to exactly where you are and where you need to be.</p>
        </div>
        <div
  className="mobile-grid-3"
  style={{
    display:"grid",
    gridTemplateColumns:"repeat(3,1fr)",
    gap:20
  }}
>
          {subjects.map(s => (
            <div key={s.name} className="glass" style={{ padding:28, borderTop:`3px solid ${s.color}`, transition:"transform .25s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="none"}>
              <div style={{ fontSize:36, marginBottom:14 }}>{s.emoji}</div>
              <h3 className="display" style={{ fontSize:20, fontWeight:700, color:s.color, marginBottom:10 }}>{s.name}</h3>
              <p style={{ fontSize:13, color:T.whiteDim, lineHeight:1.65, marginBottom:18 }}>{s.desc}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {s.topics.map(t => (
                  <div key={t} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:T.whiteDim }}>
                    <span style={{ color:s.color, fontSize:10 }}>●</span>{t}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const HowItWorks = () => {
  const steps = [
    { n:"01", icon:"📝", title:"Apply", desc:"Fill in the application form below. It takes about 3 minutes. Upload your most recent school report to help us personalise your sessions." },
    { n:"02", icon:"✅", title:"Get Confirmed", desc:"We review your application and confirm your slot within 24 hours by email." },
    { n:"03", icon:"🔐", title:"Get Access", desc:"Once accepted, you receive login details to the ProveIt! platform. Your tutor will reach out to schedule your first session." },
    { n:"04", icon:"📚", title:"Learn & Test", desc:"Attend your sessions, explore the platform, and test features as guided. Your tutor tracks your progress the whole way." },
    { n:"05", icon:"📊", title:"Give Feedback", desc:"Complete a short survey after your final session. Your input directly shapes the platform before it launches to the public." },
  ];

  return (
    <section>
      <div className="container">
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:12, color:T.teal, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Process</div>
          <h2 className="display" style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px" }}>What Happens After You Apply</h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:0, position:"relative" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display:"flex", gap:24, alignItems:"flex-start", position:"relative" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:T.tealGlow, border:`2px solid ${T.teal}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, zIndex:1 }}>{s.icon}</div>
                {i < steps.length - 1 && <div style={{ width:2, height:40, background:`linear-gradient(${T.teal},${T.glassBorder})`, marginTop:2 }}/>}
              </div>
              <div style={{ paddingBottom:i < steps.length - 1 ? 32 : 0, paddingTop:8 }}>
                <div style={{ fontSize:10, color:T.teal, fontWeight:700, letterSpacing:"2px", marginBottom:4 }}>STEP {s.n}</div>
                <h3 className="display" style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:T.whiteDim, lineHeight:1.7, maxWidth:540 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── APPLICATION FORM ─────────────────────────────────────────────────────────
const ApplicationForm = () => {
  const [form, setForm] = useState({
    name:"", email:"", phone:"", role:"",
    grade:"", subjects:[], devices:[], commitment:false,
    hearAbout:"", reportFile:null,
  });
  const [errors,    setErrors]    = useState({});
  const [step,      setStep]      = useState(1); // 1=basic, 2=details, 3=confirm
  const [submitting,setSubmitting]= useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [gradeBlocked, setGradeBlocked] = useState(false);
  const formRef = useRef(null);

  const SUBJECTS  = ["Mathematics","Physics","Chemistry"];
  const DEVICES   = ["Laptop / Desktop","Tablet","Smartphone"];
  const HEAR_OPTS = ["WhatsApp","Instagram","Friend or Family","School","TikTok","Other"];

  const set = (field, val) => { setForm(p => ({ ...p, [field]:val })); setErrors(p => ({ ...p, [field]:null })); };

  const toggleArr = (field, val) => setForm(p => ({
    ...p, [field]: p[field].includes(val) ? p[field].filter(x=>x!==val) : [...p[field], val]
  }));

  const handleGrade = (g) => {
    set("grade", g);
    if (g && g !== "Grade 12") { setGradeBlocked(true); }
    else { setGradeBlocked(false); }
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Please enter your full name";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address";
    if (!form.role)         e.role  = "Please select your role";
    if (!form.grade)        e.grade = "Please select a grade";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (form.subjects.length === 0) e.subjects = "Please select at least one subject";
    if (form.devices.length === 0)  e.devices  = "Please select at least one device";
    if (!form.commitment)           e.commitment = "You must agree to the commitment to apply";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) { setStep(2); setTimeout(()=>formRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100); }
    if (step === 2 && validateStep2()) { setStep(3); setTimeout(()=>formRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const submissionId = `#${String(CONFIG.applicationsCount + 1).padStart(3,"0")}`;
    const payload = {
      submissionId,
      name:        form.name,
      email:       form.email,
      phone:       form.phone,
      role:        form.role,
      grade:       form.grade,
      subjects:    form.subjects.join(", "),
      devices:     form.devices.join(", "),
      hearAbout:   form.hearAbout,
      reportUploaded: form.reportFile ? "Yes" : "No",
      status:      "Pending",
      date:        new Date().toLocaleDateString("en-ZA"),
    };
    await submitToSheets(payload);
    if (form.reportFile) {
      await uploadReportToDrive(form.reportFile, form.name);
    }
    await sendConfirmationEmail(form.name, form.email, form.role);
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputStyle = (field) => ({
    borderColor: errors[field] ? T.danger : T.glassBorder,
    boxShadow:   errors[field] ? `0 0 0 3px rgba(239,68,68,.15)` : "none",
  });

  // ── Submitted state ──
  if (submitted) return (
    <section id="apply" ref={formRef} style={{ background:T.navyMid }}>
      <div className="container-sm" style={{ textAlign:"center" }}>
        <div style={{ padding:"60px 40px" }} className="glass">
          <div style={{ fontSize:72, marginBottom:20 }}>🎉</div>
          <h2 className="display" style={{ fontSize:32, fontWeight:800, marginBottom:12 }}>Application Received!</h2>
          <p style={{ fontSize:16, color:T.whiteDim, lineHeight:1.75, marginBottom:8 }}>
            Thank you, <strong style={{ color:T.white }}>{form.name}</strong>. We've received your application and sent a confirmation to <strong style={{ color:T.teal }}>{form.email}</strong>.
          </p>
          <p style={{ fontSize:15, color:T.whiteDim, lineHeight:1.75, marginBottom:32 }}>
            KINDLY CHECK YOUR SPAM FOLDER AND CLICK <strong style={{ color:T.white }}>"REPORT AS NOT SPAM"</strong>.
          </p>
          <p style={{ fontSize:15, color:T.whiteDim, lineHeight:1.75, marginBottom:32 }}>
            We review applications individually and will confirm your slot <strong style={{ color:T.white }}>within 24 hours</strong>. Keep an eye on your inbox — ESPECIALLY your spam folder.
          </p>
          <div style={{ padding:"20px 24px", background:T.tealGlow, border:`1px solid ${T.glassBorder}`, borderRadius:12, marginBottom:28 }}>
            <p style={{ fontSize:14, color:T.whiteDim }}>
              📬 Confirmation sent from <strong style={{ color:T.teal }}>proveit.updates@gmail.com</strong>
              {form.reportFile && (
                <><br/>📎 School report received — we'll use it to personalise your sessions.</>
              )}
            </p>
          </div>
          <p style={{ fontSize:13, color:T.whiteDim }}>Questions? Email us at <a href="mailto:help.proveit@yahoo.com" style={{ color:T.teal }}>help.proveit@yahoo.com</a></p>
        </div>
      </div>
    </section>
  );

  // ── Grade blocked state ──
  const GradeBlockedMsg = () => (
    <div style={{ padding:"24px", background:"rgba(255,107,53,.08)", border:`1px solid rgba(255,107,53,.3)`, borderRadius:14, marginTop:16, textAlign:"center" }}>
      <div style={{ fontSize:36, marginBottom:10 }}>📚</div>
      <h3 className="display" style={{ fontSize:18, fontWeight:700, color:T.accent, marginBottom:8 }}>Beta Testing is Grade 12 Only</h3>
      <p style={{ fontSize:14, color:T.whiteDim, lineHeight:1.7 }}>
        We're focusing our beta exclusively on Grade 12 learners right now. <strong style={{ color:T.white }}>Support for Grades 8–11 is coming</strong> once we launch publicly.
      </p>
      <p style={{ fontSize:13, color:T.whiteDim, marginTop:10 }}>
        Change your grade above if you are in Grade 12, or check back when we open to all grades.
      </p>
    </div>
  );

  // Step indicator
  const StepIndicator = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:32 }}>
      {[1,2,3].map(s => (
        <React.Fragment key={s}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:s<=step?T.teal:`rgba(255,255,255,.08)`, color:s<=step?T.navy:T.whiteDim, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, transition:"all .3s" }}>{s<step?"✓":s}</div>
          {s < 3 && <div style={{ width:40, height:2, background:s<step?T.teal:`rgba(255,255,255,.08)`, borderRadius:1, transition:"background .3s" }}/>}
        </React.Fragment>
      ))}
    </div>
  );

  const stepLabels = ["", "Your Details","Preferences","Confirm"];

  return (
    <section id="apply" ref={formRef} style={{ background:T.navyMid }}>
      <div className="container-sm">
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:12, color:T.teal, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Application</div>
          <h2 className="display" style={{ fontSize:"clamp(26px,3.5vw,40px)", fontWeight:800, letterSpacing:"-1px", marginBottom:12 }}>Apply for Your Free Slot</h2>
          <p style={{ fontSize:15, color:T.whiteDim, lineHeight:1.7, maxWidth:480, margin:"0 auto 24px" }}>
            Takes about 3 minutes. This isn't a simple signup — we review every application to make sure spots go to students who'll actually use them.
          </p>
          <SpotsCounter/>
        </div>

        <div
  className="glass mobile-padding"
  style={{ padding:"36px 40px" }}
>
          <StepIndicator/>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <span style={{ fontSize:12, color:T.teal, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>Step {step} of 3 — {stepLabels[step]}</span>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div>
                <label>Full Name *</label>
                <input placeholder="Your full name" value={form.name} onChange={e=>set("name",e.target.value)} style={inputStyle("name")}/>
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div>
                <label>Email Address *</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e=>set("email",e.target.value)} style={inputStyle("email")}/>
                {errors.email && <span className="error-text">{errors.email}</span>}
                <span style={{ fontSize:11, color:T.whiteDim, marginTop:5, display:"block" }}>Your confirmation and login details will be sent here</span>
              </div>
              <div>
                <label>Phone Number (optional)</label>
                <input type="tel" placeholder="e.g. 082 123 4567" value={form.phone} onChange={e=>set("phone",e.target.value)}/>
              </div>
              <div>
                <label>I am a... *</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:6 }}>
                  {[
                    { val:"student", icon:"🎓", label:"Student", sub:"Looking for help with my subjects" },
                    { val:"parent", icon:"👨‍👩‍👧", label:"Parent / Guardian", sub:"Looking for a tutor for my child" },
                  ].map(r => (
                    <div key={r.val} onClick={()=>set("role",r.val)} style={{ padding:"16px", borderRadius:12, cursor:"pointer", border:`2px solid ${form.role===r.val?T.teal:T.glassBorder}`, background:form.role===r.val?T.tealGlow:"rgba(255,255,255,.03)", transition:"all .2s", textAlign:"center" }}>
                      <div style={{ fontSize:28, marginBottom:6 }}>{r.icon}</div>
                      <div style={{ fontWeight:600, fontSize:14, marginBottom:3 }}>{r.label}</div>
                      <div style={{ fontSize:11, color:T.whiteDim }}>{r.sub}</div>
                    </div>
                  ))}
                </div>
                {errors.role && <span className="error-text">{errors.role}</span>}
              </div>

              {/* Conditional grade question */}
              {form.role && (
                <div>
                  <label>{form.role==="parent" ? "What grade is your child in? *" : "What grade are you in? *"}</label>
                  <select value={form.grade} onChange={e=>handleGrade(e.target.value)} style={inputStyle("grade")}>
                    <option value="">Select grade...</option>
                    {["Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"].map(g=><option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.grade && <span className="error-text">{errors.grade}</span>}
                  {gradeBlocked && <GradeBlockedMsg/>}
                </div>
              )}

              {!gradeBlocked && (
                <button className="btn-primary" onClick={handleNext} style={{ marginTop:8, justifyContent:"center", width:"100%" }}>
                  Continue →
                </button>
              )}
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div>
                <label>Subjects Interested In * <span style={{ textTransform:"none", letterSpacing:0, fontSize:11, fontWeight:400, color:T.whiteDim }}>(select all that apply)</span></label>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
                  {SUBJECTS.map(s => {
                    const colors = { Mathematics:T.teal, Physics:T.accent, Chemistry:"#22C55E" };
                    const emojis = { Mathematics:"∫", Physics:"⚡", Chemistry:"⚗️" };
                    const active = form.subjects.includes(s);
                    return (
                      <div key={s} onClick={()=>toggleArr("subjects",s)} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:10, cursor:"pointer", border:`2px solid ${active?colors[s]:T.glassBorder}`, background:active?`${colors[s]}15`:"rgba(255,255,255,.03)", transition:"all .2s" }}>
                        <div style={{ width:22, height:22, borderRadius:4, border:`2px solid ${active?colors[s]:T.whiteDim}`, background:active?colors[s]:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {active && <span style={{ color:T.navy, fontSize:13, fontWeight:700 }}>✓</span>}
                        </div>
                        <span style={{ fontSize:20 }}>{emojis[s]}</span>
                        <span style={{ fontWeight:600, fontSize:15, color:active?colors[s]:T.white }}>{s}</span>
                      </div>
                    );
                  })}
                </div>
                {errors.subjects && <span className="error-text">{errors.subjects}</span>}
              </div>

              <div>
                <label>Device You'll Use * <span style={{ textTransform:"none", letterSpacing:0, fontSize:11, fontWeight:400, color:T.whiteDim }}>(select all that apply)</span></label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
                  {DEVICES.map(d => {
                    const emojis = { "Laptop / Desktop":"💻", "Tablet":"📱", "Smartphone":"📱" };
                    const active = form.devices.includes(d);
                    return (
                      <div key={d} onClick={()=>toggleArr("devices",d)} style={{ flex:"1 1 140px", padding:"12px 14px", borderRadius:10, cursor:"pointer", border:`2px solid ${active?T.teal:T.glassBorder}`, background:active?T.tealGlow:"rgba(255,255,255,.03)", transition:"all .2s", textAlign:"center" }}>
                        <div style={{ fontSize:22, marginBottom:4 }}>{d==="Laptop / Desktop"?"💻":"📱"}</div>
                        <div style={{ fontSize:13, fontWeight:active?600:400, color:active?T.teal:T.whiteDim }}>{d}</div>
                      </div>
                    );
                  })}
                </div>
                {errors.devices && <span className="error-text">{errors.devices}</span>}
              </div>

              <div>
                <label>How Did You Hear About Us?</label>
                <select value={form.hearAbout} onChange={e=>set("hearAbout",e.target.value)}>
                  <option value="">Select one...</option>
                  {HEAR_OPTS.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label>School Report <span style={{ textTransform:"none", letterSpacing:0, fontSize:11, fontWeight:400, color:T.whiteDim }}>(strongly encouraged)</span></label>
                <div
                  style={{ padding:"20px", borderRadius:12, border:`2px dashed ${form.reportFile ? T.teal : T.glassBorder}`, textAlign:"center", background: form.reportFile ? T.tealGlow : "rgba(255,255,255,.02)", transition:"all .2s", cursor:"pointer" }}
                  onClick={() => document.getElementById("report-file-input").click()}
                >
                  <input
                    id="report-file-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display:"none" }}
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      set("reportFile", file);
                    }}
                  />
                  {form.reportFile ? (
                    <>
                      <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
                      <p style={{ fontSize:14, fontWeight:600, color:T.teal, marginBottom:4 }}>{form.reportFile.name}</p>
                      <p style={{ fontSize:12, color:T.whiteDim, marginBottom:10 }}>
                        {(form.reportFile.size / 1024).toFixed(0)} KB · Click to change file
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); set("reportFile", null); document.getElementById("report-file-input").value = ""; }}
                        style={{ background:"rgba(239,68,68,.12)", border:`1px solid rgba(239,68,68,.3)`, color:"#EF4444", borderRadius:8, padding:"5px 14px", fontSize:12, cursor:"pointer" }}
                      >
                        Remove ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:28, marginBottom:8 }}>📄</div>
                      <p style={{ fontSize:13, color:T.whiteDim, lineHeight:1.6, marginBottom:12 }}>
                        Click to upload your most recent school report<br/>
                        <span style={{ fontSize:11 }}>PDF, JPG or PNG · Helps us personalise your sessions</span>
                      </p>
                      <span className="btn-ghost" style={{ display:"inline-block", padding:"9px 20px", fontSize:13, pointerEvents:"none" }}>
                        Choose File →
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div style={{ padding:"16px 18px", borderRadius:10, border:`2px solid ${errors.commitment?"rgba(239,68,68,.5)":form.commitment?T.teal:T.glassBorder}`, background:form.commitment?T.tealGlow:"rgba(255,255,255,.02)", cursor:"pointer" }} onClick={()=>set("commitment",!form.commitment)}>
                  <label style={{ display:"flex", alignItems:"flex-start", gap:12, textTransform:"none", letterSpacing:0, fontSize:14, fontWeight:400, cursor:"pointer", margin:0 }}>
                    <div style={{ width:22, height:22, borderRadius:5, border:`2px solid ${form.commitment?T.teal:T.whiteDim}`, background:form.commitment?T.teal:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      {form.commitment && <span style={{ color:T.navy, fontSize:13, fontWeight:700 }}>✓</span>}
                    </div>
                    <span style={{ lineHeight:1.6 }}>
                      <strong style={{ color:T.white }}>I commit to this programme.</strong> I will attend my scheduled sessions on time, actively test the platform features as instructed, and provide honest feedback at the end of my 2 weeks. *
                    </span>
                  </label>
                </div>
                {errors.commitment && <span className="error-text">{errors.commitment}</span>}
              </div>

              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button className="btn-ghost" onClick={()=>setStep(1)} style={{ flex:1 }}>← Back</button>
                <button className="btn-primary" onClick={handleNext} style={{ flex:2, justifyContent:"center" }}>Review Application →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3 — REVIEW ── */}
          {step === 3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ padding:"20px 22px", background:"rgba(255,255,255,.03)", borderRadius:14, border:`1px solid ${T.glassBorder}` }}>
                <h3 className="display" style={{ fontSize:15, fontWeight:600, marginBottom:16, color:T.teal }}>Review Your Application</h3>
                {[
                  { label:"Name",      value:form.name },
                  { label:"Email",     value:form.email },
                  { label:"Phone",     value:form.phone||"Not provided" },
                  { label:"Role",      value:form.role==="student"?"Student":"Parent / Guardian" },
                  { label:"Grade",     value:form.grade },
                  { label:"Subjects",  value:form.subjects.join(", ")||"None selected" },
                  { label:"Devices",   value:form.devices.join(", ")||"None selected" },
                  { label:"Report",    value:form.reportFile ? `${form.reportFile.name} ✓` : "Not attached" },
                  { label:"Heard via", value:form.hearAbout||"Not specified" },
                ].map(row => (
                  <div key={row.label} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"8px 0", borderBottom:`1px solid rgba(255,255,255,.05)` }}>
                    <span style={{ fontSize:12, color:T.whiteDim, fontWeight:600, minWidth:80, textTransform:"uppercase", letterSpacing:".5px", paddingTop:1 }}>{row.label}</span>
                    <span style={{ fontSize:14, color:T.white, flex:1 }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding:"14px 18px", background:T.tealGlow, borderRadius:10, border:`1px solid ${T.glassBorder}`, fontSize:13, color:T.whiteDim, lineHeight:1.6 }}>
                📬 A confirmation email will be sent to <strong style={{ color:T.white }}>{form.email}</strong> immediately after you submit.
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-ghost" onClick={()=>setStep(2)} style={{ flex:1 }}>← Edit</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={submitting} style={{ flex:2, justifyContent:"center", fontSize:16 }}>
                  {submitting ? <><span className="spinner"/> Submitting...</> : "Submit Application 🚀"}
                </button>
              </div>

              <p style={{ fontSize:11, color:T.whiteDim, textAlign:"center", lineHeight:1.6 }}>
                By submitting you agree to be contacted by the ProveIt! team regarding your application. We do not share your information with third parties.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"Is this really completely free?", a:"Yes — 100% free. No hidden fees, no credit card, no catch. You're helping us test the platform and in exchange you get 2 weeks of personalised tutoring at no cost." },
    { q:"What exactly does a session look like?", a:"Sessions are live, 1-on-1/Group Google Meet/Microsoft Teams lessons. Your tutor will cover exactly what you need based on your school report and where you are in the curriculum. Sessions are also recorded so you can rewatch them." },
    { q:"I'm in Grade 12 but I didn't get great marks last term. Can I still apply?", a:"Absolutely. We're not looking for top students only — we're looking for committed students. Your current results help us understand where to focus, not whether you qualify." },
    { q:"Will I get a report at the end?", a:"Yes. At the end of your 2 weeks, your tutor will provide a written progress report showing what you covered, where you improved, and what to focus on next." },
    { q:"What if I can only attend some sessions, not all?", a:"We need committed testers, so consistent attendance is important. If something comes up, communicate with your tutor within 24 hours. Persistent no-shows may result in your slot being reassigned." },
    { q:"Can my parent apply on my behalf?", a:"Yes — parents and guardians can apply. The application form has a role selector for exactly this. We'll be in touch with both the parent and student once a slot is confirmed." },
    { q:"How quickly will I hear back?", a:"Within 24 hours. We review every application individually before confirming. You'll receive an email from info.proveit@yahoo.com if your slot is confirmed." },
    { q:"What happens after the beta?", a:"ProveIt! launches publicly after beta testing. Beta testers get a certificate of participation and early-access pricing when subscriptions open." },
  ];

  return (
    <section style={{ background:T.navyMid }}>
      <div className="container-sm">
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:12, color:T.teal, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>FAQ</div>
          <h2 className="display" style={{ fontSize:"clamp(26px,3.5vw,38px)", fontWeight:800, letterSpacing:"-1px" }}>Questions? Answered.</h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {faqs.map((f,i) => (
            <div key={i} style={{ borderRadius:12, border:`1px solid ${open===i?T.teal:T.glassBorder}`, background:open===i?T.tealGlow:"rgba(255,255,255,.02)", transition:"all .2s", overflow:"hidden" }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{ width:"100%", padding:"18px 22px", background:"none", border:"none", color:T.white, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:14, textAlign:"left" }}>
                <span className="display" style={{ fontSize:15, fontWeight:600 }}>{f.q}</span>
                <span style={{ color:T.teal, fontSize:20, flexShrink:0, transform:open===i?"rotate(45deg)":"none", transition:"transform .25s" }}>+</span>
              </button>
              {open===i && (
                <div style={{ padding:"0 22px 18px", fontSize:14, color:T.whiteDim, lineHeight:1.75 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background:T.navyMid, borderTop:`1px solid ${T.glassBorder}`, padding:"48px 24px" }}>
    <div
  className="container mobile-grid-3"
  style={{
    display:"grid",
    gridTemplateColumns:"1fr 1fr 1fr",
    gap:40,
    marginBottom:40
  }}
>
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none"><polygon points="12,2 22,8 22,16 12,22 2,16 2,8" stroke={T.teal} strokeWidth="2"/><circle cx="12" cy="12" r="2" fill={T.teal}/></svg>
          <span className="display" style={{ fontSize:18, fontWeight:700 }}>Prove<span style={{ color:T.teal }}>It!</span></span>
        </div>
        <p style={{ fontSize:13, color:T.whiteDim, lineHeight:1.7, maxWidth:260 }}>Elite Grade 12 tutoring for Mathematics, Physics and Chemistry. Built by educators, shaped by students.</p>
      </div>
      <div>
        <h4 className="display" style={{ fontSize:13, fontWeight:600, color:T.whiteDim, letterSpacing:"1px", textTransform:"uppercase", marginBottom:14 }}>Subjects</h4>
        {["Mathematics","Physics","Chemistry"].map(s=><div key={s} style={{ fontSize:13, color:T.whiteDim, marginBottom:8 }}>{s}</div>)}
      </div>
      <div>
        <h4 className="display" style={{ fontSize:13, fontWeight:600, color:T.whiteDim, letterSpacing:"1px", textTransform:"uppercase", marginBottom:14 }}>Contact Us</h4>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { label:"Support",     email:"help.proveit@yahoo.com"    },
            { label:"General",     email:"info.proveit@yahoo.com"    },
            { label:"Tutors",      email:"tutors.proveit@yahoo.com"  },
          ].map(c=>(
            <div key={c.label}>
              <div style={{ fontSize:11, color:T.whiteDim, letterSpacing:".5px", textTransform:"uppercase", marginBottom:2 }}>{c.label}</div>
              <a href={`mailto:${c.email}`} style={{ fontSize:13, color:T.teal, textDecoration:"none" }}>{c.email}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ borderTop:`1px solid ${T.glassBorder}`, paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
      <p style={{ fontSize:12, color:T.whiteDim }}>© {new Date().getFullYear()} ProveIt! · Beta Programme · All rights reserved</p>
      <p style={{ fontSize:12, color:T.whiteDim }}>Questions about the Beta Programme? <a href="mailto:help.proveit@yahoo.com" style={{ color:T.teal }}>help.proveit@yahoo.com</a></p>
    </div>
  </footer>
);

// ─── CTA BANNER ───────────────────────────────────────────────────────────────
const CTABanner = () => (
  <section style={{ background:`linear-gradient(135deg,${T.navyLight},${T.navyMid})`, borderTop:`1px solid ${T.glassBorder}`, borderBottom:`1px solid ${T.glassBorder}` }}>
    <div className="container" style={{ textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
      <h2 className="display" style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:800, letterSpacing:"-1px", marginBottom:14 }}>
        Ready to <span style={{ color:T.teal }}>ProveIt!</span>?
      </h2>
      <p style={{ fontSize:16, color:T.whiteDim, marginBottom:32, lineHeight:1.7, maxWidth:480, margin:"0 auto 32px" }}>
        50 spots. Free tutoring. Two weeks. The only question is whether you'll show up.
      </p>
      <SpotsCounter style={{ maxWidth:480, margin:"0 auto 28px" }}/>
      <a href="#apply" className="btn-primary" style={{ textDecoration:"none", fontSize:17, padding:"16px 44px" }}>Apply Now — It's Free →</a>
    </div>
  </section>
);

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyles/>
      <Nav/>
      <Hero/>
      <MutualAgreement/>
      <Subjects/>
      <HowItWorks/>
      <ApplicationForm/>
      <FAQ/>
      <CTABanner/>
      <Footer/>
    </>
  );
}
