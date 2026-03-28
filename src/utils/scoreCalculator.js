// Fonction utilitaire qui calcule le score final du joueur
// questions : tableau des questions, userAnswers : objet { id: réponse choisie }
function calculateScore(questions, userAnswers) {
    let correct = 0

    // On compare chaque réponse du joueur à la bonne réponse
    questions.forEach((question) => {
        if (userAnswers[question.id] === question.bonneReponse) {
            correct++
        }
    })

    // On retourne le nombre correct, le total et le pourcentage
    return {
        correct,
        total: questions.length,
        percentage: Math.round((correct / questions.length) * 100),
    }
}

export default calculateScore