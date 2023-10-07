import axios from 'axios';
import Notiflix from 'notiflix';

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
refs.loadMoreBtn.style.display = 'none';

export function clearGallery() {
  refs.markupGallery.innerHTML = '';
  page = 1;
  refs.loadMoreBtn.style.display = 'none';
}

export async function onSubmit(event) {
  event.preventDefault();
  const inputValue = refs.input.value;
  if (inputValue === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }
  clearGallery();
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
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query.'
      );
    } else {
      displayImages(response.data.hits);
      refs.loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

export function displayImages(images) {
  const markup = images
    .map(
      image => `
    <div class="photo-card">
      <img src="${image.largeImageURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `
    )
    .join('');

  refs.markupGallery.insertAdjacentHTML('beforeend', markup);
}
