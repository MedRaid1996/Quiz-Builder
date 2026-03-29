// Fonction qui calcule le score du joueur à la fin du quiz
// questions : liste des questions
// userAnswers : réponses choisies par l'utilisateur (clé = id de la question)
function calculateScore(questions, userAnswers) {

    // Compteur des bonnes réponses
    let correct = 0

    // Parcourt toutes les questions pour vérifier les réponses
    questions.forEach((question) => {

        // Si la réponse de l'utilisateur est correcte, on incrémente
        if (userAnswers[question.id] === question.bonneReponse) {
            correct++
        }
    })

    // Retourne les résultats du quiz
    return {
        correct, // nombre de bonnes réponses
        total: questions.length, // nombre total de questions
        percentage: Math.round((correct / questions.length) * 100), // pourcentage arrondi
    }
}

export default calculateScore