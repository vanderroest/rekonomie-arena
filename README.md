# Rekonomie Arena · Kennemer Lyceum

Gamificeerde oefenomgeving voor Rekonomie VWO, hoofdstuk 1 (Rekenen) en hoofdstuk 2 (Procenten), voor 4 vwo.

- **Leerlingen:** open de site en log in met hun leerlingnummer en een zelfgekozen pincode. De eerste keer vullen ze ook klascode en naam in.
- **Docent:** knop "Docent" op het inlogscherm, of voeg `?docent` toe aan het adres.
- **Demo zonder database:** voeg `?demo` toe aan het adres (gegevens blijven dan alleen in die browser).

## Bestanden
- `index.html`: de complete app in één bestand, gepubliceerd via GitHub Pages.
- `database.sql` en `database_leerlingnummer.sql`: tabellen en functies voor Supabase.
- `src/`: bronbestanden. Na een wijziging maakt `python3 src/build.py` een nieuwe `index.html`.

## Docentwachtwoord wijzigen
In Supabase, SQL Editor: `update rk_settings set value = 'NieuwWachtwoord' where key = 'docent_pw';`
