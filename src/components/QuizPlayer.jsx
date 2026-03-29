import { useState, useEffect } from 'react'
import calculateScore from '../utils/scoreCalculator'

// Composant pour jouer au quiz avec minuterie
function QuizPlayer({ quizTitle, questions, userAnswers, handleAnswer, handleScore, onBack }) {

  const SECONDES_PAR_QUESTION = 30 * questions.length
  const [tempsRestant, setTempsRestant] = useState(SECONDES_PAR_QUESTION)
  const [tempsEcoule, setTempsEcoule] = useState(false)

  useEffect(() => {
    if (tempsRestant <= 0) { setTempsEcoule(true); return }
    const intervalle = setInterval(() => setTempsRestant((prev) => prev - 1), 1000)
    return () => clearInterval(intervalle)
  }, [tempsRestant])

  const formaterTemps = (secondes) => {
    const m = Math.floor(secondes / 60)
    const s = secondes % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const nombreRepondues = Object.keys(userAnswers).length
  const estUrgent = tempsRestant < SECONDES_PAR_QUESTION * 0.2

  const handleSubmit = () => {
    const scoreFinal = calculateScore(questions, userAnswers)
    handleScore(scoreFinal)
  }

  return (
    <div className="carte">

      {/* En-tête */}
      <div className="player-entete">
        <div>
          <h2 className="player-titre">▶️ {quizTitle || 'Quiz sans titre'}</h2>
          <p className="player-progression">{nombreRepondues} / {questions.length} questions répondues</p>
        </div>
        <div className={`minuterie ${estUrgent ? 'urgence' : ''}`}>
          ⏱️ {tempsEcoule ? '00:00' : formaterTemps(tempsRestant)}
        </div>
      </div>

      {/* Alerte temps écoulé */}
      {tempsEcoule && (
        <div className="alerte-temps">
          ⚠️ Temps écoulé ! Tu peux quand même soumettre tes réponses.
        </div>
      )}

      {/* Liste des questions */}
      <div className="player-questions">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`player-carte ${userAnswers[question.id] ? 'repondue' : ''}`}
          >
            <p className="player-enonce">
              <span className="player-question-numero">Q{index + 1}.</span>
              {question.texte}
            </p>

            <div className="player-choix-container">
              {question.choix.map((choix, choixIndex) => (
                <label
                  key={choixIndex}
                  className={`player-choix-label ${userAnswers[question.id] === choix ? 'selectionne' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={choix}
                    checked={userAnswers[question.id] === choix}
                    onChange={() => handleAnswer(question.id, choix)}
                    style={{ accentColor: '#7c3aed', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 'bold', color: '#9ca3af', minWidth: '20px' }}>
                    {choixIndex + 1}.
                  </span>
                  {choix}
                </label>
              ))}
            </div>

            <div className="player-statut">
              {userAnswers[question.id]
                ? <span className="statut-ok">✅ Répondu</span>
                : <span className="statut-non">⬜ Non répondu</span>
              }
            </div>

          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="player-actions">
        <button onClick={onBack} className="btn btn-neutre">← Retour</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          {nombreRepondues < questions.length && (
            <p className="player-avertissement">
              ⚠️ {questions.length - nombreRepondues} question(s) sans réponse
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={nombreRepondues === 0}
            className="btn btn-principal"
          >
            ✔️ Corriger le quiz
          </button>
        </div>
      </div>

    </div>
  )
}

export default QuizPlayer