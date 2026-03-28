import { useRef, useState } from 'react'

function QuizForm({ quizTitle, setQuizTitle }) {

  const titleRef = useRef(null)
  const [feedback, setFeedback] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const valeur = titleRef.current.value.trim()

    if (valeur === '') {
      setFeedback({ type: 'erreur', message: 'Le titre du quiz ne peut pas être vide.' })
      return
    }

    setQuizTitle(valeur)
    setFeedback({ type: 'succes', message: `Titre enregistré : "${valeur}"` })
  }

  return (
    <div className="carte">
      <h2 className="section-titre">📝 Titre du quiz</h2>

      <form onSubmit={handleSubmit}>
        <div className="champ-groupe">
          <label htmlFor="titre" className="champ-label">Nom du quiz</label>
          <input
            id="titre"
            type="text"
            ref={titleRef}
            defaultValue={quizTitle}
            placeholder="Ex : Quiz JavaScript"
            className="champ-input"
          />
          {feedback && (
            <div className={`feedback-msg ${feedback.type}`}>
              {feedback.type === 'erreur' ? '❌' : '✅'} {feedback.message}
            </div>
          )}
        </div>

        <button type="submit" className="bouton-principal">
          💾 Enregistrer le titre
        </button>
      </form>
    </div>
  )
}

export default QuizForm