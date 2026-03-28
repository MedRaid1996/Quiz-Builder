import { useRef, useState } from 'react'

// Composant formulaire pour saisir le titre du quiz
// Utilise un formulaire NON CONTRÔLÉ avec useRef
// Props : quizTitle (titre actuel), setQuizTitle (fonction de mise à jour)
function QuizForm({ quizTitle, setQuizTitle }) {

    // useRef pour accéder à la valeur du champ sans contrôler le state
    const titleRef = useRef(null)

    // State pour gérer le message de retour (erreur ou succès)
    // { type: 'erreur' | 'succes', message: string } ou null
    const [feedback, setFeedback] = useState(null)

    // Fonction appelée à la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault() // empêche le rechargement de la page

        const valeur = titleRef.current.value.trim()

        // Validation : le titre ne doit pas être vide
        if (valeur === '') {
            // On affiche l'erreur et on efface tout message de succès
            setFeedback({ type: 'erreur', message: 'Le titre du quiz ne peut pas être vide.' })
            return
        }

        // Si valide : on met à jour le titre et on affiche le succès
        setQuizTitle(valeur)
        setFeedback({ type: 'succes', message: `Titre enregistré : "${valeur}"` })
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.titre}>📝 Titre du quiz</h2>

            <form onSubmit={handleSubmit} style={styles.form}>

                <div style={styles.groupe}>
                    <label htmlFor="titre" style={styles.label}>
                        Nom du quiz
                    </label>

                    {/* Champ non contrôlé : ref au lieu de value + onChange */}
                    <input
                        id="titre"
                        type="text"
                        ref={titleRef}
                        defaultValue={quizTitle}
                        placeholder="Ex : Quiz JavaScript"
                        style={styles.input}
                    />

                    {/* Affiche UNE SEULE zone de message selon le type */}
                    {feedback !== null && (
                        <span style={feedback.type === 'erreur' ? styles.erreur : styles.succes}>
                            {feedback.type === 'erreur' ? '❌' : '✅'} {feedback.message}
                        </span>
                    )}
                </div>

                <button type="submit" style={styles.bouton}>
                    💾 Enregistrer le titre
                </button>

            </form>

        </div>
    )
}

// Styles inline du composant
const styles = {
    container: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    },
    titre: {
        marginBottom: '1rem',
        fontSize: '1.2rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    groupe: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    label: {
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    input: {
        padding: '0.6rem 0.8rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        outline: 'none',
    },
    erreur: {
        color: 'red',
        fontSize: '0.85rem',
    },
    succes: {
        color: '#16a34a',
        fontSize: '0.85rem',
    },
    bouton: {
        padding: '0.6rem 1.2rem',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
}

export default QuizForm