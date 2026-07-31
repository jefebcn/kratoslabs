import type { Metadata } from "next";
import { headers } from "next/headers";
import { TouchdownImporter } from "@/components/admin/TouchdownImporter";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { hasServiceRole } from "@/lib/supabase/admin";
import { createImportToken } from "@/lib/import-token";
import { listGalleryImages } from "@/features/gallery/queries";

export const metadata: Metadata = { title: "Galleria" };

/** Bookmarklet: dalla home di deuspower raccoglie le foto della sezione
 *  "Galleria Touchdown" (tra i due titoli) e le invia all'API.
 *  __API__ e __TOKEN__ vengono sostituiti a runtime. */
const BOOKMARKLET = `javascript:(async()=>{try{var A="__API__",T="__TOKEN__";function txt(e){return (e.textContent||"").replace(/\\s+/g," ").trim()}var all=[].slice.call(document.querySelectorAll("h1,h2,h3,h4,div,span,p,section,a")),start=null,end=null;for(var i=0;i<all.length;i++){var t=txt(all[i]);if(!start&&/galleria touchdown/i.test(t)&&t.length<40)start=all[i];else if(start&&/invia il tuo touchdown/i.test(t)&&t.length<40){end=all[i];break}}if(!start){alert("Sezione 'Galleria Touchdown' non trovata. Apri la home di deuspower e riprova.");return}var seen={},I=[];[].slice.call(document.images).forEach(function(m){var s=m.currentSrc||m.src||m.getAttribute("data-src")||"";if(!s)return;if(!(start.compareDocumentPosition(m)&4))return;if(end&&!(end.compareDocumentPosition(m)&2))return;if(/logo|payment|manufacturer|icon|flag|sprite|blank\\.|1x1/i.test(s))return;if((m.naturalWidth&&m.naturalWidth<120)||(m.naturalHeight&&m.naturalHeight<120))return;if(seen[s])return;seen[s]=1;I.push(s)});if(!I.length){alert("Nessuna foto trovata nella sezione Touchdown.");return}var b=document.createElement("div");b.style.cssText="position:fixed;z-index:2147483647;right:16px;bottom:16px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:13px system-ui,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.4)";document.body.appendChild(b);b.textContent="KratosLabs: scarico "+I.length+" foto…";var f=new FormData();f.append("token",T);var got=0;for(var j=0;j<I.length;j++){try{var r=await fetch(I[j],{credentials:"include"});if(r.ok){var bl=await r.blob();if(bl&&bl.size>0){f.append("file"+got,bl,"touchdown"+got);got++;b.textContent="KratosLabs: "+got+"/"+I.length+" foto"}}}catch(e){}}if(!got){b.textContent="Nessuna foto scaricata (blocco del browser?).";return}try{var up=await fetch(A,{method:"POST",body:f});var jd=await up.json().catch(function(){return{}});if(up.ok&&jd.ok)b.textContent="Fatto: "+jd.count+" foto importate. Ricarica l'admin.";else b.textContent="Errore import: "+(jd.error||up.status)}catch(e){b.textContent="Errore invio: "+e}}catch(e){alert("Errore: "+e)}})();`;

export default async function AdminGalleryPage() {
  const images = await listGalleryImages();

  const h = await headers();
  const host = h.get("host") ?? "";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const apiUrl = `${proto}://${host}/api/admin/import-touchdown`;
  const bookmarklet = BOOKMARKLET.replace("__API__", apiUrl).replace(
    "__TOKEN__",
    createImportToken(),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Galleria Touchdown
        </h1>
        <p className="text-sm text-muted">
          Le foto mostrate nella sezione &quot;Galleria Touchdown&quot; della
          home. Importale da deuspower o caricale a mano, poi riordinale.
        </p>
      </div>

      {!hasServiceRole && (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          Gestione non attiva: aggiungi <code>SUPABASE_SERVICE_ROLE_KEY</code> su
          Vercel e ridistribuisci. Ricorda anche di eseguire la migrazione{" "}
          <code>0006_gallery.sql</code> su Supabase.
        </p>
      )}

      {hasServiceRole && <TouchdownImporter bookmarklet={bookmarklet} />}

      <div>
        <h2 className="text-sm font-semibold">Foto in galleria</h2>
        <p className="mb-3 mt-1 text-sm text-muted">
          Trascina l&apos;ordine con le frecce (la prima è la prima mostrata),
          elimina quelle che non vuoi o aggiungine di tue.
        </p>
        <GalleryManager images={images} />
      </div>
    </div>
  );
}
