import { useState } from 'react'

// Formulaire CONTRÔLÉ avec useState — version classique
function QuestionForm({ addQuestion }) {

  const [texte, setTexte] = useState('')
  const [choix, setChoix] = useState(['', ''])
  const [bonneReponseIndex, setBonneReponseIndex] = useState('')
  const [erreurs, setErreurs] = useState({})

  const handleChoixChange = (index, valeur) => {
    const nouveauxChoix = [...choix]
    nouveauxChoix[index] = valeur
    setChoix(nouveauxChoix)
    if (erreurs[`choix${index}`]) {
      setErreurs({ ...erreurs, [`choix${index}`]: '' })
    }
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
    const nouvellesErreurs = {}
    if (texte.trim() === '') nouvellesErreurs.texte = 'L\'énoncé est obligatoire.'
    choix.forEach((c, i) => {
      if (c.trim() === '') nouvellesErreurs[`choix${i}`] = `Le choix ${i + 1} est obligatoire.`
    })
    if (bonneReponseIndex === '') nouvellesErreurs.bonneReponse = 'Tu dois sélectionner la bonne réponse.'
    return nouvellesErreurs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const erreursDetectees = validerFormulaire()
    if (Object.keys(erreursDetectees).length > 0) {
      setErreurs(erreursDetectees)
      return
    }
    addQuestion({
      texte: texte.trim(),
      choix: choix.map((c) => c.trim()),
      bonneReponse: choix[bonneReponseIndex].trim(),
    })
    setTexte('')
    setChoix(['', ''])
    setBonneReponseIndex('')
    setErreurs({})
  }

  return (
    <div className="carte">
      <h2 className="section-titre">➕ Ajouter une question</h2>

      <form onSubmit={handleSubmit} className="form">

        {/* Énoncé */}
        <div className="form-groupe">
          <label htmlFor="texte" className="form-label">Énoncé de la question</label>
          <input
            id="texte"
            type="text"
            value={texte}
            onChange={(e) => {
              setTexte(e.target.value)
              if (erreurs.texte) setErreurs({ ...erreurs, texte: '' })
            }}
            placeholder="Ex : Quel hook permet de gérer l'état ?"
            className={`form-input ${erreurs.texte ? 'erreur' : ''}`}
          />
          {erreurs.texte && <span className="form-erreur">❌ {erreurs.texte}</span>}
        </div>

        {/* Choix dynamiques */}
        <div className="form-groupe">
          <label className="form-label">Choix de réponses</label>
          {choix.map((c, index) => (
            <div key={index} className="ligne-choix">
              <span className="choix-numero">{index + 1}.</span>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={c}
                  onChange={(e) => handleChoixChange(index, e.target.value)}
                  placeholder={`Choix ${index + 1}`}
                  className={`form-input ${erreurs[`choix${index}`] ? 'erreur' : ''}`}
                />
                {erreurs[`choix${index}`] && (
                  <span className="form-erreur">❌ {erreurs[`choix${index}`]}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => supprimerChoix(index)}
                disabled={choix.length <= 2}
                className="btn-suppr-choix"
                title="Supprimer ce choix"
              >
                🗑️
              </button>
            </div>
          ))}
          <button type="button" onClick={ajouterChoix} className="btn-ajouter-choix">
            ＋ Ajouter un choix
          </button>
        </div>

        {/* Bonne réponse */}
        <div className="form-groupe">
          <label htmlFor="bonneReponse" className="form-label">Bonne réponse</label>
          <select
            id="bonneReponse"
            value={bonneReponseIndex}
            onChange={(e) => {
              setBonneReponseIndex(Number(e.target.value))
              if (erreurs.bonneReponse) setErreurs({ ...erreurs, bonneReponse: '' })
            }}
            className={`form-select ${erreurs.bonneReponse ? 'erreur' : ''}`}
          >
            <option value="">-- Sélectionner la bonne réponse --</option>
            {choix.map((c, index) => (
              c.trim() !== '' && (
                <option key={index} value={index}>{index + 1}. {c}</option>
              )
            ))}
          </select>
          {erreurs.bonneReponse && <span className="form-erreur">❌ {erreurs.bonneReponse}</span>}
        </div>

        <button type="submit" className="btn btn-succes" style={{ alignSelf: 'flex-start' }}>
          ➕ Ajouter la question
        </button>

      </form>
    </div>
  )
}

export default QuestionForm