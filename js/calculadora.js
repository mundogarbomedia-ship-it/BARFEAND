"use strict";
document.addEventListener("DOMContentLoaded",()=>{
 const form=document.getElementById("formulari-calculadora"),result=document.getElementById("resultat-calculadora");if(!form||!result)return;
 const base={gos:{cadell:6,adult:2.5,senior:2},gat:{cadell:5,adult:3,senior:2.5}},act={baixa:-.3,normal:0,alta:.5},goal={baixar:-.3,mantenir:0,augmentar:.4},limits={cadell:[4,10],adult:[1.5,4],senior:[1.5,3.5]},fmt=new Intl.NumberFormat("ca-AD",{minimumFractionDigits:1,maximumFractionDigits:1});
 const round5=g=>Math.round(g/5)*5;
 form.addEventListener("submit",e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}const species=document.getElementById("especie").value,weight=parseFloat(document.getElementById("pes").value),stage=document.getElementById("etapa").value,activity=document.getElementById("activitat").value,target=document.getElementById("objectiu").value;if(!Number.isFinite(weight)||weight<.5||weight>120)return;
  let pct=base[species][stage]+act[activity]+goal[target];pct=Math.min(Math.max(pct,limits[stage][0]),limits[stage][1]);const daily=round5(weight*pct/100*1000),lo=round5(daily*.9),hi=round5(daily*1.1),monthly=daily*30/1000;
  const halfUnits=Math.ceil(monthly*2),kg=Math.floor(halfUnits/2),half=halfUnits%2;const packs=[];if(kg)packs.push(`${kg} ${kg===1?'paquet':'paquets'} d’1 kg`);if(half)packs.push(`1 paquet de 500 g`);
  result.hidden=false;result.innerHTML=`<p class="eyebrow">Ració diària orientativa</p><h3>${daily} g al dia</h3><p>Rang aproximat: <strong>${lo}–${hi} g diaris</strong></p><ul><li><strong>${fmt.format(daily*7/1000)} kg</strong> per setmana</li><li><strong>${fmt.format(monthly)} kg</strong> cada 30 dies</li><li>Per cobrir 30 dies amb els formats actuals: <strong>${packs.join(' + ')}</strong></li></ul><p>Càlcul aplicat: ${fmt.format(pct)} % del pes corporal.</p>`;result.setAttribute("tabindex","-1");result.focus();
 });
});