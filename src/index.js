import axios from 'axios';
import Notiflix from 'notiflix';
import { onSubmit, displayImages, clearGallery } from './gallery';
const apiKey = '39863085-06c0b9c863431b4674cecc2b0';
const url = 'https://pixabay.com/api/';
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input[name="searchQuery"]'),
  markupGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let page = 1;
const perPage = 40;
let currentQuery = '';
refs.loadMoreBtn.style.display = 'none';
refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
async function onLoadMore() {
  const inputValue = refs.input.value;
  if (inputValue !== currentQuery) {
    currentQuery = inputValue;
    page = 1;
  }
  page++;

  try {
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: perPage,
      },
    });

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no more images to load.');
      refs.loadMoreBtn.style.display = 'none';
    } else {
      displayImages(response.data.hits);
      const totalHits = response.data.totalHits || 0;
      const loadedImagesCount = page * perPage;

      if (loadedImagesCount >= totalHits) {
        refs.loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}
