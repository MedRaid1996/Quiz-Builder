import { useState } from 'react'

// Composant formulaire pour ajouter une question au quiz
// Utilise un formulaire CONTRÔLÉ avec useState
// Les choix de réponse sont dynamiques (ajout/suppression)
// Props : addQuestion (fonction pour ajouter la question à la liste)
function QuestionForm({ addQuestion }) {

    // State pour l'énoncé de la question
    const [texte, setTexte] = useState('')

    // State pour la liste des choix — tableau de strings
    // On commence avec 2 choix vides par défaut
    const [choix, setChoix] = useState(['', ''])

    // State pour l'index du choix sélectionné comme bonne réponse
    const [bonneReponseIndex, setBonneReponseIndex] = useState('')

    // State pour les erreurs de validation
    const [erreurs, setErreurs] = useState({})


    // --- GESTION DES CHOIX ---

    // Met à jour le texte d'un choix selon son index
    const handleChoixChange = (index, valeur) => {
        const nouveauxChoix = [...choix]
        nouveauxChoix[index] = valeur
        setChoix(nouveauxChoix)

        // Efface l'erreur du choix modifié
        if (erreurs[`choix${index}`]) {
            setErreurs({ ...erreurs, [`choix${index}`]: '' })
        }
    }

    // Ajoute un nouveau choix vide à la fin de la liste
    const ajouterChoix = () => {
        setChoix([...choix, ''])
    }

    // Supprime un choix selon son index
    // On ne permet pas de descendre sous 2 choix minimum
    const supprimerChoix = (index) => {
        if (choix.length <= 2) return

        const nouveauxChoix = choix.filter((_, i) => i !== index)
        setChoix(nouveauxChoix)

        // Si la bonne réponse supprimée, on remet à vide
        if (bonneReponseIndex === index) {
            setBonneReponseIndex('')
        }
        // Si la bonne réponse était après le choix supprimé, on ajuste l'index
        else if (bonneReponseIndex > index) {
            setBonneReponseIndex(bonneReponseIndex - 1)
        }
    }


    // --- VALIDATION ---

    const validerFormulaire = () => {
        const nouvellesErreurs = {}

        // Vérification de l'énoncé
        if (texte.trim() === '') {
            nouvellesErreurs.texte = 'L\'énoncé de la question est obligatoire.'
        }

        // Vérification que chaque choix est rempli
        choix.forEach((c, index) => {
            if (c.trim() === '') {
                nouvellesErreurs[`choix${index}`] = `Le choix ${index + 1} est obligatoire.`
            }
        })

        // Vérification qu'une bonne réponse est sélectionnée
        if (bonneReponseIndex === '') {
            nouvellesErreurs.bonneReponse = 'Tu dois sélectionner la bonne réponse.'
        }

        return nouvellesErreurs
    }


    // --- SOUMISSION ---

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validation du formulaire
        const erreursDetectees = validerFormulaire()

        // S'il y a des erreurs, on les affiche et on arrête
        if (Object.keys(erreursDetectees).length > 0) {
            setErreurs(erreursDetectees)
            return
        }

        // Construction de l'objet question
        const nouvelleQuestion = {
            texte: texte.trim(),
            choix: choix.map((c) => c.trim()),
            // La bonne réponse est le texte du choix sélectionné
            bonneReponse: choix[bonneReponseIndex].trim(),
        }

        // Envoi au composant parent
        addQuestion(nouvelleQuestion)

        // Remise à zéro du formulaire
        setTexte('')
        setChoix(['', ''])
        setBonneReponseIndex('')
        setErreurs({})
    }


    // --- RENDU ---

    return (
        <div style={styles.container}>
            <h2 style={styles.titre}>➕ Ajouter une question</h2>

            <form onSubmit={handleSubmit} style={styles.form}>

                {/* Champ : énoncé de la question */}
                <div style={styles.groupe}>
                    <label htmlFor="texte" style={styles.label}>
                        Énoncé de la question
                    </label>
                    <input
                        id="texte"
                        type="text"
                        value={texte}
                        onChange={(e) => {
                            setTexte(e.target.value)
                            if (erreurs.texte) setErreurs({ ...erreurs, texte: '' })
                        }}
                        placeholder="Ex : Quel hook permet de gérer l'état ?"
                        style={{
                            ...styles.input,
                            borderColor: erreurs.texte ? 'red' : '#ccc',
                        }}
                    />
                    {erreurs.texte && (
                        <span style={styles.erreur}>❌ {erreurs.texte}</span>
                    )}
                </div>

                {/* Section : liste des choix dynamiques */}
                <div style={styles.groupe}>
                    <label style={styles.label}>Choix de réponses</label>

                    {choix.map((c, index) => (
                        <div key={index} style={styles.ligneChoix}>

                            {/* Numéro du choix */}
                            <span style={styles.numeroChoix}>{index + 1}.</span>

                            {/* Champ texte du choix */}
                            <div style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    value={c}
                                    onChange={(e) => handleChoixChange(index, e.target.value)}
                                    placeholder={`Choix ${index + 1}`}
                                    style={{
                                        ...styles.input,
                                        width: '100%',
                                        borderColor: erreurs[`choix${index}`] ? 'red' : '#ccc',
                                    }}
                                />
                                {erreurs[`choix${index}`] && (
                                    <span style={styles.erreur}>❌ {erreurs[`choix${index}`]}</span>
                                )}
                            </div>

                            {/* Bouton supprimer le choix (désactivé si moins de 2 choix) */}
                            <button
                                type="button"
                                onClick={() => supprimerChoix(index)}
                                disabled={choix.length <= 2}
                                style={{
                                    ...styles.boutonSupprimer,
                                    opacity: choix.length <= 2 ? 0.3 : 1,
                                    cursor: choix.length <= 2 ? 'not-allowed' : 'pointer',
                                }}
                                title="Supprimer ce choix"
                            >
                                🗑️
                            </button>

                        </div>
                    ))}

                    {/* Bouton pour ajouter un nouveau choix */}
                    <button
                        type="button"
                        onClick={ajouterChoix}
                        style={styles.boutonAjouterChoix}
                    >
                        ＋ Ajouter un choix
                    </button>

                </div>

                {/* Sélection de la bonne réponse parmi les choix remplis */}
                <div style={styles.groupe}>
                    <label htmlFor="bonneReponse" style={styles.label}>
                        Bonne réponse
                    </label>
                    <select
                        id="bonneReponse"
                        value={bonneReponseIndex}
                        onChange={(e) => {
                            setBonneReponseIndex(Number(e.target.value))
                            if (erreurs.bonneReponse) setErreurs({ ...erreurs, bonneReponse: '' })
                        }}
                        style={{
                            ...styles.input,
                            borderColor: erreurs.bonneReponse ? 'red' : '#ccc',
                        }}
                    >
                        <option value="">-- Sélectionner la bonne réponse --</option>
                        {/* On affiche seulement les choix qui ont du texte */}
                        {choix.map((c, index) => (
                            c.trim() !== '' && (
                                <option key={index} value={index}>
                                    {index + 1}. {c}
                                </option>
                            )
                        ))}
                    </select>
                    {erreurs.bonneReponse && (
                        <span style={styles.erreur}>❌ {erreurs.bonneReponse}</span>
                    )}
                </div>

                {/* Bouton soumettre */}
                <button type="submit" style={styles.boutonSoumettre}>
                    ➕ Ajouter la question
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
        gap: '0.5rem',
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
    ligneChoix: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
    },
    numeroChoix: {
        paddingTop: '0.65rem',
        fontWeight: 'bold',
        color: '#555',
        minWidth: '20px',
    },
    boutonSupprimer: {
        background: 'none',
        border: 'none',
        fontSize: '1.1rem',
        paddingTop: '0.4rem',
    },
    boutonAjouterChoix: {
        padding: '0.5rem 1rem',
        backgroundColor: '#e0e7ff',
        color: '#4f46e5',
        border: '1px dashed #4f46e5',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: '0.3rem',
    },
    boutonSoumettre: {
        padding: '0.6rem 1.2rem',
        backgroundColor: '#16a34a',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
    erreur: {
        color: 'red',
        fontSize: '0.85rem',
    },
}

export default QuestionForm