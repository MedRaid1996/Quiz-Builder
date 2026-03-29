import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import QuizForm from './components/QuizForm'
import QuestionForm from './components/QuestionForm'
import QuestionFormRHF from './components/QuestionFormRHF'
import QuestionList from './components/QuestionList'
import QuizPlayer from './components/QuizPlayer'
import ScoreBoard from './components/ScoreBoard'

function App() {

  // --- STATE GLOBAL ---

  // Titre du quiz — sauvegardé dans localStorage
  const [quizTitle, setQuizTitle] = useLocalStorage('quizTitle', '')

  // Liste des questions — sauvegardée dans localStorage
  const [questions, setQuestions] = useLocalStorage('questions', [])

  // Réponses du joueur pendant le quiz
  const [userAnswers, setUserAnswers] = useState({})

  // Résultat final après correction
  const [score, setScore] = useState(null)

  // Vue active : 'create' | 'play' | 'score'
  const [currentView, setCurrentView] = useState('create')

  // Choix de la version du formulaire : false = classique, true = RHF
  const [utiliserRHF, setUtiliserRHF] = useState(false)


  // --- FONCTIONS ---

  // Ajoute une nouvelle question avec un id unique
  const addQuestion = (newQuestion) => {
    setQuestions([...questions, { ...newQuestion, id: Date.now() }])
  }

  // Supprime une question par son id
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  // Enregistre la réponse du joueur pour une question
  const handleAnswer = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer })
  }

  // Reçoit le score et affiche la vue score
  const handleScore = (finalScore) => {
    setScore(finalScore)
    setCurrentView('score')
  }

  // Remet tout à zéro → vue création
  const resetQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('create')
  }

  // Remet les réponses à zéro → vue jeu
  const recommencerQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('play')
  }

  // Lance le quiz
  const startQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('play')
  }


  // --- RENDU ---

  return (
    <div className="app-container">

      {/* En-tête */}
      <div className="app-header">
        <h1 className="app-titre">🧠 Quiz Builder</h1>
        <p className="app-sous-titre">Crée et joue à tes propres questionnaires</p>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <button
          className={`nav-btn ${currentView === 'create' ? 'actif' : ''}`}
          onClick={() => setCurrentView('create')}
        >
          ✏️ Créer
        </button>
        <button
          className={`nav-btn ${currentView === 'play' ? 'actif' : ''}`}
          onClick={startQuiz}
          disabled={questions.length === 0}
        >
          ▶️ Jouer
        </button>
      </nav>

      {/* Vue Création */}
      {currentView === 'create' && (
        <div>
          <QuizForm quizTitle={quizTitle} setQuizTitle={setQuizTitle} />

          {/* Switch entre les deux versions de formulaire */}
          <div className="switch-container">
            <span className="switch-label">Version du formulaire :</span>
            <button
              className={`switch-btn ${!utiliserRHF ? 'actif-violet' : ''}`}
              onClick={() => setUtiliserRHF(false)}
            >
              useState classique
            </button>
            <button
              className={`switch-btn ${utiliserRHF ? 'actif-orange' : ''}`}
              onClick={() => setUtiliserRHF(true)}
            >
              react-hook-form
            </button>
          </div>

          {/* Formulaire selon la version choisie */}
          {utiliserRHF
            ? <QuestionFormRHF addQuestion={addQuestion} />
            : <QuestionForm addQuestion={addQuestion} />
          }

          <QuestionList questions={questions} deleteQuestion={deleteQuestion} />
        </div>
      )}

      {/* Vue Jeu */}
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

      {/* Vue Score */}
      {currentView === 'score' && (
        <ScoreBoard
          score={score}
          questions={questions}
          userAnswers={userAnswers}
          resetQuiz={resetQuiz}
          recommencerQuiz={recommencerQuiz}
        />
      )}

    </div>
  )
}

export default App