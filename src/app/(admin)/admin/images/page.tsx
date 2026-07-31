import type { Metadata } from "next";
import { headers } from "next/headers";
import { ImageImporter } from "@/components/admin/ImageImporter";
import { ImageManager } from "@/components/admin/ImageManager";
import { BrowserImageImporter } from "@/components/admin/BrowserImageImporter";
import { DetailsImporter } from "@/components/admin/DetailsImporter";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createImportToken } from "@/lib/import-token";

export const metadata: Metadata = { title: "Immagini" };

type Img = { url: string; alt: string };

interface Row {
  slug: string;
  title: string;
  images: Img[];
}

/** Bookmarklet: dalla pagina elenco di deuspower apre ogni scheda prodotto,
 *  legge TUTTE le foto della galleria nell'ordine del sito sorgente e le invia
 *  all'API. __API__ e __TOKEN__ vengono sostituiti a runtime. */
/** Bookmarklet: apre ogni scheda prodotto e importa la descrizione estesa dalla
 *  "Product Overview" fino alle FAQ (esclusi TAGS / prodotti correlati /
 *  recensioni) nel campo details_html del prodotto. */
const DETAILS_BOOKMARKLET = `javascript:(async()=>{try{var A="__API__",T="__TOKEN__";var RX=/image\\/(cache\\/)?catalog/i,BAD=/@logo|\\/logo\\/|payment|manufacturer|banner|blog/i;var seen={},P=[];[].slice.call(document.images).forEach(function(m){var s=m.getAttribute("data-src")||m.currentSrc||m.src||"";if(!RX.test(s)||BAD.test(s))return;var a=m.closest("a");if(!a||!a.href)return;var n=(m.getAttribute("alt")||a.getAttribute("title")||a.textContent||"").replace(/\\s+/g," ").trim();if(!n||/logo|payment|carrello|cart|wishlist/i.test(n))return;if(seen[a.href])return;seen[a.href]=1;P.push({n:n,u:a.href})});if(!P.length){alert("Nessun prodotto trovato. Apri 'Tutti i prodotti'.");return}function tx(e){return (e.textContent||"").replace(/\\s+/g," ").trim()}function ser(node){var o="";var ch=node.childNodes;for(var i=0;i<ch.length;i++){var c=ch[i];if(c.nodeType===3){o+=c.textContent}else if(c.nodeType===1){var t=c.tagName.toLowerCase();if(t==="script"||t==="style")continue;if(/^(h1|h2|h3|h4|p|ul|ol|li|strong|b|em)$/.test(t)){var tg=t==="h1"?"h2":t;o+="<"+tg+">"+ser(c)+"</"+tg+">"}else if(t==="br"){o+="<br>"}else{o+=ser(c)}}}return o}function block(b){var t=b.tagName.toLowerCase();if(t==="summary")t="h4";else if(t==="h1")t="h2";else if(t==="h5"||t==="h6")t="h4";if(/^(h2|h3|h4|p|ul|ol)$/.test(t))return "<"+t+">"+ser(b)+"</"+t+">";return ""}function grab(doc){var heads=[].slice.call(doc.querySelectorAll("h1,h2,h3,h4,strong,b")),start=null;for(var i=0;i<heads.length;i++){if(/product overview|panoramica del prodotto/i.test(tx(heads[i]))){start=heads[i];break}}if(!start)start=doc.querySelector("#tab-description");if(!start)return "";var stopRe=/^(tags\\b|tags:|related products|prodotti correlati|customers who|reviews\\b|recensioni\\b|write a review|scrivi una recensione|add testimonial|aggiungi testimonianza)/i;var stop=null,alln=[].slice.call(doc.querySelectorAll("*"));for(var j=0;j<alln.length;j++){var e=alln[j];if(e===start)continue;if((start.compareDocumentPosition(e)&4)&&stopRe.test(tx(e))){stop=e;break}}var blocks=[].slice.call(doc.querySelectorAll("h1,h2,h3,h4,h5,summary,p,ul,ol")),out="",seenT={};for(var k=0;k<blocks.length;k++){var b=blocks[k];if(!(b===start||(start.compareDocumentPosition(b)&4)))continue;if(stop&&!(stop.compareDocumentPosition(b)&2))continue;var bt=block(b);if(!bt)continue;var key=tx(b);if(!key||seenT[key])continue;seenT[key]=1;out+=bt}return out}var d=document.createElement("div");d.style.cssText="position:fixed;z-index:2147483647;right:16px;bottom:16px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:13px system-ui,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.4)";document.body.appendChild(d);var ok=0,ko=0,nm=0;function u(t){d.textContent=t||("KratosLabs: "+ok+"/"+P.length+" schede"+(ko?", "+ko+" ko":"")+(nm?", "+nm+" senza match":""))}u();for(var i=0;i<P.length;i++){var it=P[i],html="";try{var r=await fetch(it.u,{credentials:"include"});var t2=await r.text();var doc=new DOMParser().parseFromString(t2,"text/html");html=grab(doc).replace(/[ \\t]+/g," ").trim()}catch(e){}if(!html||html.length<20){ko++;u();continue}try{var f=new FormData();f.append("token",T);f.append("name",it.n);f.append("html",html);var up=await fetch(A,{method:"POST",body:f});var jd=await up.json().catch(function(){return{}});if(up.ok&&jd.ok)ok++;else{ko++;if(jd&&jd.error==="no_match")nm++}}catch(e){ko++}u()}d.textContent="Fatto: "+ok+"/"+P.length+" schede importate ("+ko+" ko, "+nm+" senza match). Ricarica il sito.";}catch(e){alert("Errore: "+e)}})();`;

