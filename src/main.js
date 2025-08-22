import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup'
import initView from './view.js'
import i18next from './locales.js'

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
`

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
}

const state = {
  form: {
    error: null,
    valid: false,
    success: null
  },
  feeds: [],
}

const watchedState = initView(state, elements)

const makeSchema = (feeds) => yup
  .string()
  .url(() => i18next.t('form.urlInvalid'))
  .notOneOf(feeds, () => i18next.t('form.urlExists'))

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(elements.form)
    const url = formData.get('url').trim()

    const schema = makeSchema(watchedState.feeds)

    watchedState.form.error = null
    watchedState.form.success = null

    schema.validate(url)
      .then(() => {
        watchedState.form.valid = true
        watchedState.form.success = i18next.t('form.success')
        watchedState.feeds.push(url)
        elements.form.reset()
        elements.input.focus()
      })
      .catch((err) => {
        watchedState.form.valid = false
        watchedState.form.error = err.message
      })
  })
})