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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        🧠 Quiz Builder
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

          {/* Bouton switch entre les deux versions de formulaire */}
          <div style={styles.switchContainer}>
            <span style={styles.switchLabel}>Version du formulaire :</span>
            <button
              onClick={() => setUtiliserRHF(false)}
              style={{
                ...styles.switchBouton,
                backgroundColor: !utiliserRHF ? '#4f46e5' : '#f3f4f6',
                color: !utiliserRHF ? '#fff' : '#333',
              }}
            >
              useState classique
            </button>
            <button
              onClick={() => setUtiliserRHF(true)}
              style={{
                ...styles.switchBouton,
                backgroundColor: utiliserRHF ? '#b45309' : '#f3f4f6',
                color: utiliserRHF ? '#fff' : '#333',
              }}
            >
              react-hook-form
            </button>
          </div>

          {/* Affiche la version sélectionnée */}
          {utiliserRHF
            ? <QuestionFormRHF addQuestion={addQuestion} />
            : <QuestionForm addQuestion={addQuestion} />
          }

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
          recommencerQuiz={recommencerQuiz}
        />
      )}

    </div>
  )
}

const styles = {
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  switchLabel: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#555',
  },
  switchBouton: {
    padding: '0.4rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
}

export default App