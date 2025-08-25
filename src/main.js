import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import * as yup from 'yup'
import initView from './view.js'
import i18next from './locales.js'
import fetchRss from './api.js'
import parseRss from './parser.js'
import generateId from './utils.js'

i18next.init().then(() => {


yup.setLocale({
  string: {
    url: () => i18next.t('form.urlInvalid')
  },
  mixed: {
    notOneOf: () => i18next.t('form.urlExists')
  }
})

document.querySelector('#app').innerHTML = `
<div class="container-fluid bg-dark p-5">
  <div class="row">
    <div class="col-md-10 col-lg-8 mx-auto text-white">
      <h1 class="display-3 mb-0">${i18next.t('header.title')}</h1>
      <p class="lead">${i18next.t('header.subtitle')}</p>
      <form class="rss-form text-body" action="" novalidate>
        <div class="row">
          <div class="col">
            <div class="form-floating">
              <input id="url-input" class="form-control" autofocus="" type="text" name="url" aria-label="url" placeholder="${i18next.t('form.urlPlaceholder')}" autocomplete="off">
              <label for="url-input">${i18next.t('form.urlLabel')}</label>
            </div>
            <p class="feedback m-2 small text-danger" style="min-height: 1.5rem;"></p>
          </div>
          <div class="col-auto">
            <button class="btn btn-lg btn-primary px-sm-5" style="height: 3.7rem;" type="submit" aria-label="add">${i18next.t('form.add')}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="container-fluid">
  <div class="row">
    <div class="col-md-10 col-lg-8 mx-auto">
      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card border-0" style="display: none;" id="postsCard">
            <div class="card-body">
              <h2 class="card-title h4">${i18next.t('posts.title')}</h2>
              <ul class="list-group list-group-flush posts"></ul>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0" style="display: none;" id="feedsCard">
            <div class="card-body">
              <h2 class="card-title h4">${i18next.t('feeds.title')}</h2>
              <ul class="list-group list-group-flush feeds"></ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="postModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${i18next.t('modal.title')}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${i18next.t('modal.close')}"></button>
      </div>
      <div class="modal-body">
        ${i18next.t('modal.description')}
      </div>
      <div class="modal-footer">
        <a href="#" class="btn btn-primary" target="_blank" rel="noopener noreferrer">${i18next.t('modal.readFull')}</a>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18next.t('modal.close')}</button>
      </div>
    </div>
  </div>
</div>
`

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  submit: document.querySelector('button[type="submit"]'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts')
}

elements.feedsContainer.innerHTML = ''
elements.postsContainer.innerHTML = ''

const state = {
  form: {
    error: null,
    valid: false,
    success: null,
    loading: false
  },
  feeds: [],
  posts: []
}

const watchedState = initView(state, elements)

const makeSchema = (feeds) => yup
  .string()
  .url(() => i18next.t('form.urlInvalid'))
  .notOneOf(feeds.map(f => f.url), () => i18next.t('form.urlExists'))

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(elements.form)
    const url = formData.get('url').trim()

    const schema = makeSchema(watchedState.feeds)

    watchedState.form.error = null
    watchedState.form.success = null
    watchedState.form.loading = true

    schema.validate(url)
      .then(() => fetchRss(url))
      .then((xmlString) => parseRss(xmlString))
      .then((data) => {
        const feedId = generateId()

        watchedState.feeds.push({
          id: feedId,
          url,
          title: data.feed.title,
          description: data.feed.description,
        })

        const posts = data.items.map((item) => ({
        id: generateId(),
        feedId,
        title: item.title,
        link: item.link,
        description: item.description,
        read: false,
        }))

        watchedState.posts.push(...posts)

        watchedState.form.success = i18next.t('form.success')
        elements.form.reset()
        elements.input.focus()
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          watchedState.form.error = err.message
        } else if (err.isParseError) {
          watchedState.form.error = i18next.t('errors.parse')
        } else {
          watchedState.form.error = i18next.t('errors.network')
        }
      })
      .finally(() => {
        watchedState.form.loading = false
      })
    })

  const modal = document.getElementById('postModal')
  const modalTitle = modal.querySelector('.modal-title')
  const modalBody = modal.querySelector('.modal-body')
  const modalLink = modal.querySelector('.modal-footer a')

  elements.postsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('button')
    if (!button) return

    const postId = button.getAttribute('data-id')
    const post = watchedState.posts.find((p) => p.id.toString() === postId)

    if (!post) return

    modalTitle.textContent = post.title
    modalBody.textContent = post.description
    modalLink.href = post.link

    post.read = true
    watchedState.posts = [...watchedState.posts]
  })

  const pollFeeds = () => {
    const promises = watchedState.feeds.map((feed) => 
    fetchRss(feed.url)
    .then(parseRss)
    .then((data) => {
      const existingLinks = watchedState.posts.map((p) => p.link)
      const newPosts = data.items
        .filter((item) => !existingLinks.includes(item.link))
        .map((item) => ({
          id: generateId(),
          feedId: feed.id,
          title: item.title,
          link: item.link,
          description: item.description,
          read: false,
        }))
        if (newPosts.length > 0) {
          watchedState.posts.unshift(...newPosts)
        }
    })
    .catch((err) => {
      console.error('Ошибка при обновлении фида:', err)
    })
    )
    Promise.all(promises).finally(() => {
      setTimeout(pollFeeds, 5000)
    })
  }
  pollFeeds()
})