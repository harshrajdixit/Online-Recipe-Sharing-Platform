// Simple client-side auth and recipe app (demo)
// Data stored in localStorage: users (array), recipes (array), currentUser (object)

function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key){ return JSON.parse(localStorage.getItem(key) || 'null'); }

// Initialize default admin user if none
(function initDefault(){
  let users = load('users') || [];
  if(users.length === 0){
    users.push({username:'admin', password:'admin', role:'admin'});
    users.push({username:'user', password:'user', role:'user'});
    save('users', users);
  }
  let recipes = load('recipes') || [];
  if(recipes.length === 0){
    recipes.push({id:1, title:'Masala Tea', ingredients:'Tea leaves, Milk, Sugar', instructions:'Boil water, add tea, milk and sugar', author:'admin'});
    save('recipes', recipes);
  }
})();

// Helper
function getCurrentUser(){ return load('currentUser'); }
function setCurrentUser(u){ save('currentUser', u); updateNav(); }

// Navigation state update
function updateNav(){
  let cur = getCurrentUser();
  let authLink = document.getElementById('authLink');
  let logoutLink = document.getElementById('logoutLink');
  let adminLink = document.getElementById('adminLink');
  let addLink = document.getElementById('addLink');
  if(cur){
    if(authLink) authLink.style.display='none';
    if(logoutLink) logoutLink.style.display='inline-block';
    if(adminLink) adminLink.style.display = (cur.role==='admin') ? 'inline-block' : 'none';
    if(addLink) addLink.style.display='inline-block';
    logoutLink.onclick = () => { localStorage.removeItem('currentUser'); updateNav(); window.location.href='index.html'; }
  } else {
    if(authLink) authLink.style.display='inline-block';
    if(logoutLink) logoutLink.style.display='none';
    if(adminLink) adminLink.style.display='none';
    if(addLink) addLink.style.display='inline-block';
  }
}
updateNav();

// REGISTER
document.addEventListener('click', function(e){
  if(e.target && e.target.id==='btnRegister'){
    let u=document.getElementById('regUser').value.trim();
    let p=document.getElementById('regPass').value.trim();
    let asAdmin = document.getElementById('regAdmin').checked;
    if(!u||!p){ alert('Enter username & password'); return; }
    let users = load('users') || [];
    if(users.find(x=>x.username===u)){ alert('User exists'); return; }
    users.push({username:u,password:p,role: asAdmin ? 'admin' : 'user'});
    save('users', users);
    alert('Registered. Please login.');
    window.location.href='login.html';
  }
});

// LOGIN
document.addEventListener('click', function(e){
  if(e.target && e.target.id==='btnLogin'){
    let u=document.getElementById('logUser').value.trim();
    let p=document.getElementById('logPass').value.trim();
    let users = load('users') || [];
    let user = users.find(x=>x.username===u && x.password===p);
    if(!user){ alert('Invalid credentials'); return; }
    setCurrentUser({username:user.username, role:user.role});
    alert('Logged in as ' + user.username);
    window.location.href='index.html';
  }
});

// ADD RECIPE
document.addEventListener('submit', function(e){
  if(e.target && e.target.id==='recipeForm'){
    e.preventDefault();
    let cur = getCurrentUser();
    if(!cur){ alert('Please login to add a recipe.'); window.location.href='login.html'; return; }
    let title = document.getElementById('title').value.trim();
    let ingredients = document.getElementById('ingredients').value.trim();
    let instructions = document.getElementById('instructions').value.trim();
    if(!title||!ingredients||!instructions){ alert('All fields required'); return; }
    let recipes = load('recipes') || [];
    let id = recipes.length ? recipes[recipes.length-1].id+1 : 1;
    recipes.push({id, title, ingredients, instructions, author:cur.username});
    save('recipes', recipes);
    alert('Recipe added');
    window.location.href='view.html';
  }
});

// DISPLAY RECIPES (on view.html)
window.addEventListener('load', function(){
  let recipesDiv = document.getElementById('recipes');
  if(recipesDiv){
    let recipes = load('recipes') || [];
    recipesDiv.innerHTML = '';
    recipes.slice().reverse().forEach(r=>{
      recipesDiv.innerHTML += `<div class="card">
        <h3>${r.title}</h3>
        <p class="small">by ${r.author || 'unknown'}</p>
        <p><b>Ingredients:</b> ${r.ingredients}</p>
        <p><b>Instructions:</b> ${r.instructions}</p>
      </div>`;
    });
  }

  // Admin page
  let allRecipes = document.getElementById('allRecipes');
  if(allRecipes){
    let cur = getCurrentUser();
    if(!cur || cur.role!=='admin'){
      document.getElementById('adminNotice').innerText = 'Access denied. Admins only.';
      return;
    }
    let recipes = load('recipes') || [];
    if(recipes.length===0) allRecipes.innerText = 'No recipes yet';
    allRecipes.innerHTML = '';
    recipes.slice().reverse().forEach(r=>{
      let div = document.createElement('div');
      div.className='card';
      div.innerHTML = `<h3>${r.title}</h3>
        <p class="small">by ${r.author || 'unknown'}</p>
        <p><b>Ingredients:</b> ${r.ingredients}</p>
        <p><b>Instructions:</b> ${r.instructions}</p>
        <button data-id="${r.id}" class="delBtn">Delete</button>`;
      allRecipes.appendChild(div);
    });
  }

  // add.html auth notice
  let authNotice = document.getElementById('authNotice');
  if(authNotice){
    let cur = getCurrentUser();
    if(!cur){
      authNotice.innerHTML = '<p class="small">You must <a href="login.html">login</a> to add recipes.</p>';
      document.getElementById('recipeForm').style.display='none';
    } else {
      authNotice.innerHTML = '<p class="small">Adding as: ' + cur.username + ' ('+cur.role+')</p>';
    }
  }
});

// Delete handler (admin)
document.addEventListener('click', function(e){
  if(e.target && e.target.classList.contains('delBtn')){
    let id = Number(e.target.getAttribute('data-id'));
    if(!confirm('Delete recipe id ' + id + '?')) return;
    let recipes = load('recipes') || [];
    recipes = recipes.filter(r=>r.id !== id);
    save('recipes', recipes);
    alert('Deleted');
    window.location.reload();
  }
});

// Search filter on view.html
function filterRecipes(){
  let q = document.getElementById('search').value.toLowerCase();
  let cards = document.querySelectorAll('#recipes .card');
  cards.forEach(c=>{
    c.style.display = c.innerText.toLowerCase().includes(q) ? 'block' : 'none';
  });
}
