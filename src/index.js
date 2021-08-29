import './css/common.css';
import './sass/main.scss';
import NewsApiService from './apiService';
import imageCardTpl from './templates/image-card.hbs';
import LoadMoreBtn from './load-more-btn';
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

// loadMoreBtn.enable();
refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

let searchQuery = '';
function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.query.value;
  if (newsApiService.query === '') {
    return alert('Неправильный ввод');
  }
  loadMoreBtn.show();
  loadMoreBtn.disable();
  newsApiService.resetPage();
  newsApiService.fetchArticles().then(hits => {
    clearArticlesContainer();
    appendArticlesMarkUp(hits);
  });
}
function onLoadMore() {
  newsApiService.fetchArticles().then(appendArticlesMarkUp);
}
function appendArticlesMarkUp(hits) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', imageCardTpl(hits));
}
function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}
