import type { Metadata } from "next";
import { headers } from "next/headers";
import { ImageImporter } from "@/components/admin/ImageImporter";
import { BrowserImageImporter } from "@/components/admin/BrowserImageImporter";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createImportToken } from "@/lib/import-token";

export const metadata: Metadata = { title: "Immagini" };

interface Row {
  slug: string;
  title: string;
  imageUrl: string | null;
}

/** Bookmarklet: scarica le immagini prodotto dalla pagina corrente (deuspower)
 *  e le invia all'API. __API__ e __TOKEN__ vengono sostituiti a runtime. */
const BOOKMARKLET = `javascript:(async()=>{try{var A="__API__",T="__TOKEN__";await new Promise(function(res){var y=0,iv=setInterval(function(){y+=900;window.scrollTo(0,y);if(y>=document.body.scrollHeight+900){clearInterval(iv);window.scrollTo(0,0);setTimeout(res,700)}},50)});var S={},I=[];[].slice.call(document.images).forEach(function(m){var s=m.getAttribute("data-src")||m.currentSrc||m.src||"";if(!/image\\/cache\\/catalog/i.test(s))return;if(/@logo|\\/logo\\/|payment|manufacturer|banner|blog/i.test(s))return;var n=(m.getAttribute("alt")||"").replace(/\\s+/g," ").trim();if(!n){var a=m.closest("a");n=((a&&(a.getAttribute("title")||a.textContent))||"").replace(/\\s+/g," ").trim()}if(!n||/logo|payment|carrello|cart|wishlist/i.test(n))return;if(S[s])return;S[s]=1;I.push({n:n,s:s})});if(!I.length){alert("Nessuna immagine prodotto trovata su questa pagina (apri 'Tutti i prodotti').");return}var b=document.createElement("div");b.style.cssText="position:fixed;z-index:2147483647;right:16px;bottom:16px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:13px system-ui,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.4)";document.body.appendChild(b);var ok=0,ko=0,nm=0;function u(t){b.textContent=t||("KratosLabs: "+ok+" ok / "+ko+" ko / "+I.length)}u();for(var i=0;i<I.length;i++){var it=I[i],bl=null;try{var r=await fetch(it.s,{credentials:"include"});if(r.ok)bl=await r.blob()}catch(e){}if(!bl){ko++;u();continue}try{var f=new FormData();f.append("token",T);f.append("name",it.n);f.append("file",bl,"image");var up=await fetch(A,{method:"POST",body:f});var j=await up.json().catch(function(){return{}});if(up.ok&&j.ok)ok++;else{ko++;if(j&&j.error==="no_match")nm++}}catch(e){ko++}u()}b.textContent="Fatto: "+ok+" importate, "+ko+" ko ("+nm+" senza corrispondenza). Ricarica l'admin.";}catch(e){alert("Errore: "+e)}})();`;

export default async function AdminImagesPage() {
  let products: Row[] = [];
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin
      .from("products")
      .select("slug,title,images")
      .order("title");
    products = (data ?? []).map((r) => {
      const images = Array.isArray(r.images)
        ? (r.images as { url: string }[])
        : [];
      return {
        slug: r.slug as string,
        title: r.title as string,
        imageUrl: images[0]?.url ?? null,
      };
    });
  }

  const h = await headers();
  const host = h.get("host") ?? "";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const apiUrl = `${proto}://${host}/api/admin/import-image`;
  const bookmarklet = BOOKMARKLET.replace("__API__", apiUrl).replace(
    "__TOKEN__",
    createImportToken(),
  );

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

      <div>
        <h2 className="text-sm font-semibold">Stato prodotti / fallback</h2>
        <p className="mb-3 mt-1 text-sm text-muted">
          Elenco prodotti con anteprima. Puoi anche provare l&apos;auto-download
          da DeusMedical o incollare un URL immagine (funziona solo se la fonte
          non blocca il server).
        </p>
        <ImageImporter products={products} />
      </div>
    </div>
  );
}
