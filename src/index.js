import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

import { fetchCountries } from './js/fetchCountries';

const refs = {
    inputEl: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
  };
  
  refs.inputEl.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY)
  );  

  function onFormInput(e) {
  e.preventDefault();
  const searchCountries = e.target.value.trim();
  resetMarkup();

  if (searchCountries === '') {
    return;
  }
  fetchCountries(searchCountries).then(renderMarkup).catch(error);
}

function renderMarkup(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2 && data.length <= 10) {
    renderMarkupOneCountry(data);
  } else if (data.length === 1) {
    renderMarkupCountryAll(data);
  }
}

function renderMarkupOneCountry(data) {
  const countryElement = data
    .map(
      ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img"
          src="${flags.svg}"
          alt="${name.official}"
          width="60"
          height="40">
        ${name.official}
      </li>`
    )
    .join('');

  refs.countryList.innerHTML = countryElement;
}

function renderMarkupCountryAll(data) {
  const countryAll = data.map(
    ({ name, capital, population, flags, languages }) =>
      `
      <img
        src="${flags.svg}"
        alt="${name.official}"
        width="120"
        height="80">
      <h1 class="country-info__title">${name.official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>
      `
  );

  refs.countryInfo.innerHTML = countryAll;
}

function error() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function resetMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

