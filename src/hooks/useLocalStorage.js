import { useState } from 'react'

// Hook personnalisé pour sauvegarder et lire des données dans le localStorage
// key : la clé de stockage, initialValue : la valeur par défaut
function useLocalStorage(key, initialValue) {

    // On initialise le state en lisant d'abord le localStorage
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key)
            // Si une valeur existe déjà, on la parse, sinon on utilise la valeur par défaut
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error('Erreur lecture localStorage :', error)
            return initialValue
        }
    })

    // Fonction pour mettre à jour le state ET le localStorage en même temps
    const setValue = (value) => {
        try {
            setStoredValue(value)
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Erreur écriture localStorage :', error)
        }
    }

    // On retourne la valeur et la fonction de mise à jour (comme useState)
    return [storedValue, setValue]
}

export default useLocalStorage