const BOOKMARKLET = `javascript:(async()=>{try{var A="__API__",T="__TOKEN__";var RX=/image\\/(cache\\/)?catalog/i,BAD=/@logo|\\/logo\\/|payment|manufacturer|banner|blog/i;function folder(x){try{var p=new URL(x,location.href).pathname.replace("/cache","").replace(/-\\d+x\\d+(?=\\.[a-z0-9]+$)/i,"");return p.replace(/\\/[^\\/]*$/,"")}catch(e){return""}}function norm(x){try{return new URL(x,location.href).pathname.replace("/cache","").replace(/-\\d+x\\d+(?=\\.[a-z0-9]+$)/i,"")}catch(e){return x}}var seen={},P=[];[].slice.call(document.images).forEach(function(m){var s=m.getAttribute("data-src")||m.currentSrc||m.src||"";if(!RX.test(s)||BAD.test(s))return;var a=m.closest("a");if(!a||!a.href)return;var n=(m.getAttribute("alt")||a.getAttribute("title")||a.textContent||"").replace(/\\s+/g," ").trim();if(!n||/logo|payment|carrello|cart|wishlist/i.test(n))return;if(seen[a.href])return;seen[a.href]=1;P.push({n:n,u:a.href})});if(!P.length){alert("Nessun prodotto trovato. Apri la pagina 'Tutti i prodotti'.");return}var b=document.createElement("div");b.style.cssText="position:fixed;z-index:2147483647;right:16px;bottom:16px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:13px system-ui,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.4)";document.body.appendChild(b);var ok=0,ko=0,nm=0,img=0;function u(t){b.textContent=t||("KratosLabs: "+ok+"/"+P.length+" prodotti, "+img+" foto"+(ko?", "+ko+" ko":"")+(nm?", "+nm+" senza match":""))}u();for(var i=0;i<P.length;i++){var it=P[i],urls=[];try{var r=await fetch(it.u,{credentials:"include"});var html=await r.text();var doc=new DOMParser().parseFromString(html,"text/html");var og=doc.querySelector('meta[property="og:image"]');var base=og?folder(og.getAttribute("content")||""):"";var cand=[].slice.call(doc.querySelectorAll("a[href],img"));if(!base){for(var c=0;c<cand.length;c++){var el0=cand[c],s0=el0.tagName==="A"?(el0.getAttribute("href")||""):(el0.getAttribute("data-src")||el0.getAttribute("data-original")||el0.getAttribute("src")||"");if(RX.test(s0)&&!BAD.test(s0)){base=folder(s0);break}}}var pick={},order=[];cand.forEach(function(el){var s=el.tagName==="A"?(el.getAttribute("href")||""):(el.getAttribute("data-src")||el.getAttribute("data-original")||el.getAttribute("src")||"");var w=el.tagName==="A"?2:1;if(!RX.test(s)||BAD.test(s))return;if(base&&folder(s)!==base)return;var k=norm(s);if(!(k in pick)){order.push(k);pick[k]={u:s,w:w}}else if(w>pick[k].w){pick[k].u=s;pick[k].w=w}});urls=order.map(function(k){try{return new URL(pick[k].u,location.href).href}catch(e){return pick[k].u}})}catch(e){}if(!urls.length){ko++;u();continue}var f=new FormData();f.append("token",T);f.append("name",it.n);var got=0;for(var j=0;j<urls.length;j++){try{var ir=await fetch(urls[j],{credentials:"include"});if(ir.ok){var bl=await ir.blob();if(bl&&bl.size>0){f.append("file"+got,bl,"image"+got);got++;img++}}}catch(e){}}if(!got){ko++;u();continue}try{var up=await fetch(A,{method:"POST",body:f});var jd=await up.json().catch(function(){return{}});if(up.ok&&jd.ok)ok++;else{ko++;if(jd&&jd.error==="no_match")nm++}}catch(e){ko++}u()}b.textContent="Fatto: "+ok+"/"+P.length+" prodotti, "+img+" foto importate ("+ko+" ko, "+nm+" senza match). Ricarica l'admin.";}catch(e){alert("Errore: "+e)}})();`;

