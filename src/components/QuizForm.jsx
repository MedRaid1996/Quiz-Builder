import { useForm } from 'react-hook-form'

// Composant formulaire pour saisir le titre du quiz
// Version react-hook-form (RHF)
// Props : quizTitle (titre actuel), setQuizTitle (fonction de mise à jour)
function QuizForm({ quizTitle, setQuizTitle }) {

  // useForm initialise le formulaire avec la valeur actuelle du titre
  // register     : connecte le champ à RHF
  // handleSubmit : gère la soumission avec validation automatique
  // formState    : contient les erreurs et le statut de soumission
  // reset        : remet le formulaire à zéro
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      titre: quizTitle, // on prérempli avec le titre sauvegardé
    },
  })

  // Appelée seulement si la validation passe
  const onSubmit = (data) => {
    setQuizTitle(data.titre.trim())
  }

  return (
    <div className="carte">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
        <h2 className="section-titre" style={{ margin: 0 }}>📝 Titre du quiz</h2>
        {/* Badge pour identifier la version RHF */}
        <span className="badge-rhf">react-hook-form</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">

        <div className="form-groupe">
          <label htmlFor="titre" className="form-label">
            Nom du quiz
          </label>

          {/* register connecte le champ avec ses règles de validation */}
          <input
            id="titre"
            type="text"
            placeholder="Ex : Quiz JavaScript"
            {...register('titre', {
              required: 'Le titre du quiz ne peut pas être vide.',
              minLength: {
                value: 3,
                message: 'Le titre doit contenir au moins 3 caractères.',
              },
              maxLength: {
                value: 60,
                message: 'Le titre ne peut pas dépasser 60 caractères.',
              },
            })}
            className={`form-input ${errors.titre ? 'erreur' : ''}`}
          />

          {/* Erreur de validation gérée automatiquement par RHF */}
          {errors.titre && (
            <span className="form-erreur">❌ {errors.titre.message}</span>
          )}

          {/* Message de succès après soumission réussie */}
          {isSubmitSuccessful && !errors.titre && (
            <span className="form-succes">✅ Titre enregistré avec succès !</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-principal"
          style={{ alignSelf: 'flex-start' }}
        >
          💾 Enregistrer le titre
        </button>

      </form>

      {/* Affiche le titre actuel s'il est défini */}
      {quizTitle !== '' && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
          Titre actuel : <strong style={{ color: '#7c3aed' }}>{quizTitle}</strong>
        </p>
      )}

    </div>
  )
}

export default QuizForm