# Puissance 4

Le jeu de jetons à aligner sur une grille de 7 colonnes et 6 lignes : le premier qui aligne 4 jetons de sa couleur gagne. Joue contre l'ordinateur, à trois niveaux, ou à deux sur le même écran.

*English version: [README.en.md](README.en.md)*

## Les règles

- Chacun son tour, on lâche un jeton dans une colonne : il tombe tout en bas, sur la première case libre.
- Le premier qui aligne **4 jetons** de sa couleur, à l'horizontale, à la verticale ou en diagonale, gagne ; les 4 jetons gagnants s'illuminent.
- Si la grille est pleine sans alignement, c'est une égalité.
- On commence chacun son tour d'une partie à l'autre.

## Commandes

- **Clic** sur une colonne pour y lâcher un jeton.
- **← →** pour choisir la colonne, puis **Entrée**.
- **Annuler** : reprend le dernier coup (contre l'ordinateur, ton coup et le sien).
- **R** ou **clic** en fin de partie : rejouer.

## Modes

- **Contre l'ordi**, tu as les rouges :
  - **Facile** : il prévoit 2 coups à l'avance et joue parfois au hasard ;
  - **Normal** : il prévoit 4 coups ;
  - **Difficile** : il prévoit 6 coups.

  À tous les niveaux, il gagne quand il le peut et bloque tes alignements qu'il voit venir.
- **À deux** : rouges contre jaunes sur le même écran.

## Bilan

Victoires, défaites et parties jouées pour chaque niveau, et le score des rouges contre les jaunes à deux.

## Données et synchronisation

Ton bilan et le mode choisi sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Puissance 4 → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
