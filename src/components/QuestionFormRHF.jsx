import { useForm, useFieldArray } from 'react-hook-form'

function QuestionFormRHF({ addQuestion }) {

  const { register, handleSubmit, formState: { errors }, watch, control, reset } = useForm({
    defaultValues: { texte: '', choix: [{ valeur: '' }, { valeur: '' }], bonneReponse: '' },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'choix' })
  const choixValues = watch('choix')

  const onSubmit = (data) => {
    const choixFiltres = data.choix.map(c => c.valeur.trim()).filter(c => c !== '')
    const bonneReponseTexte = data.choix[data.bonneReponse]?.valeur.trim()

    addQuestion({ texte: data.texte.trim(), choix: choixFiltres, bonneReponse: bonneReponseTexte })
    reset({ texte: '', choix: [{ valeur: '' }, { valeur: '' }], bonneReponse: '' })
  }

  return (
    <div className="carte">
      <div className="section-titre">
        ➕ Ajouter une question
        <span className="badge-rhf">react-hook-form</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="champ-groupe">
          <label htmlFor="texte" className="champ-label">Énoncé de la question</label>
          <input
            id="texte" type="text"
            placeholder="Ex : Quel hook permet de gérer l'état ?"
            {...register('texte', { required: "L'énoncé est obligatoire.", minLength: { value: 3, message: 'Minimum 3 caractères.' } })}
            className={`champ-input ${errors.texte ? 'erreur' : ''}`}
          />
          {errors.texte && <span className="champ-erreur">❌ {errors.texte.message}</span>}
        </div>

        <div className="champ-groupe">
          <label className="champ-label">Choix de réponses</label>
          {fields.map((field, index) => (
            <div key={field.id} className="ligne-choix">
              <span className="numero-choix">{index + 1}.</span>
              <div style={{ flex: 1 }}>
                <input
                  type="text" placeholder={`Choix ${index + 1}`}
                  {...register(`choix.${index}.valeur`, { required: `Le choix ${index + 1} est obligatoire.` })}
                  className={`champ-input ${errors.choix?.[index]?.valeur ? 'erreur' : ''}`}
                />
                {errors.choix?.[index]?.valeur && <span className="champ-erreur">❌ {errors.choix[index].valeur.message}</span>}
              </div>
              <button
                type="button" onClick={() => remove(index)}
                disabled={fields.length <= 2}
                className="bouton-supprimer-choix"
                title="Supprimer ce choix"
              >🗑️</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ valeur: '' })} className="bouton-ajouter-choix">
            ＋ Ajouter un choix
          </button>
        </div>

        <div className="champ-groupe">
          <label htmlFor="bonneReponse" className="champ-label">Bonne réponse</label>
          <select
            id="bonneReponse"
            {...register('bonneReponse', { required: 'Tu dois sélectionner la bonne réponse.' })}
            className={`champ-select ${errors.bonneReponse ? 'erreur' : ''}`}
          >
            <option value="">-- Sélectionner la bonne réponse --</option>
            {choixValues?.map((c, i) => c.valeur.trim() !== '' && <option key={i} value={i}>{i + 1}. {c.valeur}</option>)}
          </select>
          {errors.bonneReponse && <span className="champ-erreur">❌ {errors.bonneReponse.message}</span>}
        </div>

        <button type="submit" className="bouton-succes">➕ Ajouter la question</button>
      </form>
    </div>
  )
}

export default QuestionFormRHF