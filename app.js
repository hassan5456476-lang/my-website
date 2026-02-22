function $(id){ return document.getElementById(id); }

// Copy helper
function copyText(id){
  const el = $(id);
  el.select?.();
  el.setSelectionRange?.(0, 99999);
  document.execCommand?.("copy");
  alert("Copied!");
}
window.copyText = copyText;

// -------- LOGIN --------
if ($("loginBtn")) {

  $("loginBtn").addEventListener("click", () => {
    const name = $("name").value.trim() || "Ali";
    const pin  = $("pin").value.trim()  || "0000";

    localStorage.setItem("nw_name", name);
    localStorage.setItem("nw_pin", pin);

    window.location.href = "dashboard.html";
  });

}

if ($("goSignup")) {
  $("goSignup").addEventListener("click", () => {
    window.location.href = "signup.html";
  });
}

// ---------- DASHBOARD ----------
function requireLogin(){
  const name = localStorage.getItem("nw_name");
  if(!name) window.location.href = "index.html";
  return name;
}

function fmtDate(d){
  return d.toLocaleString(undefined, { weekday:"short", month:"short", day:"numeric" });
}

function usdToPkr(usd, rate){
  return Math.round(usd * rate);
}

// Demo tx data
function getTx(){
  const raw = localStorage.getItem("nw_tx");
  if(raw) return JSON.parse(raw);
  const now = new Date();
  const demo = [
    { type:"Deposit",  usd:+10.00, when: new Date(now.getTime() - 86400000*3).toISOString() },
    { type:"Profit",   usd:+0.20,  when: new Date(now.getTime() - 86400000*2).toISOString() },
    { type:"Withdraw", usd:-1.00,  when: new Date(now.getTime() - 86400000*1).toISOString() },
  ];
  localStorage.setItem("nw_tx", JSON.stringify(demo));
  return demo;
}
function saveTx(list){ localStorage.setItem("nw_tx", JSON.stringify(list)); }

function renderTx(list, containerId, rate, limit=null){
  const box = $(containerId);
  if(!box) return;
  box.innerHTML = "";

  const items = limit ? list.slice(0, limit) : list.slice();
  items.slice().reverse().forEach(tx => {
    const d = new Date(tx.when);
    const signClass = tx.usd >= 0 ? "pos" : "neg";
    const icon = tx.type === "Deposit" ? "⬇️" : tx.type === "Withdraw" ? "⬆️" : "↗";
    const pkr = usdToPkr(tx.usd, rate);

    const el = document.createElement("div");
    el.className = "txItem";
    el.innerHTML = `
      <div class="txLeft">
        <div class="badge">${icon}</div>
        <div>
          <div class="txTitle">${tx.type}</div>
          <div class="txMeta">${fmtDate(d)}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div class="txAmt ${signClass}">${tx.usd >= 0 ? "+" : ""}$${tx.usd.toFixed(2)}</div>
        <div class="txMeta">PKR ${pkr}</div>
      </div>
    `;
    box.appendChild(el);
  });

  if(box.children.length === 0){
    box.innerHTML = `<div style="color:rgba(234,240,255,.55);font-size:13px">No transactions</div>`;
  }
}

// Simple chart
function drawLineChart(canvasId, values){
  const c = $(canvasId);
  if(!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);

  const pad = 16;
  const w = c.width, h = c.height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = (max-min) || 1;

  // grid
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = "#ffffff";
  for(let i=1;i<=3;i++){
    const y = pad + (h-2*pad)*(i/4);
    ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(w-pad,y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // line
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#18ff9a";
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = pad + (w-2*pad)*(i/(values.length-1));
    const y = pad + (h-2*pad)*(1 - (v-min)/range);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // dots
  values.forEach((v, i) => {
    const x = pad + (w-2*pad)*(i/(values.length-1));
    const y = pad + (h-2*pad)*(1 - (v-min)/range);
    ctx.fillStyle = "#2ae6ff";
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
  });
}

// Tabs
function switchTab(key){
  const tabs = document.querySelectorAll(".tab");
  const pages = {
    dashboard: $("page-dashboard"),
    invite: $("page-invite"),
    wallet: $("page-wallet"),
    plan: $("page-plan"),
    settings: $("page-settings"),
  };
  tabs.forEach(x => x.classList.remove("active"));
  document.querySelector(`.tab[data-tab="${key}"]`)?.classList.add("active");
  Object.values(pages).forEach(p => p?.classList.remove("active"));
  pages[key]?.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}
window.switchTab = switchTab;

// Run on dashboard
if ($("page-dashboard")) {
  const name = requireLogin();
  $("userName").textContent = name;

  $("today").textContent = new Date().toDateString();

  // Rate
  let rate = Number(localStorage.getItem("nw_rate") || 285);
  const rateInput = $("rateInput");
  const rateText = $("rateText");
  rateInput.value = rate;
  rateText.textContent = rate;

  function applyRate(){
    rate = Number(rateInput.value || 285);
    localStorage.setItem("nw_rate", rate);
    rateText.textContent = rate;

    // Update PKR fields
    $("balPkr").textContent = "PKR " + usdToPkr(0.80, rate);
    $("earnPkr").textContent = "PKR " + usdToPkr(-8.40, rate);
    $("investPkr").textContent = "PKR " + usdToPkr(10.00, rate);
    $("refPkr").textContent = "PKR " + usdToPkr(0.80, rate);

    $("p10").textContent = "PKR " + usdToPkr(10, rate);
    $("p50").textContent = "PKR " + usdToPkr(50, rate);
    $("p100").textContent = "PKR " + usdToPkr(100, rate);

    // Re-render tx
    renderTx(tx, "txList", rate, 4);
    renderTx(tx, "txListFull", rate, null);
  }
  rateInput.addEventListener("input", applyRate);

  // Hide/Show balance
  let hidden = false;
  $("toggleEye").addEventListener("click", () => {
    hidden = !hidden;
    if(hidden){
      $("balUsd").textContent = "••••";
      $("balPkr").textContent = "••••";
    } else {
      $("balUsd").textContent = "$0.80";
      $("balPkr").textContent = "PKR " + usdToPkr(0.80, rate);
    }
  });

  // Tabs click
  document.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", () => switchTab(t.dataset.tab));
  });

  // Transactions
  let tx = getTx();

  // Quick actions add tx
  $("addDeposit").addEventListener("click", () => {
    tx.push({ type:"Deposit", usd:+5.00, when:new Date().toISOString() });
    saveTx(tx);
    applyRate();
    alert("Demo: $5 deposit added");
  });
  $("addWithdraw").addEventListener("click", () => {
    tx.push({ type:"Withdraw", usd:-2.00, when:new Date().toISOString() });
    saveTx(tx);
    applyRate();
    alert("Demo: $2 withdraw added");
  });

  // Chart
  drawLineChart("profitChart", [0.2,0.35,0.28,0.42,0.55,0.48,0.62]);

  // Initial PKR render
  applyRate();

  // Logout
  $("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("nw_name");
    localStorage.removeItem("nw_pin");
    window.location.href = "index.html";
  });
}
