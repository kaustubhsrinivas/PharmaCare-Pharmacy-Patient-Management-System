const state = {
  doctors: [
    {id:1,name:"Dr. Ananya Rao",specialty:"General Medicine",phone:"+91 98765 43210"},
    {id:2,name:"Dr. Rahul Mehta",specialty:"Cardiology",phone:"+91 98765 11223"},
    {id:3,name:"Dr. Priya Sharma",specialty:"Endocrinology",phone:"+91 98765 77889"}
  ],
  patients: [
    {id:101,name:"Arjun Kumar",age:34,condition:"Hypertension",doctor:"Dr. Rahul Mehta",medicine:"Amlodipine 5 mg",timing:"1 tablet after breakfast",appointment:"2026-09-24T10:30"},
    {id:102,name:"Sneha Reddy",age:29,condition:"Type 2 Diabetes",doctor:"Dr. Priya Sharma",medicine:"Metformin 500 mg",timing:"1 tablet after breakfast & dinner",appointment:"2026-09-24T11:30"},
    {id:103,name:"Vikram Singh",age:47,condition:"High Cholesterol",doctor:"Dr. Ananya Rao",medicine:"Atorvastatin 20 mg",timing:"1 tablet at bedtime",appointment:"2026-09-24T14:00"}
  ]
};

const pages = ["dashboard","patients","doctors","medications","appointments"];
document.querySelectorAll(".nav").forEach(btn => btn.onclick = () => showPage(btn.dataset.page));

function showPage(page){
  pages.forEach(p => document.getElementById(p).classList.toggle("active-page",p===page));
  document.querySelectorAll(".nav").forEach(b => b.classList.toggle("active",b.dataset.page===page));
  document.getElementById("pageTitle").textContent = {
    dashboard:"Patient Dashboard",patients:"Patient Records",doctors:"Doctor Directory",
    medications:"Medication Schedule",appointments:"Appointments"
  }[page];
  renderAll();
}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function fmtDate(v){return new Date(v).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}

function renderAll(){
  document.getElementById("patientCount").textContent=state.patients.length;
  document.getElementById("doctorCount").textContent=state.doctors.length;
  document.getElementById("medicineCount").textContent=state.patients.length;
  document.getElementById("appointmentCount").textContent=state.patients.filter(p=>p.appointment.startsWith("2026-09-24")).length;

  document.getElementById("recentPatients").innerHTML=state.patients.slice(-5).reverse().map(p=>`
    <div class="patient"><strong>${esc(p.name)}</strong><div class="muted">${p.age} yrs · ${esc(p.condition)} · ${esc(p.doctor)}</div></div>`).join("");

  document.getElementById("todaySchedule").innerHTML=state.patients.slice().sort((a,b)=>a.appointment.localeCompare(b.appointment)).map(p=>`
    <div class="schedule"><strong>${fmtDate(p.appointment)}</strong><div class="muted">${esc(p.name)} · ${esc(p.doctor)}</div></div>`).join("");

  renderPatients(); renderDoctors(); renderMedications(); renderAppointments();
}

function renderPatients(){
  const q=(document.getElementById("patientSearch")?.value||"").toLowerCase();
  const list=state.patients.filter(p=>[p.name,p.condition,p.doctor].join(" ").toLowerCase().includes(q));
  document.getElementById("patientsTable").innerHTML=`<table><thead><tr><th>Patient</th><th>Condition</th><th>Doctor</th><th>Medicine</th><th>Timing</th></tr></thead><tbody>
  ${list.map(p=>`<tr><td><strong>${esc(p.name)}</strong><br><span class="muted">${p.age} yrs · ID ${p.id}</span></td><td><span class="badge">${esc(p.condition)}</span></td><td>${esc(p.doctor)}</td><td>${esc(p.medicine)}</td><td>${esc(p.timing)}</td></tr>`).join("")}</tbody></table>`;
}
function renderDoctors(){
  document.getElementById("doctorsGrid").innerHTML=state.doctors.map(d=>`<div class="card doctor"><h2>${esc(d.name)}</h2><p class="muted">${esc(d.specialty)}</p><p>📞 ${esc(d.phone)}</p><span class="badge">${state.patients.filter(p=>p.doctor===d.name).length} patients</span></div>`).join("");
}
function renderMedications(){
  document.getElementById("medicationsTable").innerHTML=`<table><thead><tr><th>Patient</th><th>Medicine</th><th>Dosage / Timing</th><th>Prescribed By</th></tr></thead><tbody>
  ${state.patients.map(p=>`<tr><td>${esc(p.name)}</td><td><strong>${esc(p.medicine)}</strong></td><td>${esc(p.timing)}</td><td>${esc(p.doctor)}</td></tr>`).join("")}</tbody></table>`;
}
function renderAppointments(){
  document.getElementById("appointmentsTable").innerHTML=`<table><thead><tr><th>Date & Time</th><th>Patient</th><th>Doctor</th><th>Condition</th></tr></thead><tbody>
  ${state.patients.slice().sort((a,b)=>a.appointment.localeCompare(b.appointment)).map(p=>`<tr><td><strong>${fmtDate(p.appointment)}</strong></td><td>${esc(p.name)}</td><td>${esc(p.doctor)}</td><td>${esc(p.condition)}</td></tr>`).join("")}</tbody></table>`;
}
function openPatientModal(){
  document.getElementById("doctorSelect").innerHTML=state.doctors.map(d=>`<option>${esc(d.name)}</option>`).join("");
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
document.getElementById("patientForm").onsubmit=e=>{
  e.preventDefault(); const f=new FormData(e.target);
  state.patients.push({
    id:Date.now(),name:f.get("name"),age:f.get("age"),condition:f.get("condition"),
    doctor:f.get("doctor"),medicine:f.get("medicine"),timing:f.get("timing"),appointment:f.get("appointment")
  });
  e.target.reset(); closeModal(); renderAll(); showPage("patients");
};
renderAll();
