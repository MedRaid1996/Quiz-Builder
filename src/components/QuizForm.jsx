import { useRef, useState } from 'react'

// Formulaire NON CONTRÔLÉ avec useRef pour le titre du quiz
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

      <form onSubmit={handleSubmit} className="form">
        <div className="form-groupe">
          <label htmlFor="titre" className="form-label">Nom du quiz</label>
          <input
            id="titre"
            type="text"
            ref={titleRef}
            defaultValue={quizTitle}
            placeholder="Ex : Quiz JavaScript"
            className={`form-input ${feedback?.type === 'erreur' ? 'erreur' : ''}`}
          />
          {feedback && (
            <span className={feedback.type === 'erreur' ? 'form-erreur' : 'form-succes'}>
              {feedback.type === 'erreur' ? '❌' : '✅'} {feedback.message}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn-principal" style={{ alignSelf: 'flex-start' }}>
          💾 Enregistrer le titre
        </button>
      </form>
    </div>
  )
}

export default QuizForm