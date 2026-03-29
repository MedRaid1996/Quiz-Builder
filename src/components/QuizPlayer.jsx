import { useState, useEffect } from 'react'
import calculateScore from '../utils/scoreCalculator'

// Composant qui permet à l'utilisateur de répondre au quiz avec une minuterie
function QuizPlayer({ quizTitle, questions, userAnswers, handleAnswer, handleScore, onBack }) {

  // Temps total accordé selon le nombre de questions
  const SECONDES_PAR_QUESTION = 30 * questions.length

  // État pour le temps restant
  const [tempsRestant, setTempsRestant] = useState(SECONDES_PAR_QUESTION)

  // État pour savoir si le temps est terminé
  const [tempsEcoule, setTempsEcoule] = useState(false)

  // Gère le compte à rebours du quiz
  useEffect(() => {
    if (tempsRestant <= 0) { setTempsEcoule(true); return }

    const intervalle = setInterval(() => setTempsRestant((prev) => prev - 1), 1000)

    return () => clearInterval(intervalle)
  }, [tempsRestant])

  // Transforme les secondes en format mm:ss
  const formaterTemps = (secondes) => {
    const m = Math.floor(secondes / 60)
    const s = secondes % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Nombre de questions auxquelles l'utilisateur a déjà répondu
  const nombreRepondues = Object.keys(userAnswers).length

  // Sert à changer le style de la minuterie quand il reste peu de temps
  const estUrgent = tempsRestant < SECONDES_PAR_QUESTION * 0.2

  // Calcule le score final puis l'envoie au composant parent
  const handleSubmit = () => {
    const scoreFinal = calculateScore(questions, userAnswers)
    handleScore(scoreFinal)
  }

  return (
    <div className="carte">

      {/* Partie du haut : titre, progression et temps restant */}
      <div className="player-entete">
        <div>
          <h2 className="player-titre">▶️ {quizTitle || 'Quiz sans titre'}</h2>
          <p className="player-progression">{nombreRepondues} / {questions.length} questions répondues</p>
        </div>
        <div className={`minuterie ${estUrgent ? 'urgence' : ''}`}>
          ⏱️ {tempsEcoule ? '00:00' : formaterTemps(tempsRestant)}
        </div>
      </div>

      {/* Message affiché quand le temps est terminé */}
      {tempsEcoule && (
        <div className="alerte-temps">
          ⚠️ Temps écoulé ! Tu peux quand même soumettre tes réponses.
        </div>
      )}

      {/* Affichage de toutes les questions du quiz */}
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

            {/* Liste des choix possibles pour cette question */}
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

            {/* Indique si la question a déjà reçu une réponse */}
            <div className="player-statut">
              {userAnswers[question.id]
                ? <span className="statut-ok">✅ Répondu</span>
                : <span className="statut-non">⬜ Non répondu</span>
              }
            </div>

          </div>
        ))}
      </div>

      {/* Boutons d'action en bas */}
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