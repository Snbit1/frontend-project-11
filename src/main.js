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
      url: () => i18next.t('form.urlInvalid'),
    },
    mixed: {
      notOneOf: () => i18next.t('form.urlExists'),
    },
  })

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    el.textContent = i18next.t(key)
  })

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector('button[type="submit"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  }

  elements.feedsContainer.innerHTML = ''
  elements.postsContainer.innerHTML = ''

  const state = {
    form: {
      error: null,
      valid: false,
      success: null,
      loading: false,
    },
    feeds: [],
    posts: [],
  }

  const watchedState = initView(state, elements)

  const makeSchema = feeds => yup
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
      .then(xmlString => parseRss(xmlString))
      .then((data) => {
        const feedId = generateId()

        watchedState.feeds.push({
          id: feedId,
          url,
          title: data.feed.title,
          description: data.feed.description,
        })

        const posts = data.items.map(item => ({
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
        }
        else if (err.isParseError) {
          watchedState.form.error = i18next.t('errors.parse')
        }
        else if (err.isNetworkError) {
          watchedState.form.error = i18next.t('errors.network')
        }
        else {
          watchedState.form.error = i18next.t('errors.unknown')
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
    const post = watchedState.posts.find(p => p.id.toString() === postId)

    if (!post) return

    modalTitle.textContent = post.title
    modalBody.textContent = post.description
    modalLink.href = post.link

    post.read = true
    watchedState.posts = [...watchedState.posts]
  })

  const pollFeeds = () => {
    const promises = watchedState.feeds.map(feed =>
      fetchRss(feed.url)
        .then(parseRss)
        .then((data) => {
          const existingLinks = watchedState.posts.map(p => p.link)
          const newPosts = data.items
            .filter(item => !existingLinks.includes(item.link))
            .map(item => ({
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
        }),
    )
    Promise.all(promises).finally(() => {
      setTimeout(pollFeeds, 5000)
    })
  }
  pollFeeds()
})
