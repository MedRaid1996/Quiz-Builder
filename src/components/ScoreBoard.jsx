// Composant pour afficher le score final et la correction détaillée
// Props :
//   score           : objet { correct, total, percentage }
//   questions       : tableau des questions
//   userAnswers     : objet { id: réponse choisie }
//   resetQuiz       : retourne à la vue création
//   recommencerQuiz : retourne à la vue jeu sans toucher aux questions
function ScoreBoard({ score, questions, userAnswers, resetQuiz, recommencerQuiz }) {

    // --- MESSAGE FINAL selon le pourcentage ---
    const getMessageFinal = () => {
        if (score.percentage === 100) {
            return { texte: '🏆 Parfait ! Tu as tout bon !', couleur: '#16a34a' }
        } else if (score.percentage >= 80) {
            return { texte: '🎉 Excellent résultat !', couleur: '#16a34a' }
        } else if (score.percentage >= 60) {
            return { texte: '👍 Bon travail, continue !', couleur: '#d97706' }
        } else if (score.percentage >= 40) {
            return { texte: '📚 Pas mal, mais révise encore !', couleur: '#d97706' }
        } else {
            return { texte: '💪 Courage, tu feras mieux la prochaine fois !', couleur: '#dc2626' }
        }
    }

    const messageFinal = getMessageFinal()

    // Couleur de la barre de progression selon le pourcentage
    const getCouleurBarre = () => {
        if (score.percentage >= 80) return '#16a34a'
        if (score.percentage >= 60) return '#d97706'
        return '#dc2626'
    }

    return (
        <div style={styles.container}>

            {/* --- EN-TÊTE : score global --- */}
            <div style={styles.entete}>
                <h2 style={styles.titre}>📊 Résultats</h2>

                {/* Message final selon la note */}
                <p style={{ ...styles.messageFinal, color: messageFinal.couleur }}>
                    {messageFinal.texte}
                </p>

                {/* Score en chiffres */}
                <p style={styles.scoreChiffres}>
                    <span style={styles.scoreGrand}>{score.correct}</span>
                    <span style={styles.scoreSur}> / {score.total}</span>
                </p>

                {/* Score en pourcentage */}
                <p style={{ ...styles.pourcentage, color: getCouleurBarre() }}>
                    {score.percentage}%
                </p>

                {/* Barre de progression visuelle */}
                <div style={styles.barreContainer}>
                    <div
                        style={{
                            ...styles.barreFill,
                            width: `${score.percentage}%`,
                            backgroundColor: getCouleurBarre(),
                        }}
                    />
                </div>

            </div>

            {/* --- CORRECTION DÉTAILLÉE --- */}
            <div style={styles.correction}>
                <h3 style={styles.sousTitre}>🔍 Correction détaillée</h3>

                <div style={styles.listeQuestions}>
                    {questions.map((question, index) => {

                        // Réponse donnée par le joueur pour cette question
                        const reponseDonnee = userAnswers[question.id]

                        // Est-ce que la réponse est correcte ?
                        const estCorrect = reponseDonnee === question.bonneReponse

                        return (
                            <div
                                key={question.id}
                                style={{
                                    ...styles.carteQuestion,
                                    borderLeftColor: estCorrect ? '#16a34a' : '#dc2626',
                                    borderLeftWidth: '4px',
                                }}
                            >

                                {/* En-tête de la carte : numéro + statut */}
                                <div style={styles.carteEntete}>
                                    <span style={styles.numeroQuestion}>
                                        Question {index + 1}
                                    </span>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: estCorrect ? '#dcfce7' : '#fee2e2',
                                        color: estCorrect ? '#16a34a' : '#dc2626',
                                    }}>
                                        {estCorrect ? '✅ Correct' : '❌ Incorrect'}
                                    </span>
                                </div>

                                {/* Énoncé */}
                                <p style={styles.enonce}>{question.texte}</p>

                                {/* Affichage des choix avec code couleur */}
                                <div style={styles.choixContainer}>
                                    {question.choix.map((choix, choixIndex) => {

                                        // Est-ce la bonne réponse ?
                                        const estBonneReponse = choix === question.bonneReponse

                                        // Est-ce la réponse donnée par le joueur ?
                                        const estReponseJoueur = choix === reponseDonnee

                                        // Couleur du choix selon son statut
                                        let couleurFond = '#f9fafb'
                                        let couleurBord = '#e5e7eb'
                                        let couleurTexte = '#333'

                                        if (estBonneReponse) {
                                            // Toujours vert pour la bonne réponse
                                            couleurFond = '#dcfce7'
                                            couleurBord = '#16a34a'
                                            couleurTexte = '#16a34a'
                                        } else if (estReponseJoueur && !estBonneReponse) {
                                            // Rouge si le joueur a choisi une mauvaise réponse
                                            couleurFond = '#fee2e2'
                                            couleurBord = '#dc2626'
                                            couleurTexte = '#dc2626'
                                        }

                                        return (
                                            <div
                                                key={choixIndex}
                                                style={{
                                                    ...styles.choixItem,
                                                    backgroundColor: couleurFond,
                                                    borderColor: couleurBord,
                                                    color: couleurTexte,
                                                }}
                                            >
                                                <span style={styles.choixNumero}>{choixIndex + 1}.</span>
                                                <span>{choix}</span>

                                                {/* Icônes indicatrices */}
                                                <span style={styles.iconeChoix}>
                                                    {estBonneReponse && '✅'}
                                                    {estReponseJoueur && !estBonneReponse && '❌'}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Message si le joueur n'a pas répondu */}
                                {!reponseDonnee && (
                                    <p style={styles.sansReponse}>
                                        ⚠️ Tu n'as pas répondu à cette question.
                                    </p>
                                )}

                            </div>
                        )
                    })}
                </div>
            </div>

            {/* --- BOUTONS D'ACTION --- */}
            <div style={styles.actions}>

                {/* Rejouer le MÊME quiz sans toucher aux questions */}
                <button onClick={recommencerQuiz} style={styles.boutonRecommencer}>
                    🔄 Rejouer ce quiz
                </button>

                {/* Retourner à la création et tout réinitialiser */}
                <button onClick={resetQuiz} style={styles.boutonCreer}>
                    ✏️ Créer un nouveau quiz
                </button>

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
        textAlign: 'center',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
    },
    titre: {
        fontSize: '1.4rem',
        marginBottom: '0.5rem',
    },
    messageFinal: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    scoreChiffres: {
        marginBottom: '0.3rem',
    },
    scoreGrand: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#4f46e5',
    },
    scoreSur: {
        fontSize: '1.5rem',
        color: '#888',
    },
    pourcentage: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        marginBottom: '0.8rem',
    },
    barreContainer: {
        width: '100%',
        height: '12px',
        backgroundColor: '#e5e7eb',
        borderRadius: '999px',
        overflow: 'hidden',
        maxWidth: '400px',
        margin: '0 auto',
    },
    barreFill: {
        height: '100%',
        borderRadius: '999px',
        transition: 'width 0.5s ease',
    },
    correction: {
        marginBottom: '1.5rem',
    },
    sousTitre: {
        fontSize: '1.1rem',
        marginBottom: '1rem',
        color: '#444',
    },
    listeQuestions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    carteQuestion: {
        border: '1px solid #e5e7eb',
        borderLeftStyle: 'solid',
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
    numeroQuestion: {
        fontWeight: 'bold',
        color: '#4f46e5',
        fontSize: '0.9rem',
    },
    badge: {
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
    enonce: {
        fontSize: '1rem',
        fontWeight: '500',
        marginBottom: '0.8rem',
    },
    choixContainer: {
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
        border: '1px solid',
        fontSize: '0.95rem',
    },
    choixNumero: {
        fontWeight: 'bold',
        minWidth: '20px',
    },
    iconeChoix: {
        marginLeft: 'auto',
    },
    sansReponse: {
        color: '#d97706',
        fontSize: '0.85rem',
        marginTop: '0.5rem',
        fontWeight: 'bold',
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        flexWrap: 'wrap',
    },
    boutonRecommencer: {
        padding: '0.7rem 2rem',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    boutonCreer: {
        padding: '0.7rem 2rem',
        backgroundColor: '#f3f4f6',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
}

export default ScoreBoard