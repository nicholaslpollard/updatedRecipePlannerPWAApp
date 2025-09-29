// recipe.js

// Wait for content to load before running script
document.addEventListener('DOMContentLoaded', async function() {
    const recipeContainer = document.getElementById('recipe-container'); // container to display recipe
    if (!recipeContainer) return; // exit if container not found

    // Get recipe ID from URL
    const recipeId = new URLSearchParams(window.location.search).get('id');
    if (!recipeId) {
        recipeContainer.innerHTML = 'No recipe ID provided.'; // display message if no ID
        return;
    }

    // Load all saved recipes
    const recipes = await loadRecipes();
    const recipe = recipes.find(r => r.id === recipeId); // find recipe matching ID
    if (!recipe) {
        recipeContainer.innerHTML = 'Recipe not found.'; // display message if not found
        return;
    }

    // Inject recipe details into container
    recipeContainer.innerHTML = `
        <h4 class="center-align">${recipe.title}</h4>
        <div class="card">
            <div class="card-content">
                <h5>Ingredients</h5>
                <ul class="browser-default">
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <h5>Steps</h5>
                <ol class="browser-default">
                    ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
});
