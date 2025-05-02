import{j as e,c as ke,s as ee,A as Te,D as De,B as O,u as Pe,T as me,a as Ie,I as Y,M as $e,b as E,N as Ae,d as Ee,e as se,f as Re,g as ne,h as ie,L as oe,i as Be,C as Le,k as Fe,l as Ue,m as ze,n as Me,o as Oe,P as _e,S as We,E as Ge,p as Je,q as He,r as G,t as Ve,v as le,G as J,w as qe}from"./ui-CBvnUCyv.js";import{f as Ye,a as u,u as ge,h as xe,c as fe,i as be,j as U,B as Xe}from"./vendor-BHItRJsf.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const m of document.querySelectorAll('link[rel="modulepreload"]'))n(m);new MutationObserver(m=>{for(const p of m)if(p.type==="childList")for(const x of p.addedNodes)x.tagName==="LINK"&&x.rel==="modulepreload"&&n(x)}).observe(document,{childList:!0,subtree:!0});function l(m){const p={};return m.integrity&&(p.integrity=m.integrity),m.referrerPolicy&&(p.referrerPolicy=m.referrerPolicy),m.crossOrigin==="use-credentials"?p.credentials="include":m.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function n(m){if(m.ep)return;m.ep=!0;const p=l(m);fetch(m.href,p)}})();var X={},ce;function Ke(){if(ce)return X;ce=1;var t=Ye();return X.createRoot=t.createRoot,X.hydrateRoot=t.hydrateRoot,X}var Qe=Ke();const Ze=()=>e.jsxs("section",{className:"user-stats",children:[e.jsx("h2",{children:"User Statistics"}),e.jsx("p",{children:"Points: 0"}),e.jsx("p",{children:"Activity: N/A"})]}),et=()=>e.jsxs("section",{className:"ad-rewards",children:[e.jsx("h2",{children:"Ad Rewards"}),e.jsx("p",{children:"No rewards available."})]}),tt=()=>{const[t,r]=u.useState(()=>{const c=localStorage.getItem("dailyRewardLastClaim");if(!c)return!1;const s=new Date(parseInt(c));return new Date().getTime()-s.getTime()<864e5}),[l,n]=u.useState(()=>parseInt(localStorage.getItem("userCoins")||"0")),[m,p]=u.useState(null);u.useEffect(()=>{if(t){const c=new Date(parseInt(localStorage.getItem("dailyRewardLastClaim"))),s=new Date(c.getTime()+24*60*60*1e3);p(s);const o=setInterval(()=>{new Date>=s&&(r(!1),p(null),clearInterval(o))},1e3*60);return()=>clearInterval(o)}},[t]);const x=()=>{const c=new Date,s=l+100;r(!0),n(s),localStorage.setItem("dailyRewardLastClaim",c.getTime().toString()),localStorage.setItem("userCoins",s.toString()),p(new Date(c.getTime()+24*60*60*1e3)),alert("Daily reward claimed! +100 coins (Client-side simulation)")},k=c=>{const s=Math.floor((c-new Date().getTime())/1e3);if(s<=0)return"Ready!";const o=Math.floor(s/3600),y=Math.floor(s%3600/60);return`${o}h ${y}m left`};return e.jsxs("section",{className:"daily-reward",children:[e.jsx("h2",{children:"Daily Reward"}),t?e.jsxs("div",{children:[e.jsx("p",{children:"You have claimed your daily reward today!"}),m&&e.jsxs("p",{children:["Next claim available in: ",k(m)]})]}):e.jsx("button",{onClick:x,disabled:t,children:"Claim Daily Coins (+100)"}),e.jsxs("p",{children:["Total Coins: ",l]})]})},rt=()=>{const t=[{username:"User123",coins:1200},{username:"Player456",coins:950},{username:"Gamer789",coins:800}];return e.jsxs("section",{className:"leaderboard",children:[e.jsx("h2",{children:"Leaderboard"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Rank"}),e.jsx("th",{children:"Username"}),e.jsx("th",{children:"Coins"})]})}),e.jsx("tbody",{children:t.map((r,l)=>e.jsxs("tr",{children:[e.jsx("td",{children:l+1}),e.jsx("td",{children:r.username}),e.jsx("td",{children:r.coins})]},r.username))})]})]})},ve=({profile:t})=>e.jsxs("section",{className:"profile-view",children:[e.jsxs("h2",{children:[t.username,"'s Profile"]}),t.banner&&e.jsx("img",{src:t.banner,alt:"Profile Banner",className:"profile-banner"}),e.jsx("p",{children:t.info})]});ve.defaultProps={profile:{username:"User123",banner:"https://via.placeholder.com/728x90.png?text=Banner",info:"This is a sample user profile."}};const at=({profile:t,onSave:r})=>{const[l,n]=u.useState(t||{username:"",banner:"",info:""});u.useEffect(()=>{t&&n(t)},[t]);const m=x=>{n({...l,[x.target.name]:x.target.value})},p=x=>{x.preventDefault(),r?r(l):alert("Profile save handler not configured!")};return e.jsxs("section",{className:"profile-editor",children:[e.jsx("h2",{children:"Edit Profile"}),e.jsxs("form",{onSubmit:p,children:[e.jsxs("label",{children:["Username:",e.jsx("input",{type:"text",name:"username",value:l.username,onChange:m})]}),e.jsxs("label",{children:["Banner URL:",e.jsx("input",{type:"text",name:"banner",value:l.banner,onChange:m})]}),e.jsxs("label",{children:["Info:",e.jsx("textarea",{name:"info",value:l.info,onChange:m})]}),e.jsx("button",{type:"submit",children:"Save Profile"})]})]})},C="https://draftbot-dashboard.vercel.app/api",S=async t=>{if(!t.ok){const r=await t.json().catch(()=>({}));throw new Error(r.message||`API error: ${t.status}`)}return t.json()},N=(t,r)=>(console.error(`API Error (${r}):`,t),{success:!1,error:t.message||"Unknown error occurred",context:r}),te={login:async t=>{try{const r=await fetch(`${C}/auth/discord`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:t}),credentials:"include"});return S(r)}catch(r){return N(r,"auth.login")}},logout:async()=>{try{const t=await fetch(`${C}/auth/logout`,{method:"POST",credentials:"include"});return S(t)}catch(t){return N(t,"auth.logout")}},getProfile:async()=>{try{const t=await fetch(`${C}/auth/profile`,{credentials:"include"});return S(t)}catch(t){return N(t,"auth.getProfile")}},getServers:async()=>{try{const t=await fetch(`${C}/auth/servers`,{credentials:"include"});return S(t)}catch(t){return N(t,"auth.getServers")}},updateProfile:async t=>{try{const r=await fetch(`${C}/auth/profile`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),credentials:"include"});return S(r)}catch(r){return N(r,"auth.updateProfile")}},updatePreferences:async t=>{try{const r=await fetch(`${C}/auth/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),credentials:"include"});return S(r)}catch(r){return N(r,"auth.updatePreferences")}}},z={getSlotTemplates:async t=>{try{const r=await fetch(`${C}/visual/${t}/slots`,{credentials:"include"});return S(r)}catch(r){return N(r,"visual.getSlotTemplates")}},saveSlotTemplate:async(t,r)=>{try{const l=await fetch(`${C}/visual/${t}/slots`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),credentials:"include"});return S(l)}catch(l){return N(l,"visual.saveSlotTemplate")}},getLeaderboardTemplates:async t=>{try{const r=await fetch(`${C}/visual/${t}/leaderboard`,{credentials:"include"});return S(r)}catch(r){return N(r,"visual.getLeaderboardTemplates")}},saveLeaderboardTemplate:async(t,r)=>{try{const l=await fetch(`${C}/visual/${t}/leaderboard`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),credentials:"include"});return S(l)}catch(l){return N(l,"visual.saveLeaderboardTemplate")}}},de={getConfig:async t=>{try{const r=await fetch(`${C}/config/${t}`,{credentials:"include"});return S(r)}catch(r){return N(r,"config.getConfig")}},saveConfig:async(t,r)=>{try{const l=await fetch(`${C}/config/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),credentials:"include"});return S(l)}catch(l){return N(l,"config.saveConfig")}}},K={getScrims:async t=>{try{const r=await fetch(`${C}/scrims/${t}`,{credentials:"include"});return S(r)}catch(r){return N(r,"scrim.getScrims")}},createScrim:async(t,r)=>{try{const l=await fetch(`${C}/scrims/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r),credentials:"include"});return S(l)}catch(l){return N(l,"scrim.createScrim")}},updateScrim:async(t,r,l)=>{try{const n=await fetch(`${C}/scrims/${t}/${r}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(l),credentials:"include"});return S(n)}catch(n){return N(n,"scrim.updateScrim")}},deleteScrim:async(t,r)=>{try{const l=await fetch(`${C}/scrims/${t}/${r}`,{method:"DELETE",credentials:"include"});return S(l)}catch(l){return N(l,"scrim.deleteScrim")}}},Q={getProfile:async()=>{try{const t=await fetch(`${C}/user/profile`,{credentials:"include"});return S(t)}catch(t){return N(t,"userProfile.getProfile")}},updateProfile:async t=>{try{const r=await fetch(`${C}/user/profile`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),credentials:"include"});return S(r)}catch(r){return N(r,"userProfile.updateProfile")}},updateAvatar:async t=>{try{const r=await fetch(`${C}/user/avatar`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),credentials:"include"});return S(r)}catch(r){return N(r,"userProfile.updateAvatar")}},getSettings:async()=>{try{const t=await fetch(`${C}/user/settings`,{credentials:"include"});return S(t)}catch(t){return N(t,"userProfile.getSettings")}},updateSettings:async t=>{try{const r=await fetch(`${C}/user/settings`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),credentials:"include"});return S(r)}catch(r){return N(r,"userProfile.updateSettings")}},getStoreItems:async()=>{try{const t=await fetch(`${C}/user/store/items`,{credentials:"include"});return S(t)}catch(t){return N(t,"userProfile.getStoreItems")}},purchaseItem:async t=>{try{const r=await fetch(`${C}/user/store/purchase`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),credentials:"include"});return S(r)}catch(r){return N(r,"userProfile.purchaseItem")}},activateItem:async t=>{try{const r=await fetch(`${C}/user/store/activate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),credentials:"include"});return S(r)}catch(r){return N(r,"userProfile.activateItem")}},getUserInventory:async()=>{try{const t=await fetch(`${C}/user/inventory`,{credentials:"include"});return S(t)}catch(t){return N(t,"userProfile.getUserInventory")}}};Object.assign(z,{saveCanvasTemplate:async(t,r,l)=>{try{const n=await fetch(`${C}/visual/${t}/${r}/canvas`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l),credentials:"include"});return S(n)}catch(n){return N(n,"visual.saveCanvasTemplate")}},getCanvasTemplate:async(t,r)=>{try{const l=await fetch(`${C}/visual/${t}/${r}/canvas`,{credentials:"include"});return S(l)}catch(l){return N(l,"visual.getCanvasTemplate")}}});const st=({userId:t})=>{const[r,l]=u.useState({banners:[{id:"banner1",name:"Premium Banner",price:500,imageUrl:"https://via.placeholder.com/728x90.png?text=Premium+Banner",description:"A sleek premium banner for your profile"},{id:"banner2",name:"Gold Banner",price:1e3,imageUrl:"https://via.placeholder.com/728x90.png?text=Gold+Banner",description:"Show off your status with this gold banner"},{id:"banner3",name:"Diamond Banner",price:2e3,imageUrl:"https://via.placeholder.com/728x90.png?text=Diamond+Banner",description:"The ultimate banner for true champions"}],tags:[{id:"tag1",name:"Pro Player",price:300,color:"#ff5722",description:"Mark yourself as a professional player"},{id:"tag2",name:"Team Captain",price:500,color:"#2196f3",description:"Show that you lead your team to victory"},{id:"tag3",name:"Tournament Winner",price:800,color:"#ffc107",description:"Display your tournament achievements"}]}),[n,m]=u.useState({coins:1e3,inventory:[],activeBanner:null,activeTags:[]}),[p,x]=u.useState("banners"),[k,c]=u.useState(!1),[s,o]=u.useState(null),[y,w]=u.useState("");u.useEffect(()=>{(async()=>{if(t){c(!0),o(null);try{const f=await Q.getProfile();if(f.success)m({coins:f.profile.coins||1e3,inventory:f.profile.inventory||[],activeBanner:f.profile.activeBanner||null,activeTags:f.profile.activeTags||[]});else throw new Error(f.error||"Failed to load profile");const g=await Q.getStoreItems();g.success&&g.items&&l(g.items)}catch(f){console.error("Failed to fetch data:",f),o(`Failed to load data: ${f.message}`)}finally{c(!1)}}})()},[t]);const I=async(a,f)=>{if(n.coins<a.price){o("Not enough coins to purchase this item"),setTimeout(()=>o(null),3e3);return}c(!0),o(null);try{const g={itemId:a.id,itemType:f,price:a.price},j=await Q.purchaseItem(g);if(j.success){const i=[...n.inventory,{...a,type:f}],v=j.newCoins||n.coins-a.price;m({...n,coins:v,inventory:i}),w(`Successfully purchased ${a.name}!`)}else throw new Error(j.error||"Failed to purchase item");setTimeout(()=>w(""),3e3)}catch(g){console.error("Failed to purchase item:",g),o(`Purchase failed: ${g.message}`)}finally{c(!1)}},A=async(a,f)=>{c(!0),o(null);try{const g=T(a.id,f),j={itemId:a.id,itemType:f,active:!g},i=await Q.activateItem(j);if(i.success){if(f==="banner")m({...n,activeBanner:g?null:a.id});else if(f==="tag"){const v=g?n.activeTags.filter(B=>B!==a.id):[...n.activeTags,a.id];m({...n,activeTags:v})}w(`Successfully ${g?"deactivated":"activated"} ${a.name}!`)}else throw new Error(i.error||"Failed to update item status");setTimeout(()=>w(""),3e3)}catch(g){console.error("Failed to activate item:",g),o(`Activation failed: ${g.message}`)}finally{c(!1)}},P=a=>n.inventory.some(f=>f.id===a),T=(a,f)=>f==="banner"?n.activeBanner===a:f==="tag"?n.activeTags.includes(a):!1;return e.jsxs("section",{className:"profile-store",children:[e.jsx("h2",{children:"Profile Store"}),s&&e.jsx("div",{className:"error-message",children:s}),y&&e.jsx("div",{className:"success-message",children:y}),e.jsxs("div",{className:"store-header",children:[e.jsxs("div",{className:"user-coins",children:[e.jsx("span",{className:"coin-icon",children:"🪙"}),e.jsx("span",{className:"coin-amount",children:n.coins})]}),e.jsxs("div",{className:"store-tabs",children:[e.jsx("button",{className:`tab-button ${p==="banners"?"active":""}`,onClick:()=>x("banners"),children:"Banners"}),e.jsx("button",{className:`tab-button ${p==="tags"?"active":""}`,onClick:()=>x("tags"),children:"Tags"}),e.jsx("button",{className:`tab-button ${p==="inventory"?"active":""}`,onClick:()=>x("inventory"),children:"My Items"})]})]}),e.jsxs("div",{className:"store-content",children:[p==="banners"&&e.jsx("div",{className:"item-grid",children:r.banners.map(a=>e.jsxs("div",{className:"store-item",children:[e.jsx("img",{src:a.imageUrl,alt:a.name,className:"item-image"}),e.jsx("h3",{children:a.name}),e.jsx("p",{children:a.description}),e.jsxs("div",{className:"item-price",children:[e.jsx("span",{className:"coin-icon",children:"🪙"}),e.jsx("span",{children:a.price})]}),P(a.id)?e.jsx("button",{className:`activate-button ${T(a.id,"banner")?"active":""}`,onClick:()=>A(a,"banner"),disabled:k,children:T(a.id,"banner")?"Active":"Activate"}):e.jsx("button",{className:"purchase-button",onClick:()=>I(a,"banner"),disabled:k||n.coins<a.price,children:"Purchase"})]},a.id))}),p==="tags"&&e.jsx("div",{className:"item-grid",children:r.tags.map(a=>e.jsxs("div",{className:"store-item",children:[e.jsx("div",{className:"tag-preview",style:{backgroundColor:a.color},children:a.name}),e.jsx("h3",{children:a.name}),e.jsx("p",{children:a.description}),e.jsxs("div",{className:"item-price",children:[e.jsx("span",{className:"coin-icon",children:"🪙"}),e.jsx("span",{children:a.price})]}),P(a.id)?e.jsx("button",{className:`activate-button ${T(a.id,"tag")?"active":""}`,onClick:()=>A(a,"tag"),disabled:k,children:T(a.id,"tag")?"Active":"Activate"}):e.jsx("button",{className:"purchase-button",onClick:()=>I(a,"tag"),disabled:k||n.coins<a.price,children:"Purchase"})]},a.id))}),p==="inventory"&&e.jsx("div",{className:"inventory-section",children:n.inventory.length===0?e.jsx("p",{className:"empty-inventory",children:"You don't have any items yet. Purchase some from the store!"}):e.jsx("div",{className:"item-grid",children:n.inventory.map(a=>e.jsxs("div",{className:"inventory-item",children:[a.type==="banner"?e.jsx("img",{src:a.imageUrl,alt:a.name,className:"item-image"}):e.jsx("div",{className:"tag-preview",style:{backgroundColor:a.color},children:a.name}),e.jsx("h3",{children:a.name}),e.jsx("p",{children:a.description}),e.jsx("button",{className:`activate-button ${T(a.id,a.type)?"active":""}`,onClick:()=>A(a,a.type),disabled:k,children:T(a.id,a.type)?"Active":"Activate"})]},a.id))})})]}),e.jsx("style",{jsx:!0,children:`
        .profile-store {
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .store-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .user-coins {
          display: flex;
          align-items: center;
          font-size: 1.2rem;
          font-weight: bold;
          background-color: #fff;
          padding: 8px 15px;
          border-radius: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .coin-icon {
          margin-right: 5px;
        }
        
        .store-tabs {
          display: flex;
          gap: 10px;
        }
        
        .tab-button {
          padding: 8px 15px;
          border: none;
          border-radius: 20px;
          background-color: #e0e0e0;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }
        
        .tab-button.active {
          background-color: #7289da;
          color: white;
        }
        
        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .store-item, .inventory-item {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        
        .item-image {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .tag-preview {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .item-price {
          display: flex;
          align-items: center;
          margin: 10px 0;
          font-weight: bold;
        }
        
        .purchase-button, .activate-button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: auto;
          transition: all 0.2s;
        }
        
        .purchase-button {
          background-color: #7289da;
          color: white;
        }
        
        .purchase-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
        
        .activate-button {
          background-color: #e0e0e0;
          color: #333;
        }
        
        .activate-button.active {
          background-color: #4caf50;
          color: white;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .success-message {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .empty-inventory {
          text-align: center;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `})]})},je=({serverId:t})=>{const[r,l]=u.useState([]),[n,m]=u.useState({name:"",time:"",description:"",lobby_size:20,vip_size:2,start_slot:1}),[p,x]=u.useState(!1),[k,c]=u.useState(null),[s,o]=u.useState(null),[y,w]=u.useState("general");u.useEffect(()=>{if(!t)return;(async()=>{x(!0),c(null);try{const v=await K.getScrims(t);l(v)}catch(v){console.error("Failed to fetch scrims:",v),c(`Failed to load scrims: ${v.message}`)}finally{x(!1)}})()},[t]);const I=async i=>{if(i.preventDefault(),!t){alert("Please select a server first");return}x(!0),c(null);try{const v=await K.createScrim(t,n);l([...r,v]),m({name:"",time:"",description:"",lobby_size:20,vip_size:2,start_slot:1}),alert("Scrim created successfully!")}catch(v){console.error("Failed to create scrim:",v),c(`Failed to create scrim: ${v.message}`)}finally{x(!1)}},A=async i=>{if(i.preventDefault(),!(!t||!s)){x(!0),c(null);try{const v=await K.updateScrim(t,s.id,s);l(r.map(B=>B.id===v.id?v:B)),o(null),alert("Scrim updated successfully!")}catch(v){console.error("Failed to update scrim:",v),c(`Failed to update scrim: ${v.message}`)}finally{x(!1)}}},P=async i=>{if(t&&confirm("Are you sure you want to delete this scrim?")){x(!0),c(null);try{await K.deleteScrim(t,i),l(r.filter(v=>v.id!==i)),alert("Scrim deleted successfully!")}catch(v){console.error("Failed to delete scrim:",v),c(`Failed to delete scrim: ${v.message}`)}finally{x(!1)}}},T=i=>{o({...i})},a=()=>{o(null)},f=()=>e.jsxs("div",{className:"scrim-settings-panel",children:[e.jsx("h4",{children:"General Settings"}),e.jsxs("div",{className:"settings-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Scrim Name:"}),e.jsx("input",{type:"text",value:s.name,onChange:i=>o({...s,name:i.target.value})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Lobby Size:"}),e.jsx("input",{type:"number",value:s.lobby_size,onChange:i=>o({...s,lobby_size:parseInt(i.target.value)}),min:"1",max:"100"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"VIP Size:"}),e.jsx("input",{type:"number",value:s.vip_size,onChange:i=>o({...s,vip_size:parseInt(i.target.value)}),min:"0",max:"20"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Start Slot:"}),e.jsx("input",{type:"number",value:s.start_slot,onChange:i=>o({...s,start_slot:parseInt(i.target.value)}),min:"1",max:"100"})]})]})]}),g=()=>{var i,v,B,_;return e.jsxs("div",{className:"scrim-settings-panel",children:[e.jsx("h4",{children:"Roles Configuration"}),e.jsxs("div",{className:"settings-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Registration Role ID:"}),e.jsx("input",{type:"text",value:((i=s.roles)==null?void 0:i.registration)||"",onChange:$=>o({...s,roles:{...s.roles||{},registration:$.target.value}}),placeholder:"Discord Role ID"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Waitlist Role ID:"}),e.jsx("input",{type:"text",value:((v=s.roles)==null?void 0:v.waitlist)||"",onChange:$=>o({...s,roles:{...s.roles||{},waitlist:$.target.value}}),placeholder:"Discord Role ID"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Code Role ID:"}),e.jsx("input",{type:"text",value:((B=s.roles)==null?void 0:B.code)||"",onChange:$=>o({...s,roles:{...s.roles||{},code:$.target.value}}),placeholder:"Discord Role ID"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Ban Role ID:"}),e.jsx("input",{type:"text",value:((_=s.roles)==null?void 0:_.ban)||"",onChange:$=>o({...s,roles:{...s.roles||{},ban:$.target.value}}),placeholder:"Discord Role ID"})]})]})]})},j=()=>{var i,v,B,_;return e.jsxs("div",{className:"scrim-settings-panel",children:[e.jsx("h4",{children:"Channels Configuration"}),e.jsxs("div",{className:"settings-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Notification Channel ID:"}),e.jsx("input",{type:"text",value:((i=s.channels)==null?void 0:i.notification)||"",onChange:$=>o({...s,channels:{...s.channels||{},notification:$.target.value}}),placeholder:"Discord Channel ID"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Registration Channel ID:"}),e.jsx("input",{type:"text",value:((v=s.channels)==null?void 0:v.registration)||"",onChange:$=>o({...s,channels:{...s.channels||{},registration:$.target.value}}),placeholder:"Discord Channel ID"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Slots Channel ID:"}),e.jsx("input",{type:"text",value:((B=s.channels)==null?void 0:B.slots)||"",onChange:$=>o({...s,channels:{...s.channels||{},slots:$.target.value}}),placeholder:"Discord Channel ID"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Waitlist Channel ID:"}),e.jsx("input",{type:"text",value:((_=s.channels)==null?void 0:_.waitlist)||"",onChange:$=>o({...s,channels:{...s.channels||{},waitlist:$.target.value}}),placeholder:"Discord Channel ID"})]})]})]})};return e.jsxs("section",{className:"scrim-manager",children:[e.jsx("h3",{children:"Scrim Management"}),k&&e.jsx("div",{className:"error-message",children:k}),s?e.jsxs("div",{className:"edit-scrim-panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsxs("h4",{children:["Edit Scrim: ",s.name]}),e.jsx("button",{onClick:a,className:"cancel-button",children:"Cancel"})]}),e.jsxs("div",{className:"tabs",children:[e.jsx("button",{className:`tab-button ${y==="general"?"active":""}`,onClick:()=>w("general"),children:"General"}),e.jsx("button",{className:`tab-button ${y==="roles"?"active":""}`,onClick:()=>w("roles"),children:"Roles"}),e.jsx("button",{className:`tab-button ${y==="channels"?"active":""}`,onClick:()=>w("channels"),children:"Channels"})]}),e.jsxs("form",{onSubmit:A,children:[y==="general"&&f(),y==="roles"&&g(),y==="channels"&&j(),e.jsx("div",{className:"form-actions",children:e.jsx("button",{type:"submit",disabled:p,className:"primary-button",children:p?"Saving...":"Save Changes"})})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("form",{onSubmit:I,className:"create-scrim-form",children:[e.jsx("h4",{children:"Create New Scrim"}),e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Name:"}),e.jsx("input",{type:"text",value:n.name,onChange:i=>m({...n,name:i.target.value}),required:!0,disabled:p})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Time:"}),e.jsx("input",{type:"datetime-local",value:n.time,onChange:i=>m({...n,time:i.target.value}),required:!0,disabled:p})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Lobby Size:"}),e.jsx("input",{type:"number",value:n.lobby_size,onChange:i=>m({...n,lobby_size:parseInt(i.target.value)}),min:"1",max:"100",disabled:p})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"VIP Size:"}),e.jsx("input",{type:"number",value:n.vip_size,onChange:i=>m({...n,vip_size:parseInt(i.target.value)}),min:"0",max:"20",disabled:p})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx("label",{children:"Description:"}),e.jsx("textarea",{value:n.description,onChange:i=>m({...n,description:i.target.value}),disabled:p,rows:"3"})]})]}),e.jsx("button",{type:"submit",disabled:p,className:"primary-button",children:p?"Creating...":"Create Scrim"})]}),e.jsxs("div",{className:"scrims-list",children:[e.jsx("h4",{children:"Existing Scrims"}),p&&e.jsx("p",{children:"Loading scrims..."}),!p&&r.length===0?e.jsx("p",{children:"No scrims configured. Create your first scrim above."}):e.jsx("div",{className:"scrim-cards",children:r.map(i=>e.jsxs("div",{className:"scrim-card",children:[e.jsxs("div",{className:"scrim-card-header",children:[e.jsx("h5",{children:i.name}),e.jsx("span",{className:`status-badge ${i.enabled?"enabled":"disabled"}`,children:i.enabled?"Enabled":"Disabled"})]}),e.jsxs("div",{className:"scrim-card-body",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Lobby Size:"})," ",i.lobby_size]}),e.jsxs("p",{children:[e.jsx("strong",{children:"VIP Slots:"})," ",i.vip_size]}),i.time&&e.jsxs("p",{children:[e.jsx("strong",{children:"Time:"})," ",new Date(i.time).toLocaleString()]}),i.description&&e.jsxs("p",{children:[e.jsx("strong",{children:"Description:"})," ",i.description]})]}),e.jsxs("div",{className:"scrim-card-actions",children:[e.jsx("button",{onClick:()=>T(i),className:"edit-button",children:"Edit"}),e.jsx("button",{onClick:()=>P(i.id),className:"delete-button",children:"Delete"})]})]},i.id))})]})]}),e.jsx("style",{jsx:!0,children:`
        .scrim-manager {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .error-message {
          color: red;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
        
        .create-scrim-form {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-group {
          margin-bottom: 10px;
        }
        
        .full-width {
          grid-column: span 2;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .primary-button {
          background-color: #7289da;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .primary-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
        
        .scrim-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }
        
        .scrim-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .scrim-card-header {
          background-color: #2c2f33;
          color: white;
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .scrim-card-header h5 {
          margin: 0;
          font-size: 16px;
        }
        
        .status-badge {
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 12px;
        }
        
        .status-badge.enabled {
          background-color: #43b581;
        }
        
        .status-badge.disabled {
          background-color: #f04747;
        }
        
        .scrim-card-body {
          padding: 15px;
        }
        
        .scrim-card-body p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .scrim-card-actions {
          display: flex;
          border-top: 1px solid #eee;
        }
        
        .scrim-card-actions button {
          flex: 1;
          padding: 10px;
          border: none;
          background-color: #f5f5f5;
          cursor: pointer;
        }
        
        .edit-button:hover {
          background-color: #7289da;
          color: white;
        }
        
        .delete-button:hover {
          background-color: #f04747;
          color: white;
        }
        
        .edit-scrim-panel {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .cancel-button {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }
        
        .tab-button {
          padding: 10px 15px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          margin-right: 10px;
        }
        
        .tab-button.active {
          border-bottom-color: #7289da;
          font-weight: bold;
        }
        
        .scrim-settings-panel {
          margin-bottom: 20px;
        }
        
        .settings-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .form-actions {
          margin-top: 20px;
          text-align: right;
        }
      `})]})},ye=({serverId:t})=>{const[r,l]=u.useState({adminRole:"",modRole:"",logChannel:"",welcomeChannel:"",registrationChannel:"",resultsChannel:"",notificationChannel:"",banChannel:""}),[n,m]=u.useState(!1),[p,x]=u.useState(null),[k,c]=u.useState(!1);u.useEffect(()=>{if(!t)return;(async()=>{m(!0),x(null);try{const w=await de.getConfig(t);l(w)}catch(w){console.error("Failed to fetch configuration:",w),x(`Failed to load configuration: ${w.message}`)}finally{m(!1)}})()},[t]);const s=y=>{l({...r,[y.target.name]:y.target.value}),k&&c(!1)},o=async y=>{if(y.preventDefault(),!t){alert("Please select a server first");return}m(!0),x(null),c(!1);try{await de.saveConfig(t,r),c(!0),setTimeout(()=>c(!1),5e3)}catch(w){console.error("Failed to save configuration:",w),x(`Failed to save configuration: ${w.message}`)}finally{m(!1)}};return e.jsxs("section",{className:"role-channel-config",children:[e.jsx("h3",{children:"Role & Channel Configuration"}),p&&e.jsx("div",{className:"error-message",children:p}),k&&e.jsx("div",{className:"success-message",children:"Configuration saved successfully!"}),e.jsxs("form",{onSubmit:o,children:[e.jsxs("div",{className:"config-grid",children:[e.jsxs("div",{className:"config-section",children:[e.jsx("h4",{children:"Role Configuration"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"adminRole",children:"Admin Role ID:"}),e.jsx("input",{id:"adminRole",type:"text",name:"adminRole",value:r.adminRole,onChange:s,placeholder:"Enter Role ID",disabled:n}),e.jsx("small",{children:"Users with this role can access all admin features"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"modRole",children:"Moderator Role ID:"}),e.jsx("input",{id:"modRole",type:"text",name:"modRole",value:r.modRole,onChange:s,placeholder:"Enter Role ID",disabled:n}),e.jsx("small",{children:"Users with this role can moderate but have limited admin access"})]})]}),e.jsxs("div",{className:"config-section",children:[e.jsx("h4",{children:"Channel Configuration"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"logChannel",children:"Log Channel ID:"}),e.jsx("input",{id:"logChannel",type:"text",name:"logChannel",value:r.logChannel,onChange:s,placeholder:"Enter Channel ID",disabled:n}),e.jsx("small",{children:"Channel where bot logs will be sent"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"welcomeChannel",children:"Welcome Channel ID:"}),e.jsx("input",{id:"welcomeChannel",type:"text",name:"welcomeChannel",value:r.welcomeChannel,onChange:s,placeholder:"Enter Channel ID",disabled:n}),e.jsx("small",{children:"Channel for welcome messages"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"registrationChannel",children:"Registration Channel ID:"}),e.jsx("input",{id:"registrationChannel",type:"text",name:"registrationChannel",value:r.registrationChannel,onChange:s,placeholder:"Enter Channel ID",disabled:n}),e.jsx("small",{children:"Default channel for scrim registrations"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"resultsChannel",children:"Results Channel ID:"}),e.jsx("input",{id:"resultsChannel",type:"text",name:"resultsChannel",value:r.resultsChannel,onChange:s,placeholder:"Enter Channel ID",disabled:n}),e.jsx("small",{children:"Channel where scrim results will be posted"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"notificationChannel",children:"Notification Channel ID:"}),e.jsx("input",{id:"notificationChannel",type:"text",name:"notificationChannel",value:r.notificationChannel,onChange:s,placeholder:"Enter Channel ID",disabled:n}),e.jsx("small",{children:"Channel for scrim notifications"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"banChannel",children:"Ban Channel ID:"}),e.jsx("input",{id:"banChannel",type:"text",name:"banChannel",value:r.banChannel,onChange:s,placeholder:"Enter Channel ID",disabled:n}),e.jsx("small",{children:"Channel for ban notifications"})]})]})]}),e.jsx("div",{className:"form-actions",children:e.jsx("button",{type:"submit",disabled:n,className:"save-button",children:n?"Saving...":"Save Configuration"})})]}),e.jsx("style",{jsx:!0,children:`
        .role-channel-config {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .error-message {
          color: #f04747;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
        
        .success-message {
          color: #43b581;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #e6ffec;
          border: 1px solid #b4e6c4;
          border-radius: 4px;
        }
        
        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        @media (max-width: 768px) {
          .config-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .config-section {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h4 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #7289da;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        
        small {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
        }
        
        .form-actions {
          margin-top: 20px;
          text-align: right;
        }
        
        .save-button {
          background-color: #7289da;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        }
        
        .save-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
      `})]})},nt=({children:t})=>e.jsxs("section",{className:"admin-dashboard",children:[e.jsx("h2",{children:"Admin Dashboard"}),e.jsx("p",{children:"Welcome, Admin! Manage your bot settings here."}),e.jsx(je,{}),t,e.jsx(ye,{})," "]}),it=({type:t,serverId:r})=>{const[l,n]=u.useState([]),[m,p]=u.useState("style_a"),[x,k]=u.useState(t==="slots"?"scrim":"top_10"),[c,s]=u.useState({fontColor:"#ffffff",backgroundColor:"#121212",borderColor:"#7289da",logoUrl:"",customText:""}),[o,y]=u.useState(!1),[w,I]=u.useState(null),[A,P]=u.useState(null),T=t==="slots"?[{value:"scrim",label:"Regular Scrim"},{value:"pro_scrim",label:"Pro Scrim"},{value:"girls_scrim",label:"Girls Scrim"}]:[{value:"top_8",label:"Top 8 Teams"},{value:"top_10",label:"Top 10 Teams"},{value:"overall",label:"Overall Standings"},{value:"girls",label:"Girls Leaderboard"}];u.useEffect(()=>{(async()=>{if(r){y(!0),I(null);try{const j=t==="slots"?await z.getSlotTemplates(r):await z.getLeaderboardTemplates(r);n(j),j.savedTemplate&&(p(j.savedTemplate.style),k(j.savedTemplate.category),s(j.savedTemplate.customization)),j.previewUrl&&P(j.previewUrl)}catch(j){console.error("Failed to fetch templates:",j),I(`Failed to load templates: ${j.message}`)}finally{y(!1)}}})()},[r,t]);const a=async()=>{if(!r){alert("Please select a server first");return}y(!0),I(null);try{const g={category:x,style:m,customization:c},j=t==="slots"?await z.saveSlotTemplate(r,g):await z.saveLeaderboardTemplate(r,g);j.previewUrl&&P(j.previewUrl),alert(`${t.charAt(0).toUpperCase()+t.slice(1)} template saved successfully!`)}catch(g){console.error(`Failed to save ${t} template:`,g),I(`Failed to save: ${g.message}`)}finally{y(!1)}},f=g=>{const j=g.target.files[0];if(!j)return;const i=URL.createObjectURL(j);s({...c,logoUrl:i})};return e.jsxs("section",{className:`visual-editor visual-editor-${t}`,children:[e.jsxs("h3",{children:["Visual Editor: ",t.charAt(0).toUpperCase()+t.slice(1)]}),w&&e.jsx("div",{className:"error-message",children:w}),e.jsxs("div",{className:"editor-grid",children:[e.jsxs("div",{className:"editor-controls",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Category:"}),e.jsx("select",{value:x,onChange:g=>k(g.target.value),disabled:o,children:T.map(g=>e.jsx("option",{value:g.value,children:g.label},g.value))})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Template Style:"}),e.jsxs("select",{value:m,onChange:g=>p(g.target.value),disabled:o,children:[e.jsx("option",{value:"style_a",children:"Style A"}),e.jsx("option",{value:"style_b",children:"Style B"})]})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Font Color:"}),e.jsx("input",{type:"color",value:c.fontColor,onChange:g=>s({...c,fontColor:g.target.value}),disabled:o})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Background Color:"}),e.jsx("input",{type:"color",value:c.backgroundColor,onChange:g=>s({...c,backgroundColor:g.target.value}),disabled:o})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Border Color:"}),e.jsx("input",{type:"color",value:c.borderColor,onChange:g=>s({...c,borderColor:g.target.value}),disabled:o})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Custom Logo:"}),e.jsx("input",{type:"file",accept:"image/*",onChange:f,disabled:o}),c.logoUrl&&e.jsx("div",{className:"logo-preview",children:e.jsx("img",{src:c.logoUrl,alt:"Logo Preview",style:{maxWidth:"100px",maxHeight:"100px"}})})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Custom Text:"}),e.jsx("textarea",{value:c.customText,onChange:g=>s({...c,customText:g.target.value}),placeholder:`Custom text for ${t}`,rows:3,disabled:o})]}),e.jsx("button",{onClick:a,disabled:o,className:"save-button",children:o?"Saving...":`Save ${t.charAt(0).toUpperCase()+t.slice(1)} Configuration`})]}),e.jsxs("div",{className:"preview-area",children:[e.jsx("h4",{children:"Preview"}),A?e.jsx("img",{src:A,alt:`${t} preview`,style:{maxWidth:"100%"}}):e.jsxs("div",{className:"preview-placeholder",children:[e.jsx("p",{children:"Preview will appear here after saving"}),e.jsxs("div",{className:"preview-mock",style:{backgroundColor:c.backgroundColor,color:c.fontColor,border:`2px solid ${c.borderColor}`,padding:"20px",borderRadius:"8px",textAlign:"center"},children:[e.jsxs("p",{children:["Sample ",t," preview with your colors"]}),c.customText&&e.jsx("p",{children:c.customText}),c.logoUrl&&e.jsx("img",{src:c.logoUrl,alt:"Logo",style:{maxWidth:"50px",maxHeight:"50px",margin:"10px auto"}})]})]})]})]}),e.jsx("style",{jsx:!0,children:`
        .editor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .control-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        select, input, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .save-button {
          background-color: #7289da;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .save-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
        
        .preview-area {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background-color: #f9f9f9;
        }
        
        .preview-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }
        
        .error-message {
          color: red;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
      `})]})},ot=({type:t,serverId:r})=>{const l=u.useRef(null),[n,m]=u.useState([]),[p,x]=u.useState("custom"),[k,c]=u.useState(t==="slots"?"scrim":"top_10"),[s,o]=u.useState(!1),[y,w]=u.useState(null),[I,A]=u.useState(""),[P,T]=u.useState([{id:"background",type:"rectangle",x:0,y:0,width:800,height:400,fill:"#121212",isBackground:!0},{id:"title",type:"text",x:400,y:50,text:t==="slots"?"Scrim Slots":"Leaderboard",font:"30px Arial",fill:"#ffffff",textAlign:"center"},{id:"logo",type:"image",x:50,y:50,width:100,height:100,src:"",visible:!1}]),[a,f]=u.useState(null),[g,j]=u.useState(!1),[i,v]=u.useState({x:0,y:0}),B=[{id:"solid",name:"Solid Color",preview:"#121212"},{id:"gradient1",name:"Blue Gradient",preview:"linear-gradient(135deg, #1e3c72, #2a5298)"},{id:"gradient2",name:"Purple Gradient",preview:"linear-gradient(135deg, #4b6cb7, #182848)"},{id:"gradient3",name:"Dark Gradient",preview:"linear-gradient(135deg, #232526, #414345)"},{id:"pattern1",name:"Hexagon Pattern",preview:"url(https://www.transparenttextures.com/patterns/hexellence.png)"}],_=t==="slots"?[{value:"scrim",label:"Regular Scrim"},{value:"pro_scrim",label:"Pro Scrim"},{value:"girls_scrim",label:"Girls Scrim"}]:[{value:"top_8",label:"Top 8 Teams"},{value:"top_10",label:"Top 10 Teams"},{value:"overall",label:"Overall Standings"},{value:"girls",label:"Girls Leaderboard"}];u.useEffect(()=>{(async()=>{if(r){o(!0),w(null);try{const b=t==="slots"?await z.getSlotTemplates(r):await z.getLeaderboardTemplates(r);m(b),b.savedTemplate&&(x(b.savedTemplate.style),c(b.savedTemplate.category),b.savedTemplate.canvasElements&&T(b.savedTemplate.canvasElements))}catch(b){console.error("Failed to fetch templates:",b),w(`Failed to load templates: ${b.message}`)}finally{o(!1)}}})()},[r,t]),u.useEffect(()=>{const d=l.current;if(!d)return;const b=d.getContext("2d");b.clearRect(0,0,d.width,d.height),P.forEach(h=>{if(!(!h.visible&&h.visible!==void 0)){switch(h.type){case"rectangle":b.fillStyle=h.fill,b.fillRect(h.x,h.y,h.width,h.height),h.stroke&&(b.strokeStyle=h.stroke,b.lineWidth=h.strokeWidth||2,b.strokeRect(h.x,h.y,h.width,h.height));break;case"text":b.font=h.font,b.fillStyle=h.fill,b.textAlign=h.textAlign||"left",b.textBaseline=h.textBaseline||"top",b.fillText(h.text,h.x,h.y);break;case"image":if(h.src){const D=new Image;D.src=h.src,D.onload=()=>{b.drawImage(D,h.x,h.y,h.width,h.height)}}break}a&&a.id===h.id&&(b.strokeStyle="#00a8ff",b.lineWidth=2,b.setLineDash([5,5]),b.strokeRect(h.x-5,h.y-5,h.width+10,h.height+10),b.setLineDash([]))}})},[P,a]);const $=d=>{const h=l.current.getBoundingClientRect(),D=d.clientX-h.left,R=d.clientY-h.top;for(let M=P.length-1;M>=0;M--){const L=P[M];if(!L.isBackground&&D>=L.x&&D<=L.x+L.width&&R>=L.y&&R<=L.y+L.height){f(L),j(!0),v({x:D,y:R});return}}f(null)},we=d=>{if(!g||!a)return;const h=l.current.getBoundingClientRect(),D=d.clientX-h.left,R=d.clientY-h.top,M=D-i.x,L=R-i.y,V=P.map(W=>W.id===a.id?{...W,x:W.x+M,y:W.y+L}:W);T(V),v({x:D,y:R});const q=V.find(W=>W.id===a.id);f(q)},ae=()=>{j(!1)},H=d=>{const b=`${d}_${Date.now()}`;let h;switch(d){case"text":h={id:b,type:"text",x:200,y:200,width:200,height:30,text:"New Text",font:"20px Arial",fill:"#ffffff",textAlign:"left"};break;case"rectangle":h={id:b,type:"rectangle",x:200,y:200,width:100,height:100,fill:"#7289da",stroke:"#ffffff",strokeWidth:2};break;case"image":const D=document.createElement("input");D.type="file",D.accept="image/*",D.onchange=R=>{const M=R.target.files[0];if(M){const L=new FileReader;L.onload=V=>{const q={id:b,type:"image",x:200,y:200,width:100,height:100,src:V.target.result,visible:!0};T([...P,q]),f(q)},L.readAsDataURL(M)}},D.click();return;default:return}T([...P,h]),f(h)},F=(d,b)=>{if(!a)return;const h=P.map(R=>R.id===a.id?{...R,[d]:b}:R);T(h);const D=h.find(R=>R.id===a.id);f(D)},Ce=()=>{if(!a||a.isBackground)return;const d=P.filter(b=>b.id!==a.id);T(d),f(null)},Se=d=>{const b=B.find(D=>D.id===d);if(!b)return;const h=P.map(D=>D.isBackground?{...D,fill:b.preview}:D);T(h)},Ne=async()=>{if(!r){alert("Please select a server first");return}o(!0),w(null);try{const b=l.current.toDataURL("image/png"),h={category:k,style:p,canvasElements:P,previewUrl:b},D=t==="slots"?await z.saveSlotTemplate(r,h):await z.saveLeaderboardTemplate(r,h);A(`${t.charAt(0).toUpperCase()+t.slice(1)} template saved successfully!`),setTimeout(()=>A(""),3e3)}catch(d){console.error(`Failed to save ${t} template:`,d),w(`Failed to save: ${d.message}`)}finally{o(!1)}};return e.jsxs("section",{className:`canvas-visual-editor canvas-visual-editor-${t}`,children:[e.jsxs("h3",{children:["Canvas Visual Editor: ",t.charAt(0).toUpperCase()+t.slice(1)]}),y&&e.jsx("div",{className:"error-message",children:y}),I&&e.jsx("div",{className:"success-message",children:I}),e.jsxs("div",{className:"editor-grid",children:[e.jsxs("div",{className:"editor-controls",children:[e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Category:"}),e.jsx("select",{value:k,onChange:d=>c(d.target.value),disabled:s,children:_.map(d=>e.jsx("option",{value:d.value,children:d.label},d.value))})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Background:"}),e.jsx("div",{className:"background-options",children:B.map(d=>e.jsx("div",{className:"background-option",style:{background:d.preview},onClick:()=>Se(d.id),title:d.name},d.id))})]}),e.jsxs("div",{className:"control-group",children:[e.jsx("label",{children:"Add Elements:"}),e.jsxs("div",{className:"element-buttons",children:[e.jsx("button",{onClick:()=>H("text"),disabled:s,children:"Add Text"}),e.jsx("button",{onClick:()=>H("rectangle"),disabled:s,children:"Add Shape"}),e.jsx("button",{onClick:()=>H("image"),disabled:s,children:"Add Image"})]})]}),a&&e.jsxs("div",{className:"element-properties",children:[e.jsx("h4",{children:"Element Properties"}),a.type==="text"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Text:"}),e.jsx("input",{type:"text",value:a.text,onChange:d=>F("text",d.target.value)})]}),e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Font Size:"}),e.jsx("select",{value:a.font.split("px")[0],onChange:d=>F("font",`${d.target.value}px Arial`),children:[12,14,16,18,20,24,30,36,48].map(d=>e.jsxs("option",{value:d,children:[d,"px"]},d))})]}),e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Color:"}),e.jsx("input",{type:"color",value:a.fill,onChange:d=>F("fill",d.target.value)})]}),e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Alignment:"}),e.jsxs("select",{value:a.textAlign,onChange:d=>F("textAlign",d.target.value),children:[e.jsx("option",{value:"left",children:"Left"}),e.jsx("option",{value:"center",children:"Center"}),e.jsx("option",{value:"right",children:"Right"})]})]})]}),a.type==="rectangle"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Fill Color:"}),e.jsx("input",{type:"color",value:a.fill,onChange:d=>F("fill",d.target.value)})]}),e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Border Color:"}),e.jsx("input",{type:"color",value:a.stroke||"#ffffff",onChange:d=>F("stroke",d.target.value)})]}),e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Width:"}),e.jsx("input",{type:"number",value:a.width,onChange:d=>F("width",parseInt(d.target.value)),min:"10",max:"800"})]}),e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Height:"}),e.jsx("input",{type:"number",value:a.height,onChange:d=>F("height",parseInt(d.target.value)),min:"10",max:"400"})]})]}),a.type==="image"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Width:"}),e.jsx("input",{type:"number",value:a.width,onChange:d=>F("width",parseInt(d.target.value)),min:"10",max:"800"})]}),e.jsxs("div",{className:"property",children:[e.jsx("label",{children:"Height:"}),e.jsx("input",{type:"number",value:a.height,onChange:d=>F("height",parseInt(d.target.value)),min:"10",max:"400"})]}),e.jsx("div",{className:"property",children:e.jsx("button",{onClick:()=>H("image"),children:"Change Image"})})]}),e.jsx("div",{className:"property",children:e.jsx("button",{className:"delete-button",onClick:Ce,disabled:a.isBackground,children:"Delete Element"})})]}),e.jsx("button",{onClick:Ne,disabled:s,className:"save-button",children:s?"Saving...":`Save ${t.charAt(0).toUpperCase()+t.slice(1)} Template`})]}),e.jsxs("div",{className:"canvas-container",children:[e.jsx("canvas",{ref:l,width:"800",height:"400",onMouseDown:$,onMouseMove:we,onMouseUp:ae,onMouseLeave:ae}),e.jsx("div",{className:"canvas-instructions",children:e.jsx("p",{children:"Click and drag elements to position them. Select an element to edit its properties."})})]})]}),e.jsx("style",{jsx:!0,children:`
        .editor-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .control-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        select, input, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .background-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        
        .background-option {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }
        
        .background-option:hover {
          border-color: #7289da;
        }
        
        .element-buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        
        .element-buttons button {
          flex: 1;
          padding: 8px;
          background-color: #7289da;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .element-properties {
          margin-top: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .property {
          margin-bottom: 10px;
        }
        
        .delete-button {
          width: 100%;
          padding: 8px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .delete-button:disabled {
          background-color: #e57373;
          cursor: not-allowed;
        }
        
        .canvas-container {
          position: relative;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background-color: #f0f0f0;
        }
        
        canvas {
          display: block;
          background-color: #fff;
          cursor: pointer;
        }
        
        .canvas-instructions {
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          font-size: 12px;
          text-align: center;
        }
        
        .save-button {
          background-color: #7289da;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 20px;
          width: 100%;
        }
        
        .save-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
        
        .error-message {
          color: red;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
        
        .success-message {
          color: green;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #eeffee;
          border: 1px solid #ccffcc;
          border-radius: 4px;
        }
      `})]})},re=ke({palette:{mode:"dark",primary:{main:"#5865F2",light:"#7983F5",dark:"#4752C4",contrastText:"#ffffff"},secondary:{main:"#2D7D46",light:"#3BA55C",dark:"#1F5F34",contrastText:"#ffffff"},error:{main:"#ED4245",light:"#F06669",dark:"#CB383B"},warning:{main:"#FAA61A",light:"#FBB746",dark:"#E09016"},info:{main:"#5865F2",light:"#7983F5",dark:"#4752C4"},success:{main:"#3BA55C",light:"#57B574",dark:"#2D7D46"},background:{default:"#36393F",paper:"#2F3136",sidebar:"#202225",hover:"#40444B",active:"#4F545C"},text:{primary:"#DCDDDE",secondary:"#B9BBBE",disabled:"#72767D"},divider:"rgba(79, 84, 92, 0.48)"},typography:{fontFamily:'"Whitney", "Helvetica Neue", Helvetica, Arial, sans-serif',h1:{fontWeight:700,fontSize:"2rem"},h2:{fontWeight:600,fontSize:"1.5rem"},h3:{fontWeight:600,fontSize:"1.25rem"},h4:{fontWeight:500,fontSize:"1.125rem"},h5:{fontWeight:500,fontSize:"1rem"},h6:{fontWeight:500,fontSize:"0.875rem"},body1:{fontSize:"0.875rem"},body2:{fontSize:"0.75rem"},button:{textTransform:"none",fontWeight:500}},shape:{borderRadius:8},components:{MuiButton:{styleOverrides:{root:{borderRadius:4,textTransform:"none",fontWeight:500,padding:"8px 16px"},containedPrimary:{"&:hover":{backgroundColor:"#4752C4"}}}},MuiPaper:{styleOverrides:{root:{backgroundImage:"none"}}},MuiAppBar:{styleOverrides:{root:{backgroundColor:"#202225",boxShadow:"none"}}},MuiDrawer:{styleOverrides:{paper:{backgroundColor:"#202225",borderRight:"none"}}},MuiListItem:{styleOverrides:{root:{borderRadius:4,"&.Mui-selected":{backgroundColor:"rgba(79, 84, 92, 0.32)","&:hover":{backgroundColor:"rgba(79, 84, 92, 0.48)"}}}}},MuiCard:{styleOverrides:{root:{backgroundColor:"#2F3136",borderRadius:8,boxShadow:"0px 2px 10px rgba(0, 0, 0, 0.2)"}}},MuiTextField:{styleOverrides:{root:{"& .MuiOutlinedInput-root":{"& fieldset":{borderColor:"rgba(79, 84, 92, 0.48)"},"&:hover fieldset":{borderColor:"#B9BBBE"},"&.Mui-focused fieldset":{borderColor:"#5865F2"}}}}}}}),Z=240,ue=t=>({width:Z,transition:t.transitions.create("width",{easing:t.transitions.easing.sharp,duration:t.transitions.duration.enteringScreen}),overflowX:"hidden",backgroundColor:t.palette.background.sidebar}),he=t=>({transition:t.transitions.create("width",{easing:t.transitions.easing.sharp,duration:t.transitions.duration.leavingScreen}),overflowX:"hidden",width:`calc(${t.spacing(7)} + 1px)`,[t.breakpoints.up("sm")]:{width:`calc(${t.spacing(8)} + 1px)`},backgroundColor:t.palette.background.sidebar}),pe=ee("div")(({theme:t})=>({display:"flex",alignItems:"center",justifyContent:"flex-end",padding:t.spacing(0,1),...t.mixins.toolbar})),lt=ee(Te,{shouldForwardProp:t=>t!=="open"})(({theme:t,open:r})=>({zIndex:t.zIndex.drawer+1,transition:t.transitions.create(["width","margin"],{easing:t.transitions.easing.sharp,duration:t.transitions.duration.leavingScreen}),...r&&{marginLeft:Z,width:`calc(100% - ${Z}px)`,transition:t.transitions.create(["width","margin"],{easing:t.transitions.easing.sharp,duration:t.transitions.duration.enteringScreen})}})),ct=ee(De,{shouldForwardProp:t=>t!=="open"})(({theme:t,open:r})=>({width:Z,flexShrink:0,whiteSpace:"nowrap",boxSizing:"border-box",...r&&{...ue(t),"& .MuiDrawer-paper":ue(t)},...!r&&{...he(t),"& .MuiDrawer-paper":he(t)}})),dt=ee(O)(({theme:t})=>({flexGrow:1,padding:t.spacing(3),backgroundColor:t.palette.background.default,minHeight:"100vh",overflow:"auto"})),ut=[{text:"Dashboard",icon:e.jsx(Oe,{}),path:"/"},{text:"User Stats",icon:e.jsx(_e,{}),path:"/stats"},{text:"Profile Store",icon:e.jsx(We,{}),path:"/store"},{text:"Leaderboard",icon:e.jsx(Ge,{}),path:"/leaderboard"},{text:"Settings",icon:e.jsx(Je,{}),path:"/settings"}],ht=({children:t,userProfile:r,servers:l=[],selectedServer:n,onServerSelect:m,onLogout:p})=>{const[x,k]=u.useState(!0),[c,s]=u.useState(null),o=ge(),y=xe(),w=Pe(re.breakpoints.down("md"));fe.useEffect(()=>{w&&k(!1)},[w]);const I=()=>{k(!x)},A=a=>{s(a.currentTarget)},P=()=>{s(null)},T=a=>{o(a),w&&k(!1)};return e.jsx(me,{theme:re,children:e.jsxs(O,{sx:{display:"flex"},children:[e.jsx(lt,{position:"fixed",open:x,children:e.jsxs(Ie,{children:[e.jsx(Y,{color:"inherit","aria-label":"toggle drawer",onClick:I,edge:"start",sx:{marginRight:5,...x&&{display:"none"}},children:e.jsx($e,{})}),e.jsxs(E,{variant:"h6",noWrap:!0,component:"div",sx:{flexGrow:1},children:["DraftBot Dashboard ",n&&`- ${n.name}`]}),e.jsx(Y,{color:"inherit",size:"large",children:e.jsx(Ae,{})}),e.jsx(Ee,{title:"Account settings",children:e.jsx(Y,{onClick:A,size:"large",edge:"end",color:"inherit","aria-label":"account of current user","aria-haspopup":"true",children:e.jsx(se,{alt:(r==null?void 0:r.username)||"User",src:(r==null?void 0:r.avatar)||"/avatar.png",sx:{width:32,height:32}})})}),e.jsxs(Re,{anchorEl:c,open:!!c,onClose:P,PaperProps:{elevation:0,sx:{overflow:"visible",filter:"drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",mt:1.5,"& .MuiAvatar-root":{width:32,height:32,ml:-.5,mr:1}}},transformOrigin:{horizontal:"right",vertical:"top"},anchorOrigin:{horizontal:"right",vertical:"bottom"},children:[e.jsxs(ne,{onClick:()=>T("/profile"),children:[e.jsx(se,{})," My Profile"]}),e.jsx(ie,{}),e.jsxs(ne,{onClick:p,children:[e.jsx(oe,{children:e.jsx(Be,{fontSize:"small"})}),"Logout"]})]})]})}),e.jsxs(ct,{variant:"permanent",open:x,children:[e.jsx(pe,{children:e.jsxs(O,{sx:{display:"flex",alignItems:"center",width:"100%",justifyContent:x?"space-between":"center",px:2},children:[x&&e.jsx(E,{variant:"h6",component:"div",sx:{fontWeight:"bold",color:"primary.main"},children:"DraftBot"}),e.jsx(Y,{onClick:I,children:e.jsx(Le,{})})]})}),e.jsx(ie,{}),e.jsx(Fe,{children:ut.map(a=>{const f=y.pathname===a.path;return e.jsx(Ue,{disablePadding:!0,sx:{display:"block"},children:e.jsxs(ze,{sx:{minHeight:48,justifyContent:x?"initial":"center",px:2.5,backgroundColor:f?"background.active":"transparent","&:hover":{backgroundColor:"background.hover"},borderLeft:f?"3px solid":"3px solid transparent",borderColor:f?"primary.main":"transparent"},onClick:()=>T(a.path),children:[e.jsx(oe,{sx:{minWidth:0,mr:x?3:"auto",justifyContent:"center",color:f?"primary.main":"text.primary"},children:a.icon}),e.jsx(Me,{primary:a.text,sx:{opacity:x?1:0},primaryTypographyProps:{fontWeight:f?"bold":"normal"}})]})},a.text)})})]}),e.jsxs(dt,{component:"main",children:[e.jsx(pe,{}),t]})]})})};function pt(){const[t,r]=u.useState({username:"User123",avatar:"https://via.placeholder.com/100x100.png?text=Avatar",banner:"https://via.placeholder.com/728x90.png?text=Banner",info:"This is a sample user profile."}),[l,n]=u.useState(!1),[m,p]=u.useState(!0),[x,k]=u.useState(null),[c,s]=u.useState([]),[o,y]=u.useState(null),[w,I]=u.useState(!1),A=ge();xe(),u.useEffect(()=>{(async()=>{try{const i=await te.getProfile();r({username:i.username,avatar:i.avatar||"https://via.placeholder.com/100x100.png?text=Avatar",banner:i.banner||"https://via.placeholder.com/728x90.png?text=Banner",info:i.info||"No information provided."}),n(!0);const v=await te.getServers();s(v),v&&v.length>0&&(y(v[0]),I(v[0].isAdmin))}catch(i){console.error("Authentication check failed:",i),n(!1)}finally{p(!1)}})()},[]);const P=j=>{y(j),I(j.isAdmin)},T=async j=>{r(j),alert("Profile updated successfully!")},a=()=>{window.location.href="/api/auth/discord"},f=async()=>{try{await te.logout(),r({username:"User123",avatar:"https://via.placeholder.com/100x100.png?text=Avatar",banner:"https://via.placeholder.com/728x90.png?text=Banner",info:"This is a sample user profile."}),n(!1),s([]),y(null),I(!1),A("/")}catch(j){console.error("Logout failed:",j),k("Failed to logout. Please try again.")}};if(m)return e.jsxs(O,{sx:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",bgcolor:"background.default"},children:[e.jsx(He,{size:60}),e.jsx(E,{variant:"h6",sx:{mt:2},children:"Loading DraftBot Dashboard..."})]});if(!l)return e.jsx(O,{sx:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",bgcolor:"background.default",p:3},children:e.jsxs(G,{elevation:3,sx:{p:4,display:"flex",flexDirection:"column",alignItems:"center",maxWidth:500,width:"100%",borderRadius:2,bgcolor:"background.paper"},children:[e.jsx(E,{variant:"h4",component:"h1",gutterBottom:!0,children:"DraftBot Dashboard"}),e.jsx(E,{variant:"body1",sx:{mb:3,textAlign:"center"},children:"Manage your Discord server with our powerful dashboard"}),x&&e.jsx(Ve,{severity:"error",sx:{mb:3,width:"100%"},children:x}),e.jsx(le,{variant:"contained",color:"primary",size:"large",onClick:a,sx:{py:1.5,px:4,borderRadius:2,fontWeight:"bold",fontSize:"1rem"},children:"Login with Discord"})]})});const g=()=>e.jsx(O,{sx:{p:3},children:e.jsxs(G,{sx:{p:3,mb:3},children:[e.jsx(E,{variant:"h5",gutterBottom:!0,children:"No Server Selected"}),e.jsx(E,{variant:"body1",children:"Please select a server from the list to manage it."}),c.length===0&&e.jsxs(O,{sx:{mt:3},children:[e.jsx(E,{variant:"h6",children:"No Servers Available"}),e.jsx(E,{variant:"body2",sx:{mb:2},children:"You don't have any servers with the bot installed. Please add the bot to your Discord server first."}),e.jsx(le,{variant:"contained",color:"primary",href:"https://discord.com/api/oauth2/authorize?client_id=298213177756352523&permissions=8&scope=bot%20applications.commands",target:"_blank",rel:"noopener noreferrer",children:"Add Bot to Server"})]})]})});return e.jsx(ht,{userProfile:t,servers:c,selectedServer:o,onServerSelect:P,onLogout:f,children:e.jsxs(be,{children:[e.jsx(U,{path:"/",element:o?e.jsxs(O,{children:[e.jsxs(E,{variant:"h4",component:"h1",gutterBottom:!0,children:["Welcome to ",o.name," Dashboard"]}),e.jsxs(J,{container:!0,spacing:3,children:[e.jsx(J,{item:!0,xs:12,md:6,children:e.jsxs(G,{sx:{p:3,height:"100%"},children:[e.jsx(E,{variant:"h6",gutterBottom:!0,children:"Profile"}),e.jsx(ve,{profile:t})]})}),e.jsx(J,{item:!0,xs:12,md:6,children:e.jsxs(G,{sx:{p:3,height:"100%"},children:[e.jsx(E,{variant:"h6",gutterBottom:!0,children:"Daily Rewards"}),e.jsx(tt,{})]})}),e.jsx(J,{item:!0,xs:12,md:6,children:e.jsxs(G,{sx:{p:3,height:"100%"},children:[e.jsx(E,{variant:"h6",gutterBottom:!0,children:"User Stats"}),e.jsx(Ze,{serverId:o==null?void 0:o.id})]})}),e.jsx(J,{item:!0,xs:12,md:6,children:e.jsxs(G,{sx:{p:3,height:"100%"},children:[e.jsx(E,{variant:"h6",gutterBottom:!0,children:"Ad Rewards"}),e.jsx(et,{})]})})]})]}):e.jsx(g,{})}),e.jsx(U,{path:"/store",element:e.jsx(st,{userId:t.username})}),e.jsx(U,{path:"/leaderboard",element:e.jsx(rt,{serverId:o==null?void 0:o.id})}),e.jsx(U,{path:"/admin",element:w?e.jsx(nt,{server:o}):e.jsx(E,{variant:"h5",children:"Access Denied"})}),e.jsx(U,{path:"/canvas-editor",element:e.jsx(ot,{userProfile:t})}),e.jsx(U,{path:"/profile",element:e.jsx(at,{profile:t,onSave:T})}),e.jsx(U,{path:"/scrims",element:e.jsx(je,{server:o})}),e.jsx(U,{path:"/roles",element:e.jsx(ye,{server:o})}),e.jsx(U,{path:"/visual-editor",element:e.jsx(it,{userProfile:t})})]})})}const mt="/";Qe.createRoot(document.getElementById("root")).render(e.jsx(fe.StrictMode,{children:e.jsxs(me,{theme:re,children:[e.jsx(qe,{}),e.jsx(Xe,{basename:mt,children:e.jsx(be,{children:e.jsx(U,{path:"/*",element:e.jsx(pt,{})})})})]})}));
