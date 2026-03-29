# 🧠 Quiz Builder

Application React de création et correction de questionnaires.

## Lancer le projet
```bash
npm install
npm run dev
```

## Fonctionnalités réalisées

### Fonctionnalités principales
- Création du quiz (titre via react-hook-form)
- Ajout de questions (formulaire contrôlé avec useState)
- Choix de réponses dynamiques (ajout/suppression)
- Validation des formulaires
- Affichage des questions créées
- Suppression d'une question
- Passage du quiz
- Correction et score final

### Bonus
- react-hook-form (QuizForm)
- localStorage (données persistantes)
- Minuterie avec alerte urgence
- Score en pourcentage avec barre de progression
- Message final selon la note
- Bouton réinitialisation complète

## Structure des composants
```
src/
├── components/
│   ├── QuizForm.jsx       -> react-hook-form
│   ├── QuestionForm.jsx   -> formulaire contrôlé
│   ├── QuestionList.jsx   -> affichage des questions
│   ├── QuizPlayer.jsx     -> passage du quiz + minuterie
│   └── ScoreBoard.jsx     -> résultats + correction
├── hooks/
│   └── useLocalStorage.js -> persistance des données
├── utils/
│   └── scoreCalculator.js -> calcul du score
└── App.jsx                -> state global + navigation
```