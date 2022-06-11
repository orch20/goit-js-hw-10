import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  const name = e.target.value.trim();
  fetchCountries(name).then(render).catch(onError);
  if (name.length === 0) {
    clearMarkup();
  }
}

function onError() {
  Notify.failure('Oops, there is no country with that name');
}

function renderCountriesList(country) {
  const template = country
    .map(country => {
      const { name, flags } = country;
      return `<img src="${flags[0]}" alt="${'flag of ' + name.common}" width="50"/>
    <p>${name.common}</p>`;
    })
    .join('');
  refs.list.innerHTML = template;
}

function render(countries) {
  clearMarkup();

  if (countries.length > 10) {
    Notify.warning('Too many matches found. Please enter a more specific name.');
  } else if (countries.length > 1) {
    renderCountriesList(countries);
  } else {
    renderCountriesParam(countries);
  }
}

function renderCountriesParam(country) {
  console.log(country);
  const name = country[0].name.official;
  const capital = country[0].capital;
  const population = country[0].population;
  const flag = country[0].flags[0];

  const languages = Object.values(country[0].languages).join(', ');

  const template = ` 
  <img src="${flag}" alt="${'flag of ' + name}" width="100" />
  <h1>${name}</h1>
  <p>${'Capital: ' + capital}</p>
  <p>${'Population: ' + population}</p>
  <p>${'Languages: ' + languages}</p>
  `;

  refs.info.innerHTML = template;
}

function clearMarkup() {
  refs.info.innerHTML = '';
  refs.list.innerHTML = '';
}
