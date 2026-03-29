import { useForm, useFieldArray } from 'react-hook-form'

// Formulaire avec react-hook-form — version bonus
function QuestionFormRHF({ addQuestion }) {

  const { register, handleSubmit, formState: { errors }, watch, control, reset } = useForm({
    defaultValues: {
      texte: '',
      choix: [{ valeur: '' }, { valeur: '' }],
      bonneReponse: '',
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'choix' })
  const choixValues = watch('choix')

  const onSubmit = (data) => {
    const choixFiltres = data.choix.map((c) => c.valeur.trim()).filter((c) => c !== '')
    const bonneReponseTexte = data.choix[data.bonneReponse]?.valeur.trim()
    addQuestion({ texte: data.texte.trim(), choix: choixFiltres, bonneReponse: bonneReponseTexte })
    reset({ texte: '', choix: [{ valeur: '' }, { valeur: '' }], bonneReponse: '' })
  }

  return (
    <div className="carte">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
        <h2 className="section-titre" style={{ margin: 0 }}>➕ Ajouter une question</h2>
        <span className="badge-rhf">react-hook-form</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">

        {/* Énoncé */}
        <div className="form-groupe">
          <label htmlFor="texte" className="form-label">Énoncé de la question</label>
          <input
            id="texte"
            type="text"
            placeholder="Ex : Quel hook permet de gérer l'état ?"
            {...register('texte', {
              required: 'L\'énoncé est obligatoire.',
              minLength: { value: 3, message: 'Au moins 3 caractères.' },
            })}
            className={`form-input ${errors.texte ? 'erreur' : ''}`}
          />
          {errors.texte && <span className="form-erreur">❌ {errors.texte.message}</span>}
        </div>

        {/* Choix dynamiques */}
        <div className="form-groupe">
          <label className="form-label">Choix de réponses</label>
          {fields.map((field, index) => (
            <div key={field.id} className="ligne-choix">
              <span className="choix-numero">{index + 1}.</span>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder={`Choix ${index + 1}`}
                  {...register(`choix.${index}.valeur`, {
                    required: `Le choix ${index + 1} est obligatoire.`,
                  })}
                  className={`form-input ${errors.choix?.[index]?.valeur ? 'erreur' : ''}`}
                />
                {errors.choix?.[index]?.valeur && (
                  <span className="form-erreur">❌ {errors.choix[index].valeur.message}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length <= 2}
                className="btn-suppr-choix"
              >
                🗑️
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ valeur: '' })} className="btn-ajouter-choix">
            ＋ Ajouter un choix
          </button>
        </div>

        {/* Bonne réponse */}
        <div className="form-groupe">
          <label htmlFor="bonneReponse" className="form-label">Bonne réponse</label>
          <select
            id="bonneReponse"
            {...register('bonneReponse', { required: 'Tu dois sélectionner la bonne réponse.' })}
            className={`form-select ${errors.bonneReponse ? 'erreur' : ''}`}
          >
            <option value="">-- Sélectionner la bonne réponse --</option>
            {choixValues?.map((c, index) => (
              c.valeur.trim() !== '' && (
                <option key={index} value={index}>{index + 1}. {c.valeur}</option>
              )
            ))}
          </select>
          {errors.bonneReponse && <span className="form-erreur">❌ {errors.bonneReponse.message}</span>}
        </div>

        <button type="submit" className="btn btn-rhf" style={{ alignSelf: 'flex-start' }}>
          ➕ Ajouter la question
        </button>

      </form>
    </div>
  )
}

export default QuestionFormRHF