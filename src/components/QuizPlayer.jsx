import { useState, useEffect } from 'react'
import calculateScore from '../utils/scoreCalculator'

function QuizPlayer({ quizTitle, questions, userAnswers, handleAnswer, handleScore, onBack }) {

  const SECONDES_TOTAL = 30 * questions.length
  const [tempsRestant, setTempsRestant] = useState(SECONDES_TOTAL)
  const [tempsEcoule, setTempsEcoule] = useState(false)

  useEffect(() => {
    if (tempsRestant <= 0) { setTempsEcoule(true); return }
    const intervalle = setInterval(() => setTempsRestant(prev => prev - 1), 1000)
    return () => clearInterval(intervalle)
  }, [tempsRestant])

  const formaterTemps = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const nombreRepondues = Object.keys(userAnswers).length
  const progression = Math.round((nombreRepondues / questions.length) * 100)

  const handleSubmit = () => handleScore(calculateScore(questions, userAnswers))

  return (
    <div className="carte">

      <div className="player-entete">
        <div>
          <div className="player-titre">▶️ {quizTitle || 'Quiz sans titre'}</div>
          <div className="player-progression">{nombreRepondues} / {questions.length} questions répondues</div>
        </div>
        <div className={`minuterie ${tempsRestant < SECONDES_TOTAL * 0.2 ? 'alerte' : 'ok'}`}>
          ⏱️ {tempsEcoule ? '00:00' : formaterTemps(tempsRestant)}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="barre-progression-container">
        <div className="barre-progression-fill" style={{ width: `${progression}%` }} />
      </div>

      {tempsEcoule && (
        <div className="alerte-temps">⚠️ Temps écoulé ! Tu peux quand même soumettre tes réponses.</div>
      )}

      <div>
        {questions.map((question, index) => (
          <div key={question.id} className={`player-question-carte ${userAnswers[question.id] ? 'repondue' : ''}`}>
            <p className="player-enonce">
              <span className="player-numero">Q{index + 1}.</span>
              {question.texte}
            </p>

            <div>
              {question.choix.map((choix, i) => (
                <label key={i} className={`choix-label ${userAnswers[question.id] === choix ? 'selectionne' : ''}`}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={choix}
                    checked={userAnswers[question.id] === choix}
                    onChange={() => handleAnswer(question.id, choix)}
                    className="choix-radio"
                  />
                  <span style={{ fontWeight: 700, color: 'var(--violet)', minWidth: '20px' }}>{i + 1}.</span>
                  {choix}
                </label>
              ))}
            </div>

            <div className="statut-reponse">
              {userAnswers[question.id]
                ? <span className="statut-ok">✅ Répondu</span>
                : <span className="statut-manquant">⬜ Non répondu</span>
              }
            </div>
          </div>
        ))}
      </div>

      <div className="player-actions">
        <button onClick={onBack} className="bouton-secondaire">← Retour</button>
        <div>
          {nombreRepondues < questions.length && (
            <p className="avertissement-reponses">
              ⚠️ {questions.length - nombreRepondues} question(s) sans réponse
            </p>
          )}
          <button onClick={handleSubmit} className="bouton-principal" disabled={nombreRepondues === 0}>
            ✔️ Corriger le quiz
          </button>
        </div>
      </div>

    </div>
  )
}

export default QuizPlayer