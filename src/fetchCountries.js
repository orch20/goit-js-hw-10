export function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3/name/${name}`).then(response => {
    return response.json();
  });
}
