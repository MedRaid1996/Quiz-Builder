import { useState } from 'react'

// Composant formulaire pour ajouter une question au quiz
// Utilise un formulaire CONTRÔLÉ avec useState
// Props : addQuestion (fonction pour ajouter la question à la liste)
function QuestionForm({ addQuestion }) {

    // State qui représente les données du formulaire
    // Chaque champ est contrôlé par React
    const [formData, setFormData] = useState({
        texte: '',       // énoncé de la question
        choixA: '',      // choix A
        choixB: '',      // choix B
        choixC: '',      // choix C
        choixD: '',      // choix D
        bonneReponse: '' // la bonne réponse parmi A, B, C, D
    })

    // State pour stocker les erreurs de validation
    // { texte: '...', choixA: '...', bonneReponse: '...' }
    const [erreurs, setErreurs] = useState({})

    // Mise à jour générique du formData quand un champ change
    // On utilise le name du champ pour cibler la bonne propriété
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        // On efface l'erreur du champ dès que l'utilisateur commence à taper
        if (erreurs[name]) {
            setErreurs({ ...erreurs, [name]: '' })
        }
    }

    // Fonction de validation — retourne un objet d'erreurs
    const validerFormulaire = () => {
        const nouvellesErreurs = {}

        if (formData.texte.trim() === '') {
            nouvellesErreurs.texte = 'L\'énoncé de la question est obligatoire.'
        }
        if (formData.choixA.trim() === '') {
            nouvellesErreurs.choixA = 'Le choix A est obligatoire.'
        }
        if (formData.choixB.trim() === '') {
            nouvellesErreurs.choixB = 'Le choix B est obligatoire.'
        }
        if (formData.choixC.trim() === '') {
            nouvellesErreurs.choixC = 'Le choix C est obligatoire.'
        }
        if (formData.choixD.trim() === '') {
            nouvellesErreurs.choixD = 'Le choix D est obligatoire.'
        }
        if (formData.bonneReponse === '') {
            nouvellesErreurs.bonneReponse = 'Tu dois sélectionner la bonne réponse.'
        }

        return nouvellesErreurs
    }

    // Soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault()

        // On valide tous les champs
        const erreursDetectees = validerFormulaire()

        // S'il y a des erreurs, on les affiche et on arrête
        if (Object.keys(erreursDetectees).length > 0) {
            setErreurs(erreursDetectees)
            return
        }

        // Construction de l'objet question à envoyer au parent
        const nouvelleQuestion = {
            texte: formData.texte.trim(),
            choix: [
                formData.choixA.trim(),
                formData.choixB.trim(),
                formData.choixC.trim(),
                formData.choixD.trim(),
            ],
            // La bonne réponse est le texte du choix sélectionné
            bonneReponse: formData[`choix${formData.bonneReponse}`].trim(),
        }

        // On envoie la question au composant parent (App)
        addQuestion(nouvelleQuestion)

        // On remet le formulaire à zéro après l'ajout
        setFormData({
            texte: '',
            choixA: '',
            choixB: '',
            choixC: '',
            choixD: '',
            bonneReponse: '',
        })
        setErreurs({})
    }

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
                        name="texte"
                        value={formData.texte}
                        onChange={handleChange}
                        placeholder="Ex : Quel hook permet de gérer l'état ?"
                        style={{
                            ...styles.input,
                            borderColor: erreurs.texte ? 'red' : '#ccc',
                        }}
                    />
                    {/* Affichage de l'erreur si le champ est vide */}
                    {erreurs.texte && (
                        <span style={styles.erreur}>❌ {erreurs.texte}</span>
                    )}
                </div>

                {/* Champs : les 4 choix de réponse */}
                {['A', 'B', 'C', 'D'].map((lettre) => (
                    <div key={lettre} style={styles.groupe}>
                        <label htmlFor={`choix${lettre}`} style={styles.label}>
                            Choix {lettre}
                        </label>
                        <input
                            id={`choix${lettre}`}
                            type="text"
                            name={`choix${lettre}`}
                            value={formData[`choix${lettre}`]}
                            onChange={handleChange}
                            placeholder={`Ex : Réponse ${lettre}`}
                            style={{
                                ...styles.input,
                                borderColor: erreurs[`choix${lettre}`] ? 'red' : '#ccc',
                            }}
                        />
                        {erreurs[`choix${lettre}`] && (
                            <span style={styles.erreur}>❌ {erreurs[`choix${lettre}`]}</span>
                        )}
                    </div>
                ))}

                {/* Sélection de la bonne réponse */}
                <div style={styles.groupe}>
                    <label htmlFor="bonneReponse" style={styles.label}>
                        Bonne réponse
                    </label>
                    <select
                        id="bonneReponse"
                        name="bonneReponse"
                        value={formData.bonneReponse}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            borderColor: erreurs.bonneReponse ? 'red' : '#ccc',
                        }}
                    >
                        <option value="">-- Sélectionner la bonne réponse --</option>
                        <option value="A">Choix A</option>
                        <option value="B">Choix B</option>
                        <option value="C">Choix C</option>
                        <option value="D">Choix D</option>
                    </select>
                    {erreurs.bonneReponse && (
                        <span style={styles.erreur}>❌ {erreurs.bonneReponse}</span>
                    )}
                </div>

                <button type="submit" style={styles.bouton}>
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
    bouton: {
        padding: '0.6rem 1.2rem',
        backgroundColor: '#16a34a',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
}

export default QuestionForm