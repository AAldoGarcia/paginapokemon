
        document.addEventListener('DOMContentLoaded', function() {
            const body = document.body;
            const navbar = document.querySelector('.navbar');
            const footer = document.querySelector('footer');
            const homePage = document.getElementById('home-page');
            const resultsPage = document.getElementById('results-page');
            const homeLink = document.getElementById('home-link');
            const backBtn = document.getElementById('back-btn');
            const searchBtn = document.getElementById('search-btn');
            const typeSelect = document.getElementById('type-select');
            const typeCards = document.querySelectorAll('.type-card');
            const pokemonContainer = document.getElementById('pokemon-container');
            const resultsTitle = document.getElementById('results-title');
            const typeNameSpan = document.getElementById('type-name');
            
            // Cambiar el tema de la página según el tipo
            function setPageTheme(type) {
                // Remover todas las clases de tipo primero
                body.className = '';
                navbar.className = 'navbar';
                footer.className = '';
                
                // Añadir las clases correspondientes
                body.classList.add(`${type}-page`);
                navbar.classList.add(`${type}-page`);
                footer.classList.add(`${type}-page`);
            }
            
            // Mostrar página de resultados
            function showResultsPage(type) {
                setPageTheme(type);
                homePage.style.display = 'none';
                resultsPage.style.display = 'block';
                typeNameSpan.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                
                // Limpiar contenedor y mostrar carga
                pokemonContainer.innerHTML = '<div class="loading">Cargando Pokémon...</div>';
                
                // Obtener Pokémon del tipo seleccionado
                fetch(`https://pokeapi.co/api/v2/type/${type}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('No se pudo obtener los datos de la API');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Limpiar el contenedor
                        pokemonContainer.innerHTML = '';
                        
                        // Obtenemos la lista de Pokémon de este tipo
                        const pokemonList = data.pokemon;
                        
                        // Para cada Pokémon, hacemos otra solicitud para obtener más detalles
                        pokemonList.forEach(pokemon => {
                            fetch(pokemon.pokemon.url)
                                .then(response => response.json())
                                .then(pokemonData => {
                                    // Creamos la tarjeta del Pokémon
                                    const pokemonCard = document.createElement('div');
                                    pokemonCard.className = 'pokemon-card';
                                    
                                    const pokemonId = pokemonData.id;
                                    const pokemonName = pokemonData.name;
                                    const pokemonImage = pokemonData.sprites.other['official-artwork'].front_default || 
                                                       pokemonData.sprites.front_default;
                                    
                                    pokemonCard.innerHTML = `
                                        <div class="pokemon-image">
                                            <img src="${pokemonImage}" alt="${pokemonName}">
                                        </div>
                                        <div class="pokemon-id">#${pokemonId.toString().padStart(3, '0')}</div>
                                        <div class="pokemon-name">${pokemonName}</div>
                                        <div class="pokemon-types">
                                            ${pokemonData.types.map(type => 
                                                `<span class="type-badge ${type.type.name}" style="background-color: ${getTypeColor(type.type.name)}">
                                                    ${type.type.name}
                                                </span>`
                                            ).join(' ')}
                                        </div>
                                    `;
                                    
                                    pokemonContainer.appendChild(pokemonCard);
                                })
                                .catch(error => {
                                    console.error('Error al obtener datos del Pokémon:', error);
                                });
                        });
                    })
                    .catch(error => {
                        console.error('Error al obtener Pokémon del tipo:', error);
                        pokemonContainer.innerHTML = `<div class="error">Error al cargar los datos: ${error.message}</div>`;
                    });
            }
            
            // Volver a la página de inicio
            function showHomePage() {
                body.className = 'home-page';
                navbar.className = 'navbar home-page';
                footer.className = 'home-page';
                homePage.style.display = 'block';
                resultsPage.style.display = 'none';
            }
            
            // Event listeners
            homeLink.addEventListener('click', showHomePage);
            backBtn.addEventListener('click', showHomePage);
            
            searchBtn.addEventListener('click', function() {
                const selectedType = typeSelect.value;
                if (selectedType) {
                    showResultsPage(selectedType);
                }
            });
            
            typeCards.forEach(card => {
                card.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    showResultsPage(type);
                });
            });
            
            // Función para obtener colores según el tipo de Pokémon
            function getTypeColor(type) {
                const typeColors = {
                    normal: '#A8A878',
                    fire: '#F08030',
                    water: '#6890F0',
                    electric: '#F8D030',
                    grass: '#78C850',
                    ice: '#98D8D8',
                    fighting: '#C03028',
                    poison: '#A040A0',
                    ground: '#E0C068',
                    flying: '#A890F0',
                    psychic: '#F85888',
                    bug: '#A8B820',
                    rock: '#B8A038',
                    ghost: '#705898',
                    dragon: '#7038F8',
                    dark: '#705848',
                    steel: '#B8B8D0',
                    fairy: '#EE99AC'
                };
                
                return typeColors[type] || '#68A090';
            }
        });
    