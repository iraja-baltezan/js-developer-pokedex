(function (window, document) {
    const listElm = document.getElementById('pokemonList');
    const detailElm = document.getElementById('pokemonDetail');
    const detailEscBtnElm = document.getElementById('pokemonDetailEscBtn');
    const tabSelectorElm = detailElm.querySelector('.content-tabs>.selector');
    const tabsElm = detailElm.querySelectorAll('.content-tabs>.tab');
    const movesListElm = detailElm.querySelector('.content-tabs>.tab>.moves-list');


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
                detailElm.classList.add('-visible');
            })
    }

    detailEscBtnElm.addEventListener('click', function(event) {
        detailElm.classList.remove('-visible');
    });

    tabSelectorElm.addEventListener('click', function (event) {
        event.preventDefault();
        let buttonElm = event.target;
        // if (event.target.classList.contain('button'))

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