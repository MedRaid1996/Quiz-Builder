import { useState } from 'react'

// Hook personnalisé pour gérer des données dans le localStorage
// key : nom utilisé pour stocker la donnée
// initialValue : valeur utilisée si rien n'existe encore
function useLocalStorage(key, initialValue) {

    // Initialise la valeur en essayant de lire dans le localStorage
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key)

            // Si une valeur existe, on la transforme en objet JS
            // sinon on utilise la valeur par défaut
            return item ? JSON.parse(item) : initialValue

        } catch (error) {
            console.error('Erreur lecture localStorage :', error)
            return initialValue
        }
    })

    // Fonction pour mettre à jour la valeur
    // Elle met à jour à la fois le state et le localStorage
    const setValue = (value) => {
        try {
            setStoredValue(value)

            // Sauvegarde la valeur en format JSON
            localStorage.setItem(key, JSON.stringify(value))

        } catch (error) {
            console.error('Erreur écriture localStorage :', error)
        }
    }

    // Retourne la valeur et la fonction pour la modifier (comme useState)
    return [storedValue, setValue]
}

export default useLocalStorage