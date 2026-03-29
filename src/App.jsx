import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import QuizForm from './components/QuizForm'
import QuestionForm from './components/QuestionForm'
import QuestionList from './components/QuestionList'
import QuizPlayer from './components/QuizPlayer'
import ScoreBoard from './components/ScoreBoard'

function App() {

  // --- STATE GLOBAL ---

  // Titre du quiz (sauvegardé dans le localStorage)
  const [quizTitle, setQuizTitle] = useLocalStorage('quizTitle', '')

  // Liste des questions (aussi sauvegardée dans le localStorage)
  const [questions, setQuestions] = useLocalStorage('questions', [])

  // Stocke les réponses choisies par l'utilisateur pendant le quiz
  const [userAnswers, setUserAnswers] = useState({})

  // Contient le score final après correction
  const [score, setScore] = useState(null)

  // Permet de savoir quelle vue afficher (création, jeu ou score)
  const [currentView, setCurrentView] = useState('create')


  // --- FONCTIONS ---

  // Ajoute une nouvelle question avec un identifiant unique
  const addQuestion = (newQuestion) => {
    setQuestions([...questions, { ...newQuestion, id: Date.now() }])
  }

  // Supprime une question en utilisant son id
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  // Enregistre la réponse de l'utilisateur pour une question donnée
  const handleAnswer = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer })
  }

  // Reçoit le score calculé et change la vue vers l'écran de résultat
  const handleScore = (finalScore) => {
    setScore(finalScore)
    setCurrentView('score')
  }

  // Réinitialise le quiz et retourne à la vue de création
  const resetQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('create')
  }

  // Permet de rejouer le quiz sans supprimer les questions
  const recommencerQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('play')
  }

  // Lance le quiz depuis le début
  const startQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('play')
  }

  // Supprime toutes les données sauvegardées et remet l'application à zéro
  const reinitialiserTout = () => {
    if (window.confirm('Es-tu sûr de vouloir tout effacer ?')) {
      localStorage.removeItem('quizTitle')
      localStorage.removeItem('questions')
      setQuizTitle('')
      setQuestions([])
      setUserAnswers({})
      setScore(null)
      setCurrentView('create')
    }
  }


  // --- RENDU ---

  return (
    <div className="app-container">

      {/* En-tête de l'application */}
      <div className="app-header">
        <h1 className="app-titre">🧠 Quiz Builder</h1>
        <p className="app-sous-titre">Crée et joue à tes propres questionnaires</p>
      </div>

      {/* Menu de navigation */}
      <nav className="nav">
        <button
          className={`nav-btn ${currentView === 'create' ? 'actif' : ''}`}
          onClick={() => setCurrentView('create')}
        >
          ✏️ Créer
        </button>

        {/* Bouton pour lancer le quiz (désactivé s'il n'y a pas de questions) */}
        <button
          className={`nav-btn ${currentView === 'play' ? 'actif' : ''}`}
          onClick={startQuiz}
          disabled={questions.length === 0}
        >
          ▶️ Jouer
        </button>

        {/* Bouton pour tout supprimer */}
        <button
          className="nav-btn"
          onClick={reinitialiserTout}
          style={{ background: 'rgba(220,38,38,0.3)', borderColor: 'rgba(220,38,38,0.5)' }}
        >
          🗑️ Tout effacer
        </button>
      </nav>

      {/* Vue de création du quiz */}
      {currentView === 'create' && (
        <div>
          {/* Formulaire du titre (react-hook-form) */}
          <QuizForm quizTitle={quizTitle} setQuizTitle={setQuizTitle} />

          {/* Formulaire des questions (useState classique) */}
          <QuestionForm addQuestion={addQuestion} />

          {/* Liste des questions créées */}
          <QuestionList questions={questions} deleteQuestion={deleteQuestion} />
        </div>
      )}

      {/* Vue de jeu */}
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

      {/* Vue des résultats */}
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