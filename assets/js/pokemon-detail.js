(function (window, document) {
    // Elm = element
    // Tpl = template
    const listElm = document.getElementById('pokemon-list');
    const detailElm = document.getElementById('pokemon-detail');
    const detailEscBtnElm = document.getElementById('pokemon-detailEscBtn');
    const titleNameElm = detailElm.querySelector('.header>.title>.name');
    const titleIdElm = detailElm.querySelector('.header>.title>.id');
    const pictureElm = detailElm.querySelector('.header>.picture');
    const typesElm = detailElm.querySelector('.header>.types');
    const typeTpl = document.getElementById('tpl-pokemon-detail-type').textContent;
    const tabSelectorElm = detailElm.querySelector('.content-tabs>.selector');
    const tabsElm = detailElm.querySelectorAll('.content-tabs>.tab');
    const speciesElm = document.getElementById('pokemon-detail-species');
    const baseXpElm = document.getElementById('pokemon-detail-basexp');
    const heightElm = document.getElementById('pokemon-detail-height');
    const weightElm = document.getElementById('pokemon-detail-weight');
    const isDefaultElm = document.getElementById('pokemon-detail-isdefault');
    const abilitiesElm = document.getElementById('pokemon-detail-abilities');
    const movesListElm = detailElm.querySelector('.content-tabs>.tab>.moves-list');

    /**
     * Converts from decimeters to centimeters or meters.
     *
     * @param {integer} dm decimeters
     */
    function dmConverter(dm){
        let cm = dm * 10;
        return cm >= 100 ? cm / 100.0 + ' m': cm + ' cm';
    }

    /**
     * Converts from hectograms to grams or kilo grams.
     *
     * @param {integer} hg hectograms
     * @returns
     */
    function hgConverter(hg){
        let g = hg * 100;
        return g >= 1000 ? g / 1000.0 + ' kg': g + ' g';
    }

    listElm.addEventListener('click', function(event) {
        const pokemonUrl = event.target.closest('.pokemon').dataset.url;
        loadPokemonDetail(pokemonUrl);
    });

    function loadPokemonDetail(url) {
        pokeApi.getPokemonDetails(url)
            .then(pokemonDetail => {
                console.log(
                    pokemonDetail
                )
                detailElm.dataset.type = pokemonDetail.types[0].type.name;
                titleNameElm.textContent = pokemonDetail.name;
                titleIdElm.textContent = pokemonDetail.id;
                typesElm.innerHTML='';
                pokemonDetail.types.forEach(function(slot){
                    typesElm.innerHTML += typeTpl.replaceAll('{{type-name}}', slot.type.name);
                });
                pictureElm.src = pokemonDetail.sprites.other.dream_world.front_default;
                speciesElm.innerHTML = pokemonDetail.species.name;
                baseXpElm.innerHTML = pokemonDetail.base_experience;
                heightElm.innerHTML = dmConverter(pokemonDetail.height);
                weightElm.innerHTML = hgConverter(pokemonDetail.weight);
                isDefaultElm.innerHTML = pokemonDetail.is_default ? 'Yes' : 'No';
                abilitiesElm.innerHTML = '';
                pokemonDetail.abilities.forEach(function(item, index, items){
                    abilitiesElm.innerHTML += item.ability.name + ((index + 1) < items.length ? ', ' : '');
                })

                detailElm.classList.add(detailElm.dataset.type, '-visible');
            })
    }

    detailEscBtnElm.addEventListener('click', function(event) {
        detailElm.classList.remove('-visible',detailElm.dataset.type);
    });

    tabSelectorElm.addEventListener('click', function (event) {
        event.preventDefault();
        let buttonElm = event.target;

        if (buttonElm.classList.contains('button')) {
            tabSelectorElm.querySelectorAll('.button').forEach(function (elm) {
                elm.classList.remove('-selected');
            });
            buttonElm.classList.add('-selected')
            tabsElm.forEach(function (tab) {
                if (tab.dataset.id == buttonElm.dataset.tab)
                    tab.classList.add('-visible');
                else
                    tab.classList.remove('-visible');
            })
        }
    })


    movesListElm.addEventListener('click', function(event){
        const moveItem = event.target.closest('.move-item');
        if (!moveItem) return;
        moveItem.classList.toggle('-visible');
    })

})(window, document);