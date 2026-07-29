var wt=Object.defineProperty;var At=(n,t,e)=>t in n?wt(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var u=(n,t,e)=>At(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R=globalThis,X=R.ShadowRoot&&(R.ShadyCSS===void 0||R.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,dt=Symbol(),Y=new WeakMap;let xt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==dt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(X&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Y.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Y.set(e,t))}return t}toString(){return this.cssText}};const E=n=>new xt(typeof n=="string"?n:n+"",void 0,dt),Et=(n,t)=>{if(X)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=R.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},tt=X?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return E(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:St,defineProperty:Ct,getOwnPropertyDescriptor:kt,getOwnPropertyNames:Pt,getOwnPropertySymbols:Mt,getPrototypeOf:Tt}=Object,m=globalThis,et=m.trustedTypes,Ot=et?et.emptyScript:"",z=m.reactiveElementPolyfillSupport,M=(n,t)=>n,W={toAttribute(n,t){switch(t){case Boolean:n=n?Ot:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},pt=(n,t)=>!St(n,t),st={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:pt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),m.litPropertyMetadata??(m.litPropertyMetadata=new WeakMap);let S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=st){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ct(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=kt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const c=i==null?void 0:i.call(this);r==null||r.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??st}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;const t=Tt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){const e=this.properties,s=[...Pt(e),...Mt(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(tt(i))}else t!==void 0&&e.push(tt(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Et(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var r;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:W).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var r,o;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const c=s.getPropertyOptions(i),l=typeof c.converter=="function"?{fromAttribute:c.converter}:((r=c.converter)==null?void 0:r.fromAttribute)!==void 0?c.converter:W;this._$Em=i;const h=l.fromAttribute(e,c.type);this[i]=h??((o=this._$Ej)==null?void 0:o.get(i))??h,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){var o;if(t!==void 0){const c=this.constructor;if(i===!1&&(r=this[t]),s??(s=c.getPropertyOptions(t)),!((s.hasChanged??pt)(r,e)||s.useDefault&&s.reflect&&r===((o=this._$Ej)==null?void 0:o.get(t))&&!this.hasAttribute(c._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i){const{wrapped:c}=o,l=this[r];c!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[M("elementProperties")]=new Map,S[M("finalized")]=new Map,z==null||z({ReactiveElement:S}),(m.reactiveElementVersions??(m.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const T=globalThis,it=n=>n,j=T.trustedTypes,nt=j?j.createPolicy("lit-html",{createHTML:n=>n}):void 0,ut="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+v,Ut=`<${$t}>`,x=document,O=()=>x.createComment(""),U=n=>n===null||typeof n!="object"&&typeof n!="function",Q=Array.isArray,It=n=>Q(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",B=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rt=/-->/g,ot=/>/g,b=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),lt=/'/g,ct=/"/g,ft=/^(?:script|style|textarea|title)$/i,Ht=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),_=Ht(1),y=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),at=new WeakMap,w=x.createTreeWalker(x,129);function gt(n,t){if(!Q(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return nt!==void 0?nt.createHTML(t):t}const Nt=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":t===3?"<math>":"",o=k;for(let c=0;c<e;c++){const l=n[c];let h,p,a=-1,f=0;for(;f<l.length&&(o.lastIndex=f,p=o.exec(l),p!==null);)f=o.lastIndex,o===k?p[1]==="!--"?o=rt:p[1]!==void 0?o=ot:p[2]!==void 0?(ft.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=b):p[3]!==void 0&&(o=b):o===b?p[0]===">"?(o=i??k,a=-1):p[1]===void 0?a=-2:(a=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?b:p[3]==='"'?ct:lt):o===ct||o===lt?o=b:o===rt||o===ot?o=k:(o=b,i=void 0);const g=o===b&&n[c+1].startsWith("/>")?" ":"";r+=o===k?l+Ut:a>=0?(s.push(h),l.slice(0,a)+ut+l.slice(a)+v+g):l+v+(a===-2?c:g)}return[gt(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class I{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const c=t.length-1,l=this.parts,[h,p]=Nt(t,e);if(this.el=I.createElement(h,s),w.currentNode=this.el.content,e===2||e===3){const a=this.el.content.firstChild;a.replaceWith(...a.childNodes)}for(;(i=w.nextNode())!==null&&l.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const a of i.getAttributeNames())if(a.endsWith(ut)){const f=p[o++],g=i.getAttribute(a).split(v),N=/([.?@])?(.*)/.exec(f);l.push({type:1,index:r,name:N[2],strings:g,ctor:N[1]==="."?jt:N[1]==="?"?Lt:N[1]==="@"?zt:L}),i.removeAttribute(a)}else a.startsWith(v)&&(l.push({type:6,index:r}),i.removeAttribute(a));if(ft.test(i.tagName)){const a=i.textContent.split(v),f=a.length-1;if(f>0){i.textContent=j?j.emptyScript:"";for(let g=0;g<f;g++)i.append(a[g],O()),w.nextNode(),l.push({type:2,index:++r});i.append(a[f],O())}}}else if(i.nodeType===8)if(i.data===$t)l.push({type:2,index:r});else{let a=-1;for(;(a=i.data.indexOf(v,a+1))!==-1;)l.push({type:7,index:r}),a+=v.length-1}r++}}static createElement(t,e){const s=x.createElement("template");return s.innerHTML=t,s}}function C(n,t,e=n,s){var o,c;if(t===y)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const r=U(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=C(n,i._$AS(n,t.values),i,s)),t}class Rt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??x).importNode(e,!0);w.currentNode=i;let r=w.nextNode(),o=0,c=0,l=s[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new H(r,r.nextSibling,this,t):l.type===1?h=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(h=new Bt(r,this,t)),this._$AV.push(h),l=s[++c]}o!==(l==null?void 0:l.index)&&(r=w.nextNode(),o++)}return w.currentNode=x,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class H{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),U(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==y&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):It(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){var r;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=I.createElement(gt(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(e);else{const o=new Rt(i,this),c=o.u(this.options);o.p(e),this.T(c),this._$AH=o}}_$AC(t){let e=at.get(t.strings);return e===void 0&&at.set(t.strings,e=new I(t)),e}k(t){Q(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new H(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){const i=it(t).nextSibling;it(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class L{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(r===void 0)t=C(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==y,o&&(this._$AH=t);else{const c=t;let l,h;for(t=r[0],l=0;l<r.length-1;l++)h=C(this,c[s+l],e,l),h===y&&(h=this._$AH[l]),o||(o=!U(h)||h!==this._$AH[l]),h===d?t=d:t!==d&&(t+=(h??"")+r[l+1]),this._$AH[l]=h}o&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class jt extends L{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}}class Lt extends L{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}}class zt extends L{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??d)===y)return;const s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Bt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}}const D=T.litHtmlPolyfillSupport;D==null||D(I,H),(T.litHtmlVersions??(T.litHtmlVersions=[])).push("3.3.3");const Dt=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new H(t.insertBefore(O(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const A=globalThis;let $=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Dt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return y}};var ht;$._$litElement$=!0,$.finalized=!0,(ht=A.litElementHydrateSupport)==null||ht.call(A,{LitElement:$});const V=A.litElementPolyfillSupport;V==null||V({LitElement:$});(A.litElementVersions??(A.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vt={ATTRIBUTE:1,CHILD:2},mt=n=>(...t)=>({_$litDirective$:n,values:t});class _t{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let q=class extends _t{constructor(t){if(super(t),this.it=d,t.type!==vt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===d||t==null)return this._t=void 0,this.it=t;if(t===y)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};q.directiveName="unsafeHTML",q.resultType=1;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Z extends q{}Z.directiveName="unsafeSVG",Z.resultType=2;const P=mt(Z),Vt=`<!-- @license lucide-static v0.400.0 - ISC -->
<svg
  class="lucide lucide-app-window"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect x="2" y="4" width="20" height="16" rx="2" />
  <path d="M10 4v4" />
  <path d="M2 8h20" />
  <path d="M6 4v4" />
</svg>
`,Wt=`<!-- @license lucide-static v0.400.0 - ISC -->
<svg
  class="lucide lucide-minus"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M5 12h14" />
</svg>
`,qt=`<!-- @license lucide-static v0.400.0 - ISC -->
<svg
  class="lucide lucide-square"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="18" height="18" x="3" y="3" rx="2" />
</svg>
`,Zt=`<!-- @license lucide-static v0.400.0 - ISC -->
<svg
  class="lucide lucide-x"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M18 6 6 18" />
  <path d="m6 6 12 12" />
</svg>
`;function Ft(n){return _`
    <div class="titlebar-left">
      <span class="titlebar-icon">${P(Vt)}</span>
      <span class="titlebar-title">${n.title}</span>
    </div>
    <div class="titlebar-controls">
      <button class="titlebar-btn" @click=${()=>n.handleMinimize()}>
        ${P(Wt)}
      </button>
      <button class="titlebar-btn" @click=${()=>n.handleMaximize()}>
        ${P(qt)}
      </button>
      <button
        class="titlebar-btn titlebar-btn-close"
        @click=${()=>n.handleClose()}
      >
        ${P(Zt)}
      </button>
    </div>
  `}const Gt=":host{display:flex;justify-content:space-between;align-items:center;height:32px;background:#252526;-webkit-app-region:drag;padding:0 8px}.titlebar-left{display:flex;align-items:center;gap:6px}.titlebar-controls{display:flex;-webkit-app-region:no-drag}.titlebar-btn{background:none;border:none;color:#ccc;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer}.titlebar-btn:hover{background:#3a3d41}.titlebar-btn-close:hover{background:#e81123}.titlebar-btn svg,.titlebar-icon svg{width:16px;height:16px}";class F extends ${constructor(){super(),this.title="IDE Workbench"}handleMinimize(){window.api.window.minimize()}handleMaximize(){window.api.window.maximize()}handleClose(){window.api.window.close()}render(){return Ft(this)}}u(F,"styles",E(Gt)),u(F,"properties",{title:{type:String}});customElements.define("workbench-titlebar",F);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jt=mt(class extends _t{constructor(n){var t;if(super(n),n.type!==vt.ATTRIBUTE||n.name!=="class"||((t=n.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(n){return" "+Object.keys(n).filter(t=>n[t]).join(" ")+" "}update(n,[t]){var s,i;if(this.st===void 0){this.st=new Set,n.strings!==void 0&&(this.nt=new Set(n.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(const r in t)t[r]&&!((s=this.nt)!=null&&s.has(r))&&this.st.add(r);return this.render(t)}const e=n.element.classList;for(const r of this.st)r in t||(e.remove(r),this.st.delete(r));for(const r in t){const o=!!t[r];o===this.st.has(r)||(i=this.nt)!=null&&i.has(r)||(o?(e.add(r),this.st.add(r)):(e.remove(r),this.st.delete(r)))}return y}}),Kt=`<!-- @license lucide-static v0.400.0 - ISC -->
<svg
  class="lucide lucide-files"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
  <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
  <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
</svg>
`,Xt=`<!-- @license lucide-static v0.400.0 - ISC -->
<svg
  class="lucide lucide-search"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <circle cx="11" cy="11" r="8" />
  <path d="m21 21-4.3-4.3" />
</svg>
`,Qt=`<!-- @license lucide-static v0.400.0 - ISC -->
<svg
  class="lucide lucide-git-branch"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <line x1="6" x2="6" y1="3" y2="15" />
  <circle cx="18" cy="6" r="3" />
  <circle cx="6" cy="18" r="3" />
  <path d="M18 9a9 9 0 0 1-9 9" />
</svg>
`,Yt=`<!-- @license lucide-static v0.400.0 - ISC -->
<svg
  class="lucide lucide-blocks"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <rect width="7" height="7" x="14" y="3" rx="1" />
  <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
</svg>
`,te=[{id:"explorer",icon:Kt},{id:"search",icon:Xt},{id:"git",icon:Qt},{id:"extensions",icon:Yt}];function ee(n){return _`
    ${te.map(t=>_`
        <button
          class=${Jt({"activitybar-icon":!0,active:n.activeId===t.id})}
          @click=${()=>n.handleIconClick(t.id)}
        >
          ${P(t.icon)}
        </button>
      `)}
  `}const se=":host{display:flex;flex-direction:column;width:48px;background:#333;align-items:center;padding-top:8px}.activitybar-icon{background:none;border:none;color:#858585;width:48px;height:48px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-left:2px solid transparent}.activitybar-icon:hover{color:#fff}.activitybar-icon.active{color:#fff;border-left:2px solid #007acc}.activitybar-icon svg{width:22px;height:22px}";class G extends ${constructor(){super(),this.activeId="explorer"}handleIconClick(t){this.activeId=t}render(){return ee(this)}}u(G,"styles",E(se)),u(G,"properties",{activeId:{type:String}});customElements.define("workbench-activitybar",G);function ie(n){return _`
    <div class="sidebar-title">EXPLORER</div>
    <ul class="sidebar-list">
      ${n.items.map(t=>_`<li>${t}</li>`)}
    </ul>
  `}const ne=":host{display:block;width:240px;background:#252526;color:#ccc;overflow-y:auto}.sidebar-title{padding:10px 12px;font-size:11px;font-weight:600;letter-spacing:.5px;color:#bbb}.sidebar-list{list-style:none;margin:0;padding:0 12px}.sidebar-list li{padding:4px 0;font-size:13px;cursor:pointer}.sidebar-list li:hover{color:#fff}";class J extends ${constructor(){super(),this.items=["electron-main/","workbench/","modules/","shared/","package.json"]}render(){return ie(this)}}u(J,"styles",E(ne)),u(J,"properties",{items:{type:Array}});customElements.define("workbench-sidebar",J);function re(){return _`<div id="editor-mount"></div>`}const oe=":host{display:block;flex:1;background:#1e1e1e}";class yt extends ${render(){return re()}}u(yt,"styles",E(oe));customElements.define("workbench-editor-group",yt);function le(){return _`<div id="panel-mount"></div>`}const ce=":host{display:block;height:200px;background:#1e1e1e;border-top:1px solid #333333}";class bt extends ${render(){return le()}}u(bt,"styles",E(ce));customElements.define("workbench-panel",bt);function ae(n){return _`
    <span>${n.branch}</span>
    <span>${n.encoding}</span>
    <span>${n.language}</span>
    <span class="statusbar-right">${n.cursorPosition}</span>
  `}const he=":host{display:flex;align-items:center;height:22px;background:#007acc;color:#fff;font-size:12px;padding:0 8px;gap:12px}.statusbar-right{margin-left:auto}";class K extends ${constructor(){super(),this.branch="main",this.encoding="UTF-8",this.language="JavaScript",this.cursorPosition="Ln 1, Col 1"}render(){return ae(this)}}u(K,"styles",E(he)),u(K,"properties",{branch:{type:String},encoding:{type:String},language:{type:String},cursorPosition:{type:String}});customElements.define("workbench-statusbar",K);function de(){initTitlebar(),renderActivitybar(),renderSidebar(),renderEditorGroup(),renderPanel(),renderStatusbar()}document.addEventListener("DOMContentLoaded",de);
