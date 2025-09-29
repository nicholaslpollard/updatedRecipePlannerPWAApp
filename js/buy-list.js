// buy-list.js

document.addEventListener('DOMContentLoaded', async function() {

    //  Elements 
    const recipeSelection = document.getElementById('recipe-selection');
    const generateBtn = document.getElementById('generate-list');
    const groceryListSection = document.getElementById('grocery-list');
    const groceryItemsTbody = document.getElementById('grocery-items');

    if (!recipeSelection || !generateBtn || !groceryListSection || !groceryItemsTbody) return;

    //  Load Recipes from saved-recipes.json 
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

    let recipesData = await loadRecipes();
    recipeSelection.innerHTML = '';

    // Display message if no recipes 
    if (!recipesData.length) {
        recipeSelection.innerHTML = `<p class="center-align">No recipes available. Please add recipes first.</p>`;
    } else {
        // Create cards for each recipe with portion input
        recipesData.forEach(recipe => {
            const col = document.createElement('div');
            col.className = 'col s12 m6';
            col.innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${recipe.title}</span>
                        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                        <div class="input-field">
                            <input type="number" min="0" value="0" id="portions-${recipe.id}">
                            <label for="portions-${recipe.id}" class="active">Number of Portions</label>
                        </div>
                    </div>
                </div>
            `;
            recipeSelection.appendChild(col);
        });
    }

    //  Load cached buy list from localStorage 
    const cachedGrocery = JSON.parse(localStorage.getItem('groceryList')) || [];
    if (cachedGrocery.length) {
        groceryListSection.style.display = 'block';
        groceryItemsTbody.innerHTML = '';
        cachedGrocery.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${item.ingredient}</td><td><input type="number" min="0" value="${item.quantity}" class="ingredient-qty"></td>`;
            groceryItemsTbody.appendChild(tr);
        });
    }

    //  Generate Grocery List on Button Click 
    generateBtn.addEventListener('click', () => {
        const groceryMap = {};

        recipesData.forEach(recipe => {
            const portionInput = document.getElementById(`portions-${recipe.id}`);
            const portions = portionInput ? parseInt(portionInput.value) || 0 : 0;
            if (portions > 0) {
                recipe.ingredients.forEach(ing => {
                    groceryMap[ing] = (groceryMap[ing] || 0) + portions;
                });
            }
        });

        groceryItemsTbody.innerHTML = '';
        const groceryList = [];
        Object.entries(groceryMap).forEach(([ing, qty]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${ing}</td><td><input type="number" min="0" value="${qty}" class="ingredient-qty"></td>`;
            groceryItemsTbody.appendChild(tr);
            groceryList.push({ ingredient: ing, quantity: qty });
        });

        localStorage.setItem('groceryList', JSON.stringify(groceryList));
        groceryListSection.style.display = 'block';
        M.toast({html: 'Buy list updated', classes: 'teal lighten-1 white-text'});
    });

});
