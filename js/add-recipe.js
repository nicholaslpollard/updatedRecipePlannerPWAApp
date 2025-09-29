// add-recipe.js

// Wait for content to load
document.addEventListener('DOMContentLoaded', function() {

    const addRecipeForm = document.getElementById('add-recipe-form');
    if (!addRecipeForm) return;

    // form submission 
    addRecipeForm.addEventListener('submit', (e) => {
        e.preventDefault(); // prevent default form submission

        // input data 
        const title = document.getElementById('recipe-title').value.trim();
        const ingredients = document.getElementById('recipe-ingredients').value
            .split('\n').map(i => i.trim()).filter(i => i); // remove empty lines
        const steps = document.getElementById('recipe-steps').value
            .split('\n').map(s => s.trim()).filter(s => s);

        // Validate  
        if (!title || ingredients.length === 0 || steps.length === 0) {
            M.toast({html: 'Please fill in all fields.', classes: 'red lighten-1 white-text'});
            return;
        }

        // Create new recipe  
        const newRecipe = {
            id: 'r' + Date.now(),
            title,
            ingredients,
            steps
        };

        // Update local storage 
        const recipesData = JSON.parse(localStorage.getItem('recipes')) || [];
        recipesData.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipesData));

        // Notify service worker to update cache 
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'UPDATE_RECIPES', recipes: recipesData });
        }

        // Provide feedback and reset form 
        M.toast({html: `Recipe "${title}" added successfully!`, classes: 'teal lighten-1 white-text'});
        addRecipeForm.reset();
    });

});
