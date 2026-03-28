// Composant pour afficher la liste de toutes les questions créées
// Props : questions (tableau), deleteQuestion (fonction de suppression)
function QuestionList({ questions, deleteQuestion }) {

    // Si aucune question n'a été créée, on affiche un message
    if (questions.length === 0) {
        return (
            <div style={styles.container}>
                <h2 style={styles.titre}>📋 Questions créées</h2>
                <p style={styles.vide}>
                    Aucune question pour l'instant. Ajoute ta première question ci-dessus !
                </p>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.titre}>
                📋 Questions créées
                {/* Affiche le nombre total de questions */}
                <span style={styles.compteur}>{questions.length}</span>
            </h2>

            {/* On boucle sur chaque question pour l'afficher */}
            <ul style={styles.liste}>
                {questions.map((question, index) => (
                    <li key={question.id} style={styles.carte}>

                        {/* En-tête de la carte : numéro + bouton supprimer */}
                        <div style={styles.carteEntete}>
                            <span style={styles.numero}>Question {index + 1}</span>
                            <button
                                onClick={() => deleteQuestion(question.id)}
                                style={styles.boutonSupprimer}
                                title="Supprimer cette question"
                            >
                                🗑️ Supprimer
                            </button>
                        </div>

                        {/* Énoncé de la question */}
                        <p style={styles.enonce}>{question.texte}</p>

                        {/* Liste des choix de réponse */}
                        <ul style={styles.choixListe}>
                            {question.choix.map((choix, choixIndex) => (
                                <li
                                    key={choixIndex}
                                    style={{
                                        ...styles.choixItem,
                                        // On met en vert le choix qui est la bonne réponse
                                        backgroundColor:
                                            choix === question.bonneReponse ? '#dcfce7' : '#f9fafb',
                                        borderColor:
                                            choix === question.bonneReponse ? '#16a34a' : '#e5e7eb',
                                    }}
                                >
                                    {/* Numéro du choix */}
                                    <span style={styles.choixNumero}>{choixIndex + 1}.</span>
                                    <span>{choix}</span>

                                    {/* Indicateur visuel de la bonne réponse */}
                                    {choix === question.bonneReponse && (
                                        <span style={styles.bonneReponseTag}>✅ Bonne réponse</span>
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
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    compteur: {
        backgroundColor: '#4f46e5',
        color: '#fff',
        borderRadius: '999px',
        padding: '0.1rem 0.6rem',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
    vide: {
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: '1rem 0',
    },
    liste: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    carte: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#fafafa',
    },
    carteEntete: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
    },
    numero: {
        fontWeight: 'bold',
        color: '#4f46e5',
        fontSize: '0.9rem',
    },
    boutonSupprimer: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: 'none',
        borderRadius: '6px',
        padding: '0.3rem 0.7rem',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
    enonce: {
        fontSize: '1rem',
        marginBottom: '0.8rem',
        fontWeight: '500',
    },
    choixListe: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    choixItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        fontSize: '0.95rem',
    },
    choixNumero: {
        fontWeight: 'bold',
        color: '#555',
        minWidth: '20px',
    },
    bonneReponseTag: {
        marginLeft: 'auto',
        fontSize: '0.8rem',
        color: '#16a34a',
        fontWeight: 'bold',
    },
}

export default QuestionList