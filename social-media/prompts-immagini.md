# Prompt per generare le immagini — KratosLabs

Libreria di prompt per creare gli asset social (prodotti, brand, scene TikTok)
con generatori AI (Gemini / Midjourney / DALL·E / Flux). In inglese perché i
modelli rendono meglio; le note sono in italiano.

## Come usarli (leggi prima)

- **Etichetta vuota:** i prodotti hanno `blank label, no text` → generi il barattolo
  pulito e ci **applichi tu il logo dopo** (in Canva/Photoshop). I modelli scrivono
  testo storto: non far generare scritte.
- **Niente IP di terzi:** mai "Kratos" / "God of War". Usa *spartan warrior*,
  *Greek god of strength*, *marble statue*, *hoplite* → stessa estetica, tua e legale.
- **Coerenza tra immagini:** riusa lo stesso blocco **STILE BASE**, e se il tool lo
  permette blocca lo *stesso seed* e usa una *style reference* per un look uniforme.
- **Formati:** IG feed `4:5` (1080×1350), Story/Reel/TikTok `9:16` (1080×1920),
  quadrato `1:1`. Su Midjourney aggiungi `--ar 4:5` / `--ar 9:16`.
- **Qualità:** genera almeno a 2000 px sul lato lungo; scarta le versioni con
  artefatti sulle mani o testo fantasma.

---

## 🎨 STILE BASE (suffisso da incollare in fondo a ogni prompt prodotto)

```
studio product photography, matte charcoal-black container with a deep blood-red
label panel and a thin brushed-brass Greek meander (key) border detail, blank
label with no text, dramatic hard side lighting, dark anthracite background with
subtle marble texture, soft reflection on a dark surface, crisp sharp focus, high
detail, premium sports-supplement brand, minimal and clean, cinematic mood, 8k
```

**Negative prompt** (dove disponibile):
```
no text, no lettering, no watermark, no logo, no brand name, no people, cluttered
background, cartoon, lowres, blurry, deformed, extra objects
```

---

## 1) Prodotti (5 SKU)

**ISO Zero — Whey Isolate** (barattolo grande) · `4:5`
```
A large cylindrical protein tub, matte charcoal-black with a blood-red label band
and brushed-brass Greek meander trim, blank label no text, standing on dark stone,
one clean scoop of white powder beside it, [STILE BASE]
```

**Creatina Monoidrato Micronizzata** (barattolo medio) · `4:5`
```
A medium matte-black supplement jar of fine white micronized powder, blood-red
label band, brass meander trim, blank label no text, a small precision scoop with
leveled white powder in front, laboratory-clean look, [STILE BASE]
```

**Ignition — Pre-workout** (barattolo + shaker) · `4:5`
```
A matte-black pre-workout tub with blood-red label and brass meander trim, blank
label no text, next to a black shaker bottle, faint red powder, energetic but
clean studio still life, [STILE BASE]
```

**Omega-3 — softgel** (flacone) · `4:5`
```
A matte-black supplement bottle with blood-red label and brass meander trim, blank
label no text, a few amber fish-oil softgel capsules spilled neatly in front on
dark stone, premium and clinical, [STILE BASE]
```

**Hydrate — Elettroliti** (bustine) · `4:5`
```
Three matte-black electrolyte sachets with blood-red accent and brass meander trim,
blank label no text, arranged on dark slate with a few water droplets and a slice
of nothing-branded clean look, refreshing, [STILE BASE]
```

---

## 2) Brand / "Lab + Mito" (hero, sfondi, key visual)

**Key visual — guerriero greco moderno (originale)** · `4:5` o `9:16`
```
Cinematic portrait of a muscular ancient Greek hoplite warrior seen from behind,
bronze spartan helmet with red crest, standing in a dark modern laboratory with
soft red and brass rim light, marble and steel textures, moody atmosphere,
photorealistic, no face focus, no game characters, original character, 8k
```

**Statua di marmo + scienza** (manifesto trasparenza) · `4:5`
```
A classical Greek marble statue of a strong athlete, half-lit in dramatic red and
brass light against a dark anthracite wall with a faint Greek meander pattern,
clean laboratory minimalism, cinematic, photorealistic, high detail, no text
```

**Sfondo/texture per grafiche** (per caption e citazioni) · `1:1` e `9:16`
```
Dark anthracite background with subtle marble veining and a faint brushed-brass
Greek meander border, premium minimal, soft vignette, no text, seamless, 8k
```

---

## 3) Lab / trasparenza (analisi, referti, QC)

**Analisi di laboratorio** · `4:5`
```
Close-up of a clean laboratory bench: a vial of white powder, a printed certificate
of analysis document (blurred illegible text), gloved hand, brass and red accents,
dark clinical background, shallow depth of field, photorealistic, trustworthy mood
```

---

## 4) Scene per TikTok / Reels (still da ricreare in video)

**"Il test del misurino" (creatina)** · `9:16`
```
Macro shot of a precision scale reading, a scoop leveling fine white powder,
matte-black jar out of focus behind, dramatic side light, dark background, red and
brass accents, satisfying and clean, photorealistic, 9:16 vertical
```

**"Polvere nell'acqua"** · `9:16`
```
Macro slow-motion style shot of white protein powder dissolving in a glass of
water, no residue, black background, single red rim light, premium and satisfying,
photorealistic, 9:16 vertical
```

**"Unboxing neutro"** · `9:16`
```
Top-down shot of a plain neutral cardboard shipping box being opened on a dark
table, revealing a matte-black supplement jar and a small lab certificate slip,
moody warm light, brass and red accents, photorealistic, 9:16 vertical
```

---

## 5) Community / lifestyle (palestra)

**Atleta in palestra (originale, volto non riconoscibile)** · `4:5`
```
A fit athlete in a dark industrial gym, holding a matte-black shaker, low-key
lighting with red and brass highlights, gritty premium mood, motion and sweat,
photorealistic, cinematic, no logos, no text, face not in focus
```

---

## Dopo la generazione — checklist

1. Scegli la resa senza artefatti (mani/testo).
2. In Canva/Photoshop applica il **logo KratosLabs** sull'etichetta vuota + la greca.
3. Aggiungi il testo del post (numeri, claim) con i font del brand.
4. Esporta a `1080×1350` (feed) o `1080×1920` (story/reel).

> Nota: se vuoi, generane 3-4 varianti per prodotto e mandamele: scelgo io le
> migliori e le monto nei layout del kit.