export default async function AdminImagesPage() {
  let products: Row[] = [];
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin
      .from("products")
      .select("slug,title,images")
      .order("title");
    products = (data ?? []).map((r) => ({
      slug: r.slug as string,
      title: r.title as string,
      images: Array.isArray(r.images) ? (r.images as Img[]) : [],
    }));
  }

  const h = await headers();
  const host = h.get("host") ?? "";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const apiUrl = `${proto}://${host}/api/admin/import-image`;
  const token = createImportToken();
  const bookmarklet = BOOKMARKLET.replace("__API__", apiUrl).replace(
    "__TOKEN__",
    token,
  );
  const detailsApiUrl = `${proto}://${host}/api/admin/import-details`;
  const detailsBookmarklet = DETAILS_BOOKMARKLET.replace(
    "__API__",
    detailsApiUrl,
  ).replace("__TOKEN__", token);

  const importerRows = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    imageUrl: p.images[0]?.url ?? null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Immagini</h1>
        <p className="text-sm text-muted">
          Popola il catalogo con le foto dei prodotti. Il metodo più affidabile è
          l&apos;importazione dal browser (i siti sorgente bloccano il nostro
          server).
        </p>
      </div>

      {!hasServiceRole && (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          Gestione non attiva: aggiungi <code>SUPABASE_SERVICE_ROLE_KEY</code> su
          Vercel e ridistribuisci.
        </p>
      )}

      {hasServiceRole && <BrowserImageImporter bookmarklet={bookmarklet} />}

      {hasServiceRole && <DetailsImporter bookmarklet={detailsBookmarklet} />}

      <div>
        <h2 className="text-sm font-semibold">Gestisci immagini</h2>
        <p className="mb-3 mt-1 text-sm text-muted">
          Elimina le foto sbagliate, riordina (la prima è la copertina) o
          spostane una su un altro prodotto. Le modifiche sono immediate.
        </p>
        <ImageManager products={products} />
      </div>

      <div>
        <h2 className="text-sm font-semibold">Auto-download / URL manuale</h2>
        <p className="mb-3 mt-1 text-sm text-muted">
          In alternativa puoi provare l&apos;auto-download da DeusMedical o
          incollare un URL immagine (funziona solo se la fonte non blocca il
          server).
        </p>
        <ImageImporter products={importerRows} />
      </div>
    </div>
  );
}
