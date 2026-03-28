import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import QuizForm from './components/QuizForm'
import QuestionForm from './components/QuestionForm'
import QuestionList from './components/QuestionList'
import QuizPlayer from './components/QuizPlayer'
import ScoreBoard from './components/ScoreBoard'

function App() {

  // --- STATE GLOBAL ---

  // Titre du quiz — sauvegardé dans localStorage
  const [quizTitle, setQuizTitle] = useLocalStorage('quizTitle', '')

  // Liste des questions — sauvegardée dans localStorage
  const [questions, setQuestions] = useLocalStorage('questions', [])

  // Réponses du joueur pendant le quiz — { id: 'réponse choisie' }
  const [userAnswers, setUserAnswers] = useState({})

  // Résultat final après correction — { correct, total, percentage }
  const [score, setScore] = useState(null)

  // Vue active : 'create' (création) | 'play' (jeu) | 'score' (résultats)
  const [currentView, setCurrentView] = useState('create')


  // --- FONCTIONS ---

  // Ajoute une nouvelle question à la liste avec un id unique
  const addQuestion = (newQuestion) => {
    const question = {
      ...newQuestion,
      id: Date.now(), // timestamp comme identifiant unique
    }
    setQuestions([...questions, question])
  }

  // Supprime une question par son id
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  // Enregistre la réponse du joueur pour une question donnée
  const handleAnswer = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer })
  }

  // Reçoit le score calculé depuis QuizPlayer et affiche la vue score
  const handleScore = (finalScore) => {
    setScore(finalScore)
    setCurrentView('score')
  }

  // Remet tout à zéro et retourne à la vue création
  const resetQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('create')
  }

  // Lance le quiz en réinitialisant les réponses et en allant à la vue jeu
  const startQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('play')
  }


  // --- RENDU ---

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        Quiz Builder
      </h1>

      {/* Barre de navigation entre les vues */}
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <button onClick={() => setCurrentView('create')}>
          ✏️ Créer
        </button>
        {/* Le bouton Jouer est désactivé s'il n'y a aucune question */}
        <button
          onClick={startQuiz}
          disabled={questions.length === 0}
        >
          ▶️ Jouer
        </button>
      </nav>

      {/* Vue Création : formulaire titre + formulaire question + liste */}
      {currentView === 'create' && (
        <div>
          <QuizForm
            quizTitle={quizTitle}
            setQuizTitle={setQuizTitle}
          />
          <QuestionForm addQuestion={addQuestion} />
          <QuestionList
            questions={questions}
            deleteQuestion={deleteQuestion}
          />
        </div>
      )}

      {/* Vue Jeu : le joueur répond aux questions */}
      {currentView === 'play' && (
        <QuizPlayer
          quizTitle={quizTitle}
          questions={questions}
          userAnswers={userAnswers}
          handleAnswer={handleAnswer}
          handleScore={handleScore}
          onBack={() => setCurrentView('create')}
        />
      )}

      {/* Vue Score : affichage du résultat final */}
      {currentView === 'score' && (
        <ScoreBoard
          score={score}
          questions={questions}
          userAnswers={userAnswers}
          resetQuiz={resetQuiz}
        />
      )}

    </div>
  )
}

export default App