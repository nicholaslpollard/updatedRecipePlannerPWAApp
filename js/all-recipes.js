// all-recipes.js

document.addEventListener('DOMContentLoaded', async function() {

    const allRecipesContainer = document.getElementById('recipe-list');
    if (!allRecipesContainer) return;

    //  Load all recipes from server JSON 
    async function loadRecipes() {
        try {
            const res = await fetch('/saved-recipes.json');
            if (!res.ok) throw new Error('Failed to fetch recipes');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    let recipes = await loadRecipes();
    allRecipesContainer.innerHTML = '';

    if (!recipes.length) {
        allRecipesContainer.innerHTML = `<p class="center-align">No recipes saved yet.</p>`;
        return;
    }

    const isPagesFolder = window.location.pathname.includes('/pages/');
    const basePath = isPagesFolder ? '' : 'pages/';

    //  Create recipe cards 
    recipes.forEach(recipe => {
        const recipeId = recipe.id;
        const col = document.createElement('div');
        col.className = 'col s12 m6 l4';
        col.innerHTML = `
            <div class="card" id="recipe-card-${recipeId}">
                <div class="card-content">
                    <span class="card-title">${recipe.title}</span>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                    <p><strong>Steps:</strong> ${recipe.steps.length} step(s)</p>
                </div>
                <div class="card-action">
                    <a href="${basePath}recipe.html?id=${recipeId}">View Recipe</a>
                    <a href="#" class="delete-recipe red-text">Delete</a>
                </div>
            </div>
        `;
        allRecipesContainer.appendChild(col);

        // Delete recipe  
        col.querySelector('.delete-recipe').addEventListener('click', async e => {
            e.preventDefault();
            if (!confirm(`Are you sure you want to delete "${recipe.title}"?`)) return;

            // Remove recipe 
            recipes = recipes.filter(r => r.id !== recipeId);

            try {
                // Update json
                await fetch(`/recipes/${recipeId}`, { method: 'DELETE' });
                col.remove();
                M.toast({html: `Recipe "${recipe.title}" deleted`, classes: 'red lighten-1 white-text'});
            } catch (err) {
                console.error(err);
                M.toast({html: 'Failed to delete recipe on server', classes: 'red lighten-1 white-text'});
            }
        });
    });

});

