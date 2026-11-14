# Rekonomie Arena · Kennemer Lyceum

Gamificeerde oefenomgeving voor Rekonomie VWO, hoofdstuk 1 (Rekenen) en hoofdstuk 2 (Procenten), voor 4 vwo.

- **Leerlingen:** open de site en log in met klascode, naam en een zelfgekozen pincode.
- **Docent:** knop "Docent" op het inlogscherm, of voeg `?docent` toe aan het adres.
- **Demo zonder database:** voeg `?demo` toe aan het adres (gegevens blijven dan alleen in die browser).

## Bestanden
- `index.html`: de complete app in één bestand, gepubliceerd via GitHub Pages.
- `database.sql`: tabellen en functies voor Supabase (al geïnstalleerd).
- `src/`: bronbestanden. Na een wijziging maakt `python3 src/build.py` een nieuwe `index.html`.

## Docentwachtwoord wijzigen
In Supabase, SQL Editor: `update rk_settings set value = 'NieuwWachtwoord' where key = 'docent_pw';`
