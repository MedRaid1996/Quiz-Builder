function QuestionList({ questions, deleteQuestion }) {

  if (questions.length === 0) {
    return (
      <div className="carte">
        <h2 className="section-titre">📋 Questions créées</h2>
        <p className="message-vide">Aucune question pour l'instant. Ajoute ta première question ci-dessus !</p>
      </div>
    )
  }

  return (
    <div className="carte">
      <h2 className="section-titre">
        📋 Questions créées
        <span className="compteur-badge">{questions.length}</span>
      </h2>

      <ul style={{ listStyle: 'none' }}>
        {questions.map((question, index) => (
          <li key={question.id} className="question-carte">

            <div className="question-carte-entete">
              <span className="question-numero">Question {index + 1}</span>
              <button onClick={() => deleteQuestion(question.id)} className="bouton-danger">
                🗑️ Supprimer
              </button>
            </div>

            <p className="question-enonce">{question.texte}</p>

            <ul style={{ listStyle: 'none' }}>
              {question.choix.map((choix, i) => (
                <li key={i} className={`choix-item ${choix === question.bonneReponse ? 'correct' : ''}`}>
                  <span className="choix-numero">{i + 1}.</span>
                  <span>{choix}</span>
                  {choix === question.bonneReponse && <span className="bonne-reponse-tag">✅ Bonne réponse</span>}
                </li>
              ))}
            </ul>

          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuestionList