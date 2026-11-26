# Adriano DODO · Portfolio « Signal »

Portfolio de **Adriano DODO**, développeur full-stack et technicien réseaux & télécoms à Cotonou (Bénin).

> Je construis des applications web et les réseaux qui les font tourner.

## Le concept : le voyage du signal

L'accueil est un site immersif. Une porte s'ouvre sur un monde 3D unique ; en défilant, la caméra suit un signal lumineux à travers six étapes :

1. **Émission** : l'orbe-signal et le nom qui se décode.
2. **La fibre** : on voyage dans le cœur d'une fibre monomode, trace OTDR à l'appui.
3. **La box** : le connecteur SC/APC se branche, LOS s'éteint, PON s'allume.
4. **Le Raspberry Pi** : il se démonte pendant qu'une onde vocale le traverse (centre d'appels IA).
5. **Production** : serveurs et écrans flottants, chaque écran ouvre un projet.
6. **Réception** : on plonge dans un téléphone, puis le contact.

Le texte reste du vrai HTML par-dessus la 3D : lisible par tous, par les lecteurs d'écran et par les moteurs de recherche.

## Technique

- HTML, CSS et JavaScript sans framework ni étape de compilation.
- [Three.js](https://threejs.org) : tout le monde 3D est construit en code (aucun modèle à télécharger).
- [GSAP](https://gsap.com) ScrollTrigger et SplitText : défilement relié à la caméra, titres animés.
- [Lenis](https://github.com/darkroomengineering/lenis) pour le défilement fluide.
- Son généré en direct avec la Web Audio API, coupé par défaut.
- View Transitions natives entre les pages (Chrome, Edge, Safari).

### Trois niveaux d'affichage, choisis automatiquement

| Niveau | Pour qui | Contenu |
|---|---|---|
| Complet | Carte graphique dédiée ou puce Apple | Monde 3D, lueurs (bloom), curseur |
| Allégé | Puces intégrées, téléphones | Monde 3D simplifié, sans lueurs |
| Léger | Économie de données, peu de mémoire, « réduire les animations » | Pas de 3D, images fixes |

La fluidité est surveillée en continu : si le site rame, il descend d'un niveau tout seul.
`?simple=1` force la version légère (mémorisée), `?simple=0` revient à l'immersif.
Pour les tests : `?tier=full|lite|static` force un niveau, `?nowatch=1` coupe la surveillance.

## Lancer en local

```bash
python -m http.server 5510
```

Puis ouvrir http://localhost:5510.

## Structure

```
index.html          Accueil : le voyage du signal (6 étapes)
projets.html        Les 8 projets et le laboratoire
pitchmysite.html    Étude de cas PitchMySite
alkareem.html       Étude de cas Al Kareem
apropos.html        À propos
contact.html        Contact
404.html            Page « Plus de signal »
assets/css/         style.css (commun), voyage.css (accueil immersif)
assets/js/          main.js (interactions communes)
assets/js/voyage/   voyage.js (orchestration), world.js (monde 3D), pi-model.js, audio.js
assets/img/         Images, captures et séquence du Pi
tools/render-pi.html  Rendu de la séquence d'images du Pi
```

## Contact

- E-mail : adrrianododo@gmail.com
- WhatsApp : +229 01 50 88 46 70
- GitHub : [netwavestudioweb-creator](https://github.com/netwavestudioweb-creator)
