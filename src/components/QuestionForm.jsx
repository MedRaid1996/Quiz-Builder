import { useState } from 'react'

// Composant qui permet d'ajouter une nouvelle question au quiz
function QuestionForm({ addQuestion }) {

  // État pour le texte de la question
  const [texte, setTexte] = useState('')

  // État pour la liste des choix de réponse
  const [choix, setChoix] = useState(['', ''])

  // État pour l'index de la bonne réponse sélectionnée
  const [bonneReponseIndex, setBonneReponseIndex] = useState('')

  // État pour stocker les messages d'erreur du formulaire
  const [erreurs, setErreurs] = useState({})

  // Met à jour un choix précis dans le tableau des choix
  const handleChoixChange = (index, valeur) => {
    const nouveauxChoix = [...choix]
    nouveauxChoix[index] = valeur
    setChoix(nouveauxChoix)

    // Efface l'erreur du choix dès que l'utilisateur commence à le corriger
    if (erreurs[`choix${index}`]) {
      setErreurs({ ...erreurs, [`choix${index}`]: '' })
    }
  }

  // Ajoute un nouveau champ de réponse vide
  const ajouterChoix = () => setChoix([...choix, ''])

  // Supprime un choix si le minimum de 2 choix est respecté
  const supprimerChoix = (index) => {
    if (choix.length <= 2) return

    const nouveauxChoix = choix.filter((_, i) => i !== index)
    setChoix(nouveauxChoix)

    // Réinitialise ou ajuste l'index de la bonne réponse après suppression
    if (bonneReponseIndex === index) setBonneReponseIndex('')
    else if (bonneReponseIndex > index) setBonneReponseIndex(bonneReponseIndex - 1)
  }

  // Vérifie que tous les champs requis sont remplis
  const validerFormulaire = () => {
    const nouvellesErreurs = {}

    if (texte.trim() === '') nouvellesErreurs.texte = 'L\'énoncé est obligatoire.'

    choix.forEach((c, i) => {
      if (c.trim() === '') nouvellesErreurs[`choix${i}`] = `Le choix ${i + 1} est obligatoire.`
    })

    if (bonneReponseIndex === '') nouvellesErreurs.bonneReponse = 'Tu dois sélectionner la bonne réponse.'

    return nouvellesErreurs
  }

  // Gère l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()

    const erreursDetectees = validerFormulaire()

    // S'il y a des erreurs, on les affiche et on arrête l'envoi
    if (Object.keys(erreursDetectees).length > 0) {
      setErreurs(erreursDetectees)
      return
    }

    // Envoie la nouvelle question au composant parent
    addQuestion({
      texte: texte.trim(),
      choix: choix.map((c) => c.trim()),
      bonneReponse: choix[bonneReponseIndex].trim(),
    })

    // Réinitialise le formulaire après ajout
    setTexte('')
    setChoix(['', ''])
    setBonneReponseIndex('')
    setErreurs({})
  }

  return (
    <div className="carte">
      <h2 className="section-titre">➕ Ajouter une question</h2>

      <form onSubmit={handleSubmit} className="form">

        {/* Champ pour saisir l'énoncé de la question */}
        <div className="form-groupe">
          <label htmlFor="texte" className="form-label">Énoncé de la question</label>
          <input
            id="texte"
            type="text"
            value={texte}
            onChange={(e) => {
              setTexte(e.target.value)

              // Efface l'erreur du champ texte dès qu'il est corrigé
              if (erreurs.texte) setErreurs({ ...erreurs, texte: '' })
            }}
            placeholder="Ex : Quel hook permet de gérer l'état ?"
            className={`form-input ${erreurs.texte ? 'erreur' : ''}`}
          />
          {erreurs.texte && <span className="form-erreur">❌ {erreurs.texte}</span>}
        </div>

        {/* Affichage dynamique des choix de réponse */}
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

          {/* Bouton pour ajouter un nouveau choix */}
          <button type="button" onClick={ajouterChoix} className="btn-ajouter-choix">
            ＋ Ajouter un choix
          </button>
        </div>

        {/* Liste déroulante pour choisir la bonne réponse */}
        <div className="form-groupe">
          <label htmlFor="bonneReponse" className="form-label">Bonne réponse</label>
          <select
            id="bonneReponse"
            value={bonneReponseIndex}
            onChange={(e) => {
              setBonneReponseIndex(Number(e.target.value))

              // Efface l'erreur si une réponse est sélectionnée
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

        {/* Bouton pour ajouter la question */}
        <button type="submit" className="btn btn-succes" style={{ alignSelf: 'flex-start' }}>
          ➕ Ajouter la question
        </button>

      </form>
    </div>
  )
}

export default QuestionForm