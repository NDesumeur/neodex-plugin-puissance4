# Puissance 4 (Connect Four)

The disc-dropping game on a grid of 7 columns and 6 rows: the first to line up 4 discs of their colour wins. Play against the computer at three levels, or with two players on the same screen.

*Version française : [README.md](README.md)*

## Rules

- Taking turns, each player drops a disc into a column: it falls to the bottom, onto the first free cell.
- The first to line up **4 discs** of their colour, horizontally, vertically or diagonally, wins; the 4 winning discs light up.
- If the grid fills up with no line, it is a draw.
- Players take turns starting from one game to the next.

## Controls

- **Click** a column to drop a disc there.
- **← →** to choose the column, then **Enter**.
- **Undo**: takes back the last move (against the computer, your move and its reply).
- **R** or **click** at the end of a game: play again.

## Modes

- **Against the computer**, you play red:
  - **Easy**: it looks 2 moves ahead and sometimes plays at random;
  - **Normal**: it looks 4 moves ahead;
  - **Hard**: it looks 6 moves ahead.

  At every level, it wins when it can and blocks the lines it sees coming.
- **Two players**: red against yellow on the same screen.

## Record

Wins, losses and games played for each level, and the red versus yellow score in two-player mode.

## Data and sync

Your record and chosen mode are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Puissance 4 → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
