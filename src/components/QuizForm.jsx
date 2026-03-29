import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

// Composant pour gérer le titre du quiz avec react-hook-form
function QuizForm({ quizTitle, setQuizTitle }) {

  // Initialisation du formulaire avec la valeur actuelle du titre
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      titre: quizTitle,
    },
  })

  // Si le titre est vidé depuis le parent (ex: reset global),
  // on met aussi à jour le champ du formulaire
  useEffect(() => {
    if (quizTitle === '') {
      reset({ titre: '' })
    }
  }, [quizTitle, reset])

  // Fonction appelée lorsque le formulaire est valide
  const onSubmit = (data) => {
    // On enregistre le titre sans les espaces inutiles
    setQuizTitle(data.titre.trim())
  }

  return (
    <div className="carte">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
        <h2 className="section-titre" style={{ margin: 0 }}>📝 Titre du quiz</h2>
        <span className="badge-rhf">react-hook-form</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">

        <div className="form-groupe">
          <label htmlFor="titre" className="form-label">
            Nom du quiz
          </label>

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

          {/* Affiche l'erreur si le champ n'est pas valide */}
          {errors.titre && (
            <span className="form-erreur">❌ {errors.titre.message}</span>
          )}

          {/* Message de succès après une soumission valide */}
          {isSubmitSuccessful && !errors.titre && (
            <span className="form-succes">✅ Titre enregistré avec succès !</span>
          )}
        </div>

        {/* Bouton pour enregistrer le titre */}
        <button
          type="submit"
          className="btn btn-principal"
          style={{ alignSelf: 'flex-start' }}
        >
          💾 Enregistrer le titre
        </button>

      </form>

      {/* Affiche le titre actuel si un titre a été défini */}
      {quizTitle !== '' && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
          Titre actuel : <strong style={{ color: '#7c3aed' }}>{quizTitle}</strong>
        </p>
      )}

    </div>
  )
}

export default QuizForm