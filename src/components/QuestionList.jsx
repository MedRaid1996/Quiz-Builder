// Composant qui affiche toutes les questions ajoutées
function QuestionList({ questions, deleteQuestion }) {

  // Si aucune question n'existe encore, on affiche un message vide
  if (questions.length === 0) {
    return (
      <div className="carte">
        <h2 className="section-titre">📋 Questions créées</h2>
        <p className="vide-message">Aucune question pour l'instant. Ajoute ta première question ci-dessus !</p>
      </div>
    )
  }

  return (
    <div className="carte">
      <h2 className="section-titre">
        📋 Questions créées
        <span className="compteur">{questions.length}</span>
      </h2>

      <ul className="questions-liste">
        {questions.map((question, index) => (
          <li key={question.id} className="question-carte">

            <div className="question-carte-entete">
              <span className="question-numero">Question {index + 1}</span>

              {/* Bouton pour supprimer la question */}
              <button
                onClick={() => deleteQuestion(question.id)}
                className="btn btn-danger"
              >
                🗑️ Supprimer
              </button>
            </div>

            {/* Affiche l'énoncé de la question */}
            <p className="question-enonce">{question.texte}</p>

            {/* Affiche tous les choix de réponse */}
            <ul className="choix-liste">
              {question.choix.map((choix, choixIndex) => (
                <li
                  key={choixIndex}
                  className={`choix-item ${choix === question.bonneReponse ? 'bonne-reponse' : ''}`}
                >
                  <span className="choix-item-numero">{choixIndex + 1}.</span>
                  <span>{choix}</span>

                  {/* Indique visuellement la bonne réponse */}
                  {choix === question.bonneReponse && (
                    <span className="bonne-reponse-tag">✅ Bonne réponse</span>
                  )}
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