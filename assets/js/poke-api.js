
const pokeApi = {}

function convertPokeApiPokemonToPokemon(pokemonFromApi, url) {
    const pokemon = new Pokemon()
    pokemon.number = pokemonFromApi.id
    pokemon.name = pokemonFromApi.name

    const types = pokemonFromApi.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokemonFromApi.sprites.other.dream_world.front_default
    pokemon.url = url;

    return pokemon
}

pokeApi.getPokemonDetails = url => fetch(url).then(response => response.json());

pokeApi.getPokemon = pokemon =>
    pokeApi.getPokemonDetails(pokemon.url)
        .then(
            responseJson =>
                convertPokeApiPokemonToPokemon(
                    responseJson,
                    pokemon.url
                )
        )



pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemon))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
