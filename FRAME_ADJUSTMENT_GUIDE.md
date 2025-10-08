# 🎨 Frame Adjustment Guide

## Ručno podešavanje svakog frame-a

U fajlu `src/constants/animations.js` možeš prilagoditi **svaki frame posebno** za različite screen veličine.

## 📐 Kako funkcioniše

### FRAME_ADJUSTMENTS objekat:
```javascript
export const FRAME_ADJUSTMENTS = {
  0: { // Frame 1 index
    scale: { xs: 1.0, sm: 1.0, md: 1.0, lg: 1.0 },    // Veličina
    offsetX: { xs: 0, sm: 0, md: 0, lg: 0 },          // Pomeranje levo/desno (px)
    offsetY: { xs: 0, sm: 0, md: 0, lg: 0 }           // Pomeranje gore/dole (px)
  },
  1: { // Frame 2 index - trenutno povećan za 20%
    scale: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1.2 },
    offsetX: { xs: 0, sm: 0, md: 0, lg: 0 },
    offsetY: { xs: 0, sm: 0, md: 0, lg: 0 }
  }
  // ... ostali frame-ovi
}
```

## 🎯 Kako podešavati

### 1. **Scale (veličina)**
- `1.0` = originalna veličina
- `1.2` = 20% veći
- `0.8` = 20% manji
- `1.5` = 50% veći

### 2. **OffsetX (horizontalno pomeranje)**
- `10` = pomeri 10px desno
- `-10` = pomeri 10px levo
- `0` = bez pomeranja

### 3. **OffsetY (vertikalno pomeranje)**
- `10` = pomeri 10px dole
- `-10` = pomeri 10px gore
- `0` = bez pomeranja

## 📱 Screen veličine

- **xs**: mobile (<640px)
- **sm**: tablet (640-768px)
- **md**: desktop (768-1024px)
- **lg**: large desktop (>1024px)

## 🔧 Praktični primeri

### Frame sa malom glavom (kao frame 2):
```javascript
1: {
  scale: { xs: 1.3, sm: 1.25, md: 1.2, lg: 1.2 },  // Povećaj
  offsetX: { xs: 0, sm: 0, md: 0, lg: 0 },
  offsetY: { xs: 5, sm: 3, md: 0, lg: 0 }          // Malo pomeri dole
}
```

### Frame koji treba centrirati:
```javascript
3: {
  scale: { xs: 1.0, sm: 1.0, md: 1.0, lg: 1.0 },
  offsetX: { xs: -5, sm: 0, md: 5, lg: 0 },        // Različito pomeranje
  offsetY: { xs: 0, sm: 0, md: 0, lg: 0 }
}
```

### Frame koji je prevelik:
```javascript
5: {
  scale: { xs: 0.9, sm: 0.95, md: 1.0, lg: 1.0 },  // Smanji na mobile
  offsetX: { xs: 0, sm: 0, md: 0, lg: 0 },
  offsetY: { xs: 0, sm: 0, md: 0, lg: 0 }
}
```

## 🎮 Workflow za podešavanje

1. **Identifikuj problematičan frame** (npr. frame 2 ima malu glavu)
2. **Otvori** `src/constants/animations.js`
3. **Nađi frame index** (frame 2 = index 1)
4. **Podesi scale** za povećanje/smanjenje
5. **Podesi offsetX/Y** za fine-tuning pozicije
6. **Testiraj** na različitim screen veličinama
7. **Repeat** za ostale frame-ove

## 📊 Trenutno stanje

**Frame 1 (index 0)**: dormouse_sleep.png - OK
**Frame 2 (index 1)**: dormouse_frame_2.png - 🔧 **POVEĆAN za 20%**
**Frame 3 (index 2)**: dormouse_sleep.png - OK
**Frame 4 (index 3)**: dormouse_frame_4.png - OK
**Frame 5 (index 4)**: extraSleep - OK
**Frame 6 (index 5)**: dormouse_frame_7.png - OK
**Frame 7 (index 6)**: dormouse_frame_8.png - OK
**Frame 8 (index 7)**: dormouse_frame_5.png - OK
**Frame 9 (index 8)**: dormouse_frame_6.png - OK

## 🚀 Live editing

Izmene se primenjuju odmah preko Vite HMR-a - nema potrebe za restart aplikacije!

---

**Sada imaš potpunu kontrolu nad svakim frame-om! 🎨**