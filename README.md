# Printable Questions

Een kleine Nuxt-app om een lijst met vragen (bijvoorbeeld geknipt uit een WhatsApp-export) om te zetten in geprinte kaartjes, gegroepeerd per categorie en op kleur.

## Hoe het werkt

De app werkt in drie stappen, bovenin als tabs:

1. **Lijst** — plak een blok tekst met vragen (één per regel). WhatsApp-chatregels (`[12:34, 1-1-24] Naam: tekst`) worden automatisch herkend en er blijft alleen de berichttekst over. Duplicaten worden genegeerd.
2. **Categoriseren** — maak categorieën aan met een naam en kleur, en sleep vragen vanuit "Ongesorteerd" naar de gewenste categorie.
3. **Printen** — alle gecategoriseerde vragen worden als gekleurde kaartjes op A4-pagina's gezet (16 per pagina), klaar om te printen en uit te knippen.

Alle data (vragen en categorieën) wordt opgeslagen in `localStorage` van de browser — er is geen backend of database.

## Tech stack

- [Nuxt 4](https://nuxt.com/) + Vue 3
- [Nuxt UI](https://ui.nuxt.com/) voor de componenten

## Lokale development

Installeer de dependencies:

```bash
npm install
```

Start de development server op `http://localhost:3000`:

```bash
npm run dev
```

### Overige scripts

```bash
npm run build     # production build
npm run generate  # statische export
npm run preview   # preview van de production build
```
