import { useForm, useFieldArray } from 'react-hook-form'

// Composant formulaire pour ajouter une question au quiz
// Version avec react-hook-form (RHF)
// Démontre l'utilisation de useForm, useFieldArray et la validation intégrée
// Props : addQuestion (fonction pour ajouter la question à la liste)
function QuestionFormRHF({ addQuestion }) {

    // useForm : initialise le formulaire avec ses valeurs par défaut
    // register  : connecte un champ au formulaire
    // handleSubmit : gère la soumission avec validation automatique
    // formState : contient les erreurs de validation
    // watch : observe la valeur d'un champ en temps réel
    // control : nécessaire pour useFieldArray
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
        reset,
    } = useForm({
        defaultValues: {
            texte: '',
            // On démarre avec 2 choix vides par défaut
            choix: [{ valeur: '' }, { valeur: '' }],
            bonneReponse: '',
        },
    })

    // useFieldArray : gère un tableau de champs dynamiques
    // fields : tableau des choix actuels
    // append : ajoute un nouveau choix
    // remove : supprime un choix par son index
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'choix', // correspond au nom du tableau dans defaultValues
    })

    // On observe en temps réel les valeurs des choix
    // pour les afficher dans le select de la bonne réponse
    const choixValues = watch('choix')


    // Soumission du formulaire — appelée seulement si la validation passe
    const onSubmit = (data) => {

        // On filtre les choix vides au cas où
        const choixFiltres = data.choix
            .map((c) => c.valeur.trim())
            .filter((c) => c !== '')

        // On retrouve le texte de la bonne réponse selon l'index sélectionné
        const bonneReponseTexte = data.choix[data.bonneReponse]?.valeur.trim()

        // Construction de l'objet question
        const nouvelleQuestion = {
            texte: data.texte.trim(),
            choix: choixFiltres,
            bonneReponse: bonneReponseTexte,
        }

        // Envoi au composant parent
        addQuestion(nouvelleQuestion)

        // Remise à zéro du formulaire
        reset({
            texte: '',
            choix: [{ valeur: '' }, { valeur: '' }],
            bonneReponse: '',
        })
    }


    // --- RENDU ---

    return (
        <div style={styles.container}>
            <div style={styles.entete}>
                <h2 style={styles.titre}>➕ Ajouter une question</h2>
                {/* Badge pour identifier la version RHF */}
                <span style={styles.badge}>react-hook-form</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>

                {/* Champ : énoncé de la question */}
                <div style={styles.groupe}>
                    <label htmlFor="texte" style={styles.label}>
                        Énoncé de la question
                    </label>
                    <input
                        id="texte"
                        type="text"
                        placeholder="Ex : Quel hook permet de gérer l'état ?"
                        // register connecte le champ à RHF avec ses règles de validation
                        {...register('texte', {
                            required: 'L\'énoncé de la question est obligatoire.',
                            minLength: {
                                value: 3,
                                message: 'L\'énoncé doit contenir au moins 3 caractères.',
                            },
                        })}
                        style={{
                            ...styles.input,
                            borderColor: errors.texte ? 'red' : '#ccc',
                        }}
                    />
                    {/* RHF gère les erreurs automatiquement via errors */}
                    {errors.texte && (
                        <span style={styles.erreur}>❌ {errors.texte.message}</span>
                    )}
                </div>

                {/* Section : liste des choix dynamiques avec useFieldArray */}
                <div style={styles.groupe}>
                    <label style={styles.label}>Choix de réponses</label>

                    {/* fields est le tableau géré par useFieldArray */}
                    {fields.map((field, index) => (
                        <div key={field.id} style={styles.ligneChoix}>

                            {/* Numéro du choix */}
                            <span style={styles.numeroChoix}>{index + 1}.</span>

                            {/* Champ texte du choix */}
                            <div style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    placeholder={`Choix ${index + 1}`}
                                    // register avec le nom du tableau[index].valeur
                                    {...register(`choix.${index}.valeur`, {
                                        required: `Le choix ${index + 1} est obligatoire.`,
                                    })}
                                    style={{
                                        ...styles.input,
                                        width: '100%',
                                        borderColor: errors.choix?.[index]?.valeur ? 'red' : '#ccc',
                                    }}
                                />
                                {errors.choix?.[index]?.valeur && (
                                    <span style={styles.erreur}>
                                        ❌ {errors.choix[index].valeur.message}
                                    </span>
                                )}
                            </div>

                            {/* Bouton supprimer le choix (désactivé si moins de 2 choix) */}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 2}
                                style={{
                                    ...styles.boutonSupprimer,
                                    opacity: fields.length <= 2 ? 0.3 : 1,
                                    cursor: fields.length <= 2 ? 'not-allowed' : 'pointer',
                                }}
                                title="Supprimer ce choix"
                            >
                                🗑️
                            </button>

                        </div>
                    ))}

                    {/* Bouton pour ajouter un nouveau choix via append */}
                    <button
                        type="button"
                        onClick={() => append({ valeur: '' })}
                        style={styles.boutonAjouterChoix}
                    >
                        ＋ Ajouter un choix
                    </button>

                </div>

                {/* Sélection de la bonne réponse */}
                <div style={styles.groupe}>
                    <label htmlFor="bonneReponse" style={styles.label}>
                        Bonne réponse
                    </label>
                    <select
                        id="bonneReponse"
                        {...register('bonneReponse', {
                            required: 'Tu dois sélectionner la bonne réponse.',
                        })}
                        style={{
                            ...styles.input,
                            borderColor: errors.bonneReponse ? 'red' : '#ccc',
                        }}
                    >
                        <option value="">-- Sélectionner la bonne réponse --</option>
                        {/* On affiche seulement les choix qui ont du texte */}
                        {choixValues?.map((c, index) => (
                            c.valeur.trim() !== '' && (
                                <option key={index} value={index}>
                                    {index + 1}. {c.valeur}
                                </option>
                            )
                        ))}
                    </select>
                    {errors.bonneReponse && (
                        <span style={styles.erreur}>❌ {errors.bonneReponse.message}</span>
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
    entete: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        marginBottom: '1rem',
    },
    titre: {
        fontSize: '1.2rem',
    },
    badge: {
        backgroundColor: '#fef3c7',
        color: '#b45309',
        border: '1px solid #fcd34d',
        borderRadius: '999px',
        padding: '0.2rem 0.7rem',
        fontSize: '0.8rem',
        fontWeight: 'bold',
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
        backgroundColor: '#fef3c7',
        color: '#b45309',
        border: '1px dashed #f59e0b',
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

export default QuestionFormRHF