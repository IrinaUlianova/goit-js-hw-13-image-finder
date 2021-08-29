import './css/common.css';

import NewsApiService from './apiService';
import imageCardTpl from './templates/image-card.hbs';
import LoadMoreBtn from './load-more-btn';
import scrollIntoView from './scroll';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  articlesContainer: document.querySelector('.js-gallery-container'),
  // loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

// let searchQuery = '';
function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.query.value;
  if (newsApiService.query === '') {
    return alert('Неправильный ввод');
  }
  loadMoreBtn.show();
  newsApiService.resetPage();
  clearArticlesContainer();
  fetchArticles();
}

function fetchArticles() {
  loadMoreBtn.disable();
  newsApiService.fetchArticles().then(hits => {
    appendArticlesMarkUp(hits);
    loadMoreBtn.enable();
  });
}

function appendArticlesMarkUp(hits) {
  if (hits.length < 12) {
    loadMoreBtn.hide();
    error({
      text: 'We could not find more images for you.',
      type: 'error',
      autoOpen: 'false',
      delay: 3000,
    });
  }
  refs.articlesContainer.insertAdjacentHTML('beforeend', imageCardTpl(hits));
  const nextImagesList = refs.articlesContainer.lastElementChild;
  scrollIntoView(nextImagesList);
}
function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}
