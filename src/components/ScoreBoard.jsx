// Affichage du score final et correction détaillée
function ScoreBoard({ score, questions, userAnswers, resetQuiz, recommencerQuiz }) {

  const getMessageFinal = () => {
    if (score.percentage === 100) return { texte: '🏆 Parfait ! Tu as tout bon !',              couleur: '#16a34a' }
    if (score.percentage >= 80)  return { texte: '🎉 Excellent résultat !',                     couleur: '#16a34a' }
    if (score.percentage >= 60)  return { texte: '👍 Bon travail, continue !',                  couleur: '#d97706' }
    if (score.percentage >= 40)  return { texte: '📚 Pas mal, mais révise encore !',             couleur: '#d97706' }
    return                              { texte: '💪 Courage, tu feras mieux la prochaine fois !', couleur: '#dc2626' }
  }

  const messageFinal = getMessageFinal()

  const getCouleurBarre = () => {
    if (score.percentage >= 80) return '#16a34a'
    if (score.percentage >= 60) return '#d97706'
    return '#dc2626'
  }

  return (
    <div className="carte">

      {/* Score global */}
      <div className="score-entete">
        <h2 className="section-titre" style={{ justifyContent: 'center' }}>📊 Résultats</h2>
        <p className="score-message" style={{ color: messageFinal.couleur }}>
          {messageFinal.texte}
        </p>
        <p className="score-chiffres">
          <span className="score-grand">{score.correct}</span>
          <span className="score-sur"> / {score.total}</span>
        </p>
        <p className="score-pourcentage" style={{ color: getCouleurBarre() }}>
          {score.percentage}%
        </p>
        <div className="barre-container">
          <div
            className="barre-fill"
            style={{ width: `${score.percentage}%`, backgroundColor: getCouleurBarre() }}
          />
        </div>
      </div>

      {/* Correction détaillée */}
      <h3 className="correction-titre">🔍 Correction détaillée</h3>

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
                <span className={`correction-badge ${estCorrect ? 'correct' : 'incorrect'}`}>
                  {estCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
              </div>

              <p className="correction-enonce">{question.texte}</p>

              <div className="correction-choix">
                {question.choix.map((choix, choixIndex) => {
                  const estBonne = choix === question.bonneReponse
                  const estJoueur = choix === reponseDonnee
                  let classe = ''
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

              {!reponseDonnee && (
                <p className="sans-reponse">⚠️ Tu n'as pas répondu à cette question.</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Boutons */}
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