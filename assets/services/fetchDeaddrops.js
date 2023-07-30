export function get(south, north, west, east) {
    return fetch(`/api/deaddrops?latitude[between]=${south}..${north}&longitude[between]=${west}..${east}`)
        .then(response => response.json())
        .then(deaddrops => {
            return deaddrops["hydra:member"];
        })
        .catch(error => {
            console.error(error);
        });
}

export function getByTerm(searchTerm, order = "desc") {
    return fetch(`/api/deaddrops?name${searchTerm}&order[createdAt]=${order}`)
        .then(response => response.json())
        .then(deaddrops => {
            return deaddrops["hydra:member"];
        })
        .catch(error => {
            console.error(error);
        });
}