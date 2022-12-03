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
    const statsTableElm = document.getElementById('pokemon-detail-stats-table');
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
        let strBuffer = '';
        pokeApi.getPokemonDetails(url)
            .then(pokemonDetail => {
                console.log(
                    pokemonDetail
                )
                detailElm.dataset.type = pokemonDetail.types[0].type.name;
                titleNameElm.textContent = pokemonDetail.name;
                titleIdElm.textContent = pokemonDetail.id;

                strBuffer = '';
                pokemonDetail.types.forEach(function(slot){
                    strBuffer += typeTpl.replaceAll('{{type-name}}', slot.type.name);
                });
                typesElm.innerHTML = strBuffer;

                pictureElm.src = pokemonDetail.sprites.other.dream_world.front_default;
                speciesElm.innerHTML = pokemonDetail.species.name;
                baseXpElm.innerHTML = pokemonDetail.base_experience;
                heightElm.innerHTML = dmConverter(pokemonDetail.height);
                weightElm.innerHTML = hgConverter(pokemonDetail.weight);
                isDefaultElm.innerHTML = pokemonDetail.is_default ? 'Yes' : 'No';

                strBuffer = '';
                pokemonDetail.abilities.forEach(function(item, index, items){
                    strBuffer += item.ability.name + ((index + 1) < items.length ? ', ' : '');
                })
                abilitiesElm.innerHTML = strBuffer;

                strBuffer = '';
                pokemonDetail.stats.forEach(function(stat){
                    strBuffer += `<tr><td>${stat.stat.name}</td><td>${stat.base_stat}</td><td><span style="width:${stat.base_stat}%"></span></td></tr>`;
                })
                statsTableElm.innerHTML = strBuffer;

                strBuffer = '';
                pokemonDetail.moves.forEach(function(moveItem){
                    strBuffer += `<li class="move-item"><span class="name">${moveItem.move.name}</span>
                    <ul class="details">`;
                    moveItem.version_group_details.forEach(function(detail){
                        strBuffer += `<li class="detail"><div class="level">${detail.level_learned_at}</div><div class="method">${detail.move_learn_method.name}</div><div class="version">${detail.version_group.name}</div></li>`;
                    });
                    strBuffer += `</ul></li>`;
                })
                movesListElm.innerHTML = strBuffer;

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