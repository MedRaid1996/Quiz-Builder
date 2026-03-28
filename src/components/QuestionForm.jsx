import { useState } from 'react'

function QuestionForm({ addQuestion }) {

  const [texte, setTexte] = useState('')
  const [choix, setChoix] = useState(['', ''])
  const [bonneReponseIndex, setBonneReponseIndex] = useState('')
  const [erreurs, setErreurs] = useState({})

  const handleChoixChange = (index, valeur) => {
    const nouveauxChoix = [...choix]
    nouveauxChoix[index] = valeur
    setChoix(nouveauxChoix)
    if (erreurs[`choix${index}`]) setErreurs({ ...erreurs, [`choix${index}`]: '' })
  }

  const ajouterChoix = () => setChoix([...choix, ''])

  const supprimerChoix = (index) => {
    if (choix.length <= 2) return
    const nouveauxChoix = choix.filter((_, i) => i !== index)
    setChoix(nouveauxChoix)
    if (bonneReponseIndex === index) setBonneReponseIndex('')
    else if (bonneReponseIndex > index) setBonneReponseIndex(bonneReponseIndex - 1)
  }

  const validerFormulaire = () => {
    const e = {}
    if (texte.trim() === '') e.texte = "L'énoncé est obligatoire."
    choix.forEach((c, i) => { if (c.trim() === '') e[`choix${i}`] = `Le choix ${i + 1} est obligatoire.` })
    if (bonneReponseIndex === '') e.bonneReponse = 'Tu dois sélectionner la bonne réponse.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const erreursDetectees = validerFormulaire()
    if (Object.keys(erreursDetectees).length > 0) { setErreurs(erreursDetectees); return }

    addQuestion({
      texte: texte.trim(),
      choix: choix.map(c => c.trim()),
      bonneReponse: choix[bonneReponseIndex].trim(),
    })

    setTexte(''); setChoix(['', '']); setBonneReponseIndex(''); setErreurs({})
  }

  return (
    <div className="carte">
      <h2 className="section-titre">➕ Ajouter une question</h2>

      <form onSubmit={handleSubmit}>

        <div className="champ-groupe">
          <label htmlFor="texte" className="champ-label">Énoncé de la question</label>
          <input
            id="texte" type="text" value={texte}
            onChange={e => { setTexte(e.target.value); if (erreurs.texte) setErreurs({ ...erreurs, texte: '' }) }}
            placeholder="Ex : Quel hook permet de gérer l'état ?"
            className={`champ-input ${erreurs.texte ? 'erreur' : ''}`}
          />
          {erreurs.texte && <span className="champ-erreur">❌ {erreurs.texte}</span>}
        </div>

        <div className="champ-groupe">
          <label className="champ-label">Choix de réponses</label>

          {choix.map((c, index) => (
            <div key={index} className="ligne-choix">
              <span className="numero-choix">{index + 1}.</span>
              <div style={{ flex: 1 }}>
                <input
                  type="text" value={c}
                  onChange={e => handleChoixChange(index, e.target.value)}
                  placeholder={`Choix ${index + 1}`}
                  className={`champ-input ${erreurs[`choix${index}`] ? 'erreur' : ''}`}
                />
                {erreurs[`choix${index}`] && <span className="champ-erreur">❌ {erreurs[`choix${index}`]}</span>}
              </div>
              <button
                type="button"
                onClick={() => supprimerChoix(index)}
                disabled={choix.length <= 2}
                className="bouton-supprimer-choix"
                title="Supprimer ce choix"
              >🗑️</button>
            </div>
          ))}

          <button type="button" onClick={ajouterChoix} className="bouton-ajouter-choix">
            ＋ Ajouter un choix
          </button>
        </div>

        <div className="champ-groupe">
          <label htmlFor="bonneReponse" className="champ-label">Bonne réponse</label>
          <select
            id="bonneReponse" value={bonneReponseIndex}
            onChange={e => { setBonneReponseIndex(Number(e.target.value)); if (erreurs.bonneReponse) setErreurs({ ...erreurs, bonneReponse: '' }) }}
            className={`champ-select ${erreurs.bonneReponse ? 'erreur' : ''}`}
          >
            <option value="">-- Sélectionner la bonne réponse --</option>
            {choix.map((c, i) => c.trim() !== '' && <option key={i} value={i}>{i + 1}. {c}</option>)}
          </select>
          {erreurs.bonneReponse && <span className="champ-erreur">❌ {erreurs.bonneReponse}</span>}
        </div>

        <button type="submit" className="bouton-succes">➕ Ajouter la question</button>
      </form>
    </div>
  )
}

export default QuestionForm