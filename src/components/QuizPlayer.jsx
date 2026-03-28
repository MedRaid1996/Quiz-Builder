import { useState, useEffect } from 'react'
import calculateScore from '../utils/scoreCalculator'

// Composant pour jouer au quiz
// Le joueur répond à chaque question et soumet ses réponses
// Props :
//   quizTitle     : titre du quiz
//   questions     : tableau des questions
//   userAnswers   : objet { id: réponse choisie }
//   handleAnswer  : fonction pour enregistrer une réponse
//   handleScore   : fonction pour envoyer le score final au parent
//   onBack        : fonction pour retourner à la vue création
function QuizPlayer({
    quizTitle,
    questions,
    userAnswers,
    handleAnswer,
    handleScore,
    onBack,
}) {

    // --- MINUTERIE ---

    // Nombre de secondes par question (ex: 30 secondes par question)
    const SECONDES_PAR_QUESTION = 30 * questions.length

    // State pour le temps restant en secondes
    const [tempsRestant, setTempsRestant] = useState(SECONDES_PAR_QUESTION)

    // State pour savoir si le temps est écoulé
    const [tempsEcoule, setTempsEcoule] = useState(false)

    // useEffect pour décompter le temps chaque seconde
    useEffect(() => {
        // Si le temps est écoulé, on arrête le décompte
        if (tempsRestant <= 0) {
            setTempsEcoule(true)
            return
        }

        // On crée un intervalle qui réduit le temps de 1 chaque seconde
        const intervalle = setInterval(() => {
            setTempsRestant((prev) => prev - 1)
        }, 1000)

        // On nettoie l'intervalle quand le composant se démonte
        return () => clearInterval(intervalle)
    }, [tempsRestant])


    // --- FONCTIONS ---

    // Convertit les secondes en format MM:SS
    const formaterTemps = (secondes) => {
        const minutes = Math.floor(secondes / 60)
        const secs = secondes % 60
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    // Calcule le nombre de questions répondues
    const nombreRepondues = Object.keys(userAnswers).length

    // Soumet les réponses et calcule le score final
    const handleSubmit = () => {
        const scoreFinal = calculateScore(questions, userAnswers)
        handleScore(scoreFinal)
    }


    // --- RENDU ---

    return (
        <div style={styles.container}>

            {/* En-tête : titre + minuterie */}
            <div style={styles.entete}>
                <div>
                    <h2 style={styles.titre}>▶️ {quizTitle || 'Quiz sans titre'}</h2>
                    <p style={styles.progression}>
                        {nombreRepondues} / {questions.length} questions répondues
                    </p>
                </div>

                {/* Minuterie */}
                <div style={{
                    ...styles.minuterie,
                    // La minuterie devient rouge quand il reste moins de 20% du temps
                    backgroundColor: tempsRestant < SECONDES_PAR_QUESTION * 0.2
                        ? '#fee2e2'
                        : '#f0fdf4',
                    borderColor: tempsRestant < SECONDES_PAR_QUESTION * 0.2
                        ? '#dc2626'
                        : '#16a34a',
                    color: tempsRestant < SECONDES_PAR_QUESTION * 0.2
                        ? '#dc2626'
                        : '#16a34a',
                }}>
                    ⏱️ {tempsEcoule ? '00:00' : formaterTemps(tempsRestant)}
                </div>
            </div>

            {/* Message si le temps est écoulé */}
            {tempsEcoule && (
                <div style={styles.alerteTemps}>
                    ⚠️ Temps écoulé ! Tu peux quand même soumettre tes réponses.
                </div>
            )}

            {/* Liste des questions */}
            <div style={styles.listeQuestions}>
                {questions.map((question, index) => (
                    <div key={question.id} style={styles.carteQuestion}>

                        {/* Énoncé de la question */}
                        <p style={styles.enonce}>
                            <span style={styles.numeroQuestion}>Q{index + 1}.</span>
                            {question.texte}
                        </p>

                        {/* Choix de réponse — formulaire contrôlé via userAnswers */}
                        <div style={styles.choixContainer}>
                            {question.choix.map((choix, choixIndex) => (
                                <label
                                    key={choixIndex}
                                    style={{
                                        ...styles.choixLabel,
                                        // On met en surbrillance le choix sélectionné
                                        backgroundColor:
                                            userAnswers[question.id] === choix
                                                ? '#e0e7ff'
                                                : '#f9fafb',
                                        borderColor:
                                            userAnswers[question.id] === choix
                                                ? '#4f46e5'
                                                : '#e5e7eb',
                                        fontWeight:
                                            userAnswers[question.id] === choix ? 'bold' : 'normal',
                                    }}
                                >
                                    {/* Radio button contrôlé */}
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={choix}
                                        checked={userAnswers[question.id] === choix}
                                        onChange={() => handleAnswer(question.id, choix)}
                                        style={styles.radio}
                                    />
                                    <span style={styles.choixNumero}>{choixIndex + 1}.</span>
                                    {choix}
                                </label>
                            ))}
                        </div>

                        {/* Indicateur si la question est répondue */}
                        <div style={styles.statutReponse}>
                            {userAnswers[question.id]
                                ? <span style={styles.reponseDonnee}>✅ Répondu</span>
                                : <span style={styles.reponseManquante}>⬜ Non répondu</span>
                            }
                        </div>

                    </div>
                ))}
            </div>

            {/* Barre d'actions */}
            <div style={styles.actions}>

                {/* Bouton retour */}
                <button onClick={onBack} style={styles.boutonRetour}>
                    ← Retour
                </button>

                {/* Bouton corriger — toujours cliquable mais avec avertissement */}
                <div style={styles.boutonCorriger}>
                    {nombreRepondues < questions.length && (
                        <p style={styles.avertissement}>
                            ⚠️ {questions.length - nombreRepondues} question(s) sans réponse
                        </p>
                    )}
                    <button
                        onClick={handleSubmit}
                        style={styles.boutonSoumettre}
                        disabled={nombreRepondues === 0}
                    >
                        ✔️ Corriger le quiz
                    </button>
                </div>

            </div>

        </div>
    )
}

// Styles inline du composant
const styles = {
    container: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    },
    entete: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    titre: {
        fontSize: '1.3rem',
        marginBottom: '0.3rem',
    },
    progression: {
        color: '#666',
        fontSize: '0.9rem',
    },
    minuterie: {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        border: '2px solid',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        letterSpacing: '0.05rem',
    },
    alerteTemps: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '0.8rem 1rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        fontWeight: 'bold',
    },
    listeQuestions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        marginBottom: '1.5rem',
    },
    carteQuestion: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#fafafa',
    },
    enonce: {
        fontSize: '1rem',
        fontWeight: '500',
        marginBottom: '0.8rem',
        display: 'flex',
        gap: '0.5rem',
    },
    numeroQuestion: {
        color: '#4f46e5',
        fontWeight: 'bold',
        minWidth: '30px',
    },
    choixContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '0.5rem',
    },
    choixLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.8rem',
        borderRadius: '6px',
        border: '1px solid',
        cursor: 'pointer',
        fontSize: '0.95rem',
        transition: 'all 0.15s',
    },
    radio: {
        accentColor: '#4f46e5',
        cursor: 'pointer',
    },
    choixNumero: {
        fontWeight: 'bold',
        color: '#555',
        minWidth: '20px',
    },
    statutReponse: {
        marginTop: '0.5rem',
        fontSize: '0.85rem',
    },
    reponseDonnee: {
        color: '#16a34a',
        fontWeight: 'bold',
    },
    reponseManquante: {
        color: '#9ca3af',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '1rem',
    },
    boutonRetour: {
        padding: '0.6rem 1.2rem',
        backgroundColor: '#f3f4f6',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    boutonCorriger: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.4rem',
    },
    avertissement: {
        color: '#d97706',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
    boutonSoumettre: {
        padding: '0.6rem 1.4rem',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
}

export default QuizPlayer