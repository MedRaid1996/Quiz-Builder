import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import QuizForm from './components/QuizForm'
import QuestionForm from './components/QuestionForm'
import QuestionList from './components/QuestionList'
import QuizPlayer from './components/QuizPlayer'
import ScoreBoard from './components/ScoreBoard'
import QuestionFormRHF from './components/QuestionFormRHF'




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

  // Vue active : 'create' | 'play' | 'score'
  const [currentView, setCurrentView] = useState('create')

  // true = version react-hook-form, false = version contrôlée classique
  const [utiliserRHF, setUtiliserRHF] = useState(false)


  // --- FONCTIONS ---

  // Ajoute une nouvelle question à la liste avec un id unique
  const addQuestion = (newQuestion) => {
    const question = {
      ...newQuestion,
      id: Date.now(),
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

  // Remet tout à zéro et retourne à la vue CRÉATION
  const resetQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('create')
  }

  // Remet seulement les réponses à zéro et retourne à la vue JEU
  const recommencerQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('play')
  }

  // Lance le quiz en réinitialisant les réponses
  const startQuiz = () => {
    setUserAnswers({})
    setScore(null)
    setCurrentView('play')
  }


  // --- RENDU ---

  return (
    <div className="app-container">

      <div className="app-titre">
        <h1>🧠 Quiz Builder</h1>
        <p>Crée, joue et corrige tes questionnaires</p>
      </div>

      <nav className="nav-barre">
        <button className="nav-bouton" onClick={() => setCurrentView('create')}>
          ✏️ Créer
        </button>
        <button
          className="nav-bouton"
          onClick={startQuiz}
          disabled={questions.length === 0}
        >
          ▶️ Jouer
        </button>
      </nav>

      {currentView === 'create' && (
        <div>
          <QuizForm quizTitle={quizTitle} setQuizTitle={setQuizTitle} />

          <div className="switch-container">
            <span className="switch-label">Version du formulaire :</span>
            <button
              className={`switch-bouton ${!utiliserRHF ? 'actif-state' : ''}`}
              onClick={() => setUtiliserRHF(false)}
            >
              useState classique
            </button>
            <button
              className={`switch-bouton ${utiliserRHF ? 'actif-rhf' : ''}`}
              onClick={() => setUtiliserRHF(true)}
            >
              react-hook-form
            </button>
          </div>

          {utiliserRHF
            ? <QuestionFormRHF addQuestion={addQuestion} />
            : <QuestionForm addQuestion={addQuestion} />
          }

          <QuestionList questions={questions} deleteQuestion={deleteQuestion} />
        </div>
      )}

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