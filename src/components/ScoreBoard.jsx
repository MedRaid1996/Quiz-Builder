// Composant qui affiche le score final et la correction du quiz
function ScoreBoard({ score, questions, userAnswers, resetQuiz, recommencerQuiz }) {

  // Retourne un message final selon le pourcentage obtenu
  const getMessageFinal = () => {
    if (score.percentage === 100) return { texte: '🏆 Parfait ! Tu as tout bon !', couleur: '#16a34a' }
    if (score.percentage >= 80) return { texte: '🎉 Excellent résultat !', couleur: '#16a34a' }
    if (score.percentage >= 60) return { texte: '👍 Bon travail, continue !', couleur: '#d97706' }
    if (score.percentage >= 40) return { texte: '📚 Pas mal, mais révise encore !', couleur: '#d97706' }
    return { texte: '💪 Courage, tu feras mieux la prochaine fois !', couleur: '#dc2626' }
  }

  // Stocke le message final choisi
  const messageFinal = getMessageFinal()

  // Choisit la couleur de la barre de progression selon le résultat
  const getCouleurBarre = () => {
    if (score.percentage >= 80) return '#16a34a'
    if (score.percentage >= 60) return '#d97706'
    return '#dc2626'
  }

  return (
    <div className="carte">

      {/* Partie qui affiche le résultat global */}
      <div className="score-entete">
        <h2 className="section-titre" style={{ justifyContent: 'center' }}>📊 Résultats</h2>

        {/* Message affiché selon la note obtenue */}
        <p className="score-message" style={{ color: messageFinal.couleur }}>
          {messageFinal.texte}
        </p>

        {/* Affiche le nombre de bonnes réponses */}
        <p className="score-chiffres">
          <span className="score-grand">{score.correct}</span>
          <span className="score-sur"> / {score.total}</span>
        </p>

        {/* Affiche le pourcentage final */}
        <p className="score-pourcentage" style={{ color: getCouleurBarre() }}>
          {score.percentage}%
        </p>

        {/* Barre visuelle du pourcentage obtenu */}
        <div className="barre-container">
          <div
            className="barre-fill"
            style={{ width: `${score.percentage}%`, backgroundColor: getCouleurBarre() }}
          />
        </div>
      </div>

      {/* Titre de la partie correction */}
      <h3 className="correction-titre">🔍 Correction détaillée</h3>

      {/* Liste complète de la correction */}
      <div className="correction-liste">
        {questions.map((question, index) => {
          const reponseDonnee = userAnswers[question.id]
          const estCorrect = reponseDonnee === question.bonneReponse

          return (
            <div
              key={question.id}
              className={`correction-carte ${estCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="correction-entete">
                <span className="correction-numero">Question {index + 1}</span>

                {/* Badge qui indique si la réponse est correcte ou non */}
                <span className={`correction-badge ${estCorrect ? 'correct' : 'incorrect'}`}>
                  {estCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
              </div>

              {/* Affiche l'énoncé de la question */}
              <p className="correction-enonce">{question.texte}</p>

              {/* Affiche tous les choix avec la bonne réponse et la réponse choisie */}
              <div className="correction-choix">
                {question.choix.map((choix, choixIndex) => {
                  const estBonne = choix === question.bonneReponse
                  const estJoueur = choix === reponseDonnee
                  let classe = ''

                  // Définit une classe selon le type de réponse
                  if (estBonne) classe = 'bonne'
                  else if (estJoueur && !estBonne) classe = 'mauvaise'

                  return (
                    <div key={choixIndex} className={`correction-choix-item ${classe}`}>
                      <span style={{ fontWeight: 'bold', minWidth: '20px' }}>{choixIndex + 1}.</span>
                      <span>{choix}</span>
                      <span className="correction-icone">
                        {estBonne && '✅'}
                        {estJoueur && !estBonne && '❌'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Message affiché si aucune réponse n'a été donnée */}
              {!reponseDonnee && (
                <p className="sans-reponse">⚠️ Tu n'as pas répondu à cette question.</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Boutons d'action en bas */}
      <div className="score-actions">
        <button onClick={recommencerQuiz} className="btn btn-principal">
          🔄 Rejouer ce quiz
        </button>
        <button onClick={resetQuiz} className="btn btn-neutre">
          ✏️ Créer un nouveau quiz
        </button>
      </div>

    </div>
  )
}

export default ScoreBoard