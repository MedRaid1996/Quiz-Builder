function ScoreBoard({ score, questions, userAnswers, resetQuiz, recommencerQuiz }) {

  const getMessageFinal = () => {
    if (score.percentage === 100) return { texte: '🏆 Parfait ! Tu as tout bon !', couleur: 'var(--vert)' }
    if (score.percentage >= 80)  return { texte: '🎉 Excellent résultat !', couleur: 'var(--vert)' }
    if (score.percentage >= 60)  return { texte: '👍 Bon travail, continue !', couleur: 'var(--orange)' }
    if (score.percentage >= 40)  return { texte: '📚 Pas mal, mais révise encore !', couleur: 'var(--orange)' }
    return { texte: '💪 Courage, tu feras mieux !', couleur: 'var(--rouge)' }
  }

  const getCouleurBarre = () => {
    if (score.percentage >= 80) return 'linear-gradient(90deg, var(--vert), #047857)'
    if (score.percentage >= 60) return 'linear-gradient(90deg, var(--orange), #b45309)'
    return 'linear-gradient(90deg, var(--rouge), #991b1b)'
  }

  const messageFinal = getMessageFinal()

  return (
    <div className="carte">

      <div className="score-entete">
        <h2 className="section-titre" style={{ justifyContent: 'center' }}>📊 Résultats</h2>
        <p className="score-message" style={{ color: messageFinal.couleur }}>{messageFinal.texte}</p>
        <p>
          <span className="score-chiffre">{score.correct}</span>
          <span className="score-sur"> / {score.total}</span>
        </p>
        <p className="score-pourcentage" style={{ color: messageFinal.couleur }}>{score.percentage}%</p>
        <div className="barre-score-container">
          <div className="barre-score-fill" style={{ width: `${score.percentage}%`, background: getCouleurBarre() }} />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="section-titre">🔍 Correction détaillée</h3>

        {questions.map((question, index) => {
          const reponseDonnee = userAnswers[question.id]
          const estCorrect = reponseDonnee === question.bonneReponse

          return (
            <div key={question.id} className="correction-carte" style={{ borderLeftColor: estCorrect ? 'var(--vert)' : 'var(--rouge)' }}>
              <div className="correction-entete">
                <span className="correction-numero">Question {index + 1}</span>
                <span className={`badge-correct ${estCorrect ? 'ok' : 'ko'}`}>
                  {estCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
              </div>

              <p className="question-enonce">{question.texte}</p>

              <div>
                {question.choix.map((choix, i) => {
                  const estBonne = choix === question.bonneReponse
                  const estChoixJoueur = choix === reponseDonnee

                  let fond = '#f9fafb', bord = 'var(--bordure)', texte = 'var(--texte)'
                  if (estBonne) { fond = 'var(--vert-clair)'; bord = 'var(--vert)'; texte = 'var(--vert)' }
                  else if (estChoixJoueur) { fond = 'var(--rouge-clair)'; bord = 'var(--rouge)'; texte = 'var(--rouge)' }

                  return (
                    <div key={i} className="correction-choix" style={{ backgroundColor: fond, borderColor: bord, color: texte }}>
                      <span style={{ fontWeight: 700, minWidth: '20px' }}>{i + 1}.</span>
                      <span>{choix}</span>
                      <span className="icone-choix">
                        {estBonne && '✅'}
                        {estChoixJoueur && !estBonne && '❌'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {!reponseDonnee && <p className="sans-reponse">⚠️ Tu n'as pas répondu à cette question.</p>}
            </div>
          )
        })}
      </div>

      <div className="score-actions">
        <button onClick={recommencerQuiz} className="bouton-principal">🔄 Rejouer ce quiz</button>
        <button onClick={resetQuiz} className="bouton-secondaire">✏️ Créer un nouveau quiz</button>
      </div>

    </div>
  )
}

export default ScoreBoard