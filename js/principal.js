"use strict";
document.addEventListener("DOMContentLoaded",()=>{
 const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
 const setMenu=open=>{if(!toggle||!nav)return;toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Tancar el menú":"Obrir el menú");nav.classList.toggle("open",open);document.body.classList.toggle("menu-open",open)};
 if(toggle&&nav){toggle.addEventListener("click",()=>setMenu(toggle.getAttribute("aria-expanded")!=="true"));nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});window.addEventListener("resize",()=>{if(innerWidth>1000)setMenu(false)})}
 document.querySelectorAll(".product-card").forEach(card=>{
  const photo=card.querySelector(".product-photo"),price=card.querySelector(".price");
  card.querySelectorAll("button.format").forEach(btn=>btn.addEventListener("click",()=>{card.querySelectorAll("button.format").forEach(x=>{x.classList.remove("active");x.setAttribute("aria-pressed","false")});btn.classList.add("active");btn.setAttribute("aria-pressed","true");if(photo){photo.src=btn.dataset.image;photo.alt=`Paquet BARFEAND ${card.querySelector('h3').textContent} de ${btn.dataset.weight==='1000'?'1 kg':'500 g'}`};if(price)price.textContent=btn.dataset.price}))
 });
 const dialog=document.getElementById("label-dialog"),title=document.getElementById("dialog-title"),dprice=document.getElementById("dialog-price"),dweight=document.getElementById("dialog-weight"),ding=document.getElementById("dialog-ingredients");
 document.querySelectorAll(".label-button").forEach(btn=>btn.addEventListener("click",()=>{const card=btn.closest(".product-card"),active=card.querySelector("button.format.active"),name=btn.dataset.productName,price=card.querySelector(".price").textContent,weight=active?(active.dataset.weight==="1000"?"1 KG":"500 GR"):"500 GR",ingredients=card.querySelector(".ingredients").innerHTML;if(title)title.textContent=name;if(dprice)dprice.textContent=price;if(dweight)dweight.textContent=`Pes: ${weight}`;if(ding)ding.innerHTML=ingredients;dialog?.showModal()}));
 document.querySelector(".dialog-close")?.addEventListener("click",()=>dialog?.close());dialog?.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 document.querySelectorAll(".accordion details").forEach(current=>current.addEventListener("toggle",()=>{if(current.open)document.querySelectorAll(".accordion details").forEach(other=>{if(other!==current)other.open=false})}));
 const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
});