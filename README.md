# Adriano DODO · Portfolio « Signal »

Portfolio de **Adriano DODO**, développeur full-stack et technicien réseaux & télécoms à Cotonou (Bénin).

> Je construis des applications web et les réseaux qui les font tourner.

## Le concept

Une impulsion de lumière voyage dans une fibre optique du haut de la page jusqu'au formulaire de contact. Chaque chapitre est une étape du signal :

1. **Émission** : l'orbe-signal, objet signature en 3D temps réel, et le nom qui se décode.
2. **Transport** : le plan d'architecture devient l'application réelle, puis les projets.
3. **Démontage** : un Raspberry Pi 3 Model B modélisé à l'échelle s'éclate au défilement.
4. **Couches** : les 7 couches du modèle OSI, du câble à l'interface.
5. **Réception** : on tire un connecteur fibre SC/APC pour brancher le formulaire.

## Technique

- HTML, CSS et JavaScript sans framework ni étape de compilation.
- [Three.js](https://threejs.org) pour l'orbe et le Raspberry Pi en 3D, chargé seulement à l'approche des sections.
- [Lenis](https://github.com/darkroomengineering/lenis) pour le défilement fluide.
- Images en WebP, séquence d'images en secours pour le Pi sur mobile.
- Respect de `prefers-reduced-motion` : sans animation, tout s'affiche directement.

## Lancer en local

```bash
python -m http.server 5510
```

Puis ouvrir http://localhost:5510.

## Structure

```
index.html          Accueil (5 chapitres)
projets.html        Les 8 projets et le laboratoire
pitchmysite.html    Étude de cas PitchMySite
contact.html        Contact
404.html            Page « Plus de signal »
assets/css/         Styles
assets/js/          main.js (interactions), signal.js (orbe 3D), pi3d.js (Raspberry Pi 3D)
assets/img/         Images, captures et séquence du Pi
tools/render-pi.html  Rendu de la séquence d'images du Pi
```

## Contact

- E-mail : adrrianododo@gmail.com
- WhatsApp : +229 01 50 88 46 70
- GitHub : [netwavestudioweb-creator](https://github.com/netwavestudioweb-creator)
