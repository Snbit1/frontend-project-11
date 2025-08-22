import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup'
import initView from './view.js'

document.querySelector('#app').innerHTML = `
<div class="container-fluid bg-dark p-5">
  <div class="row">
    <div class="col-md-10 col-lg-8 mx-auto text-white">
      <h1 class="display-3 mb-0">RSS агрегатор</h1>
      <p class="lead">Начните читать RSS сегодня! Это легко, это красиво.</p>
      <form class="rss-form text-body" action="" novalidate>
        <div class="row">
          <div class="col">
            <div class="form-floating">
              <input id="url-input" class="form-control" autofocus="" type="text" name="url" aria-label="url" placeholder="ссылка RSS" autocomplete="off">
              <label for="url-input">Ссылка RSS</label>
            </div>
            <p class="feedback m-2 small text-danger"></p>
          </div>
          <div class="col-auto">
            <button class="h-100 btn btn-lg btn-primary px-sm-5" type="submit" aria-label="add">Добавить</button>
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
  },
  feeds: [],
}

const watchedState = initView(state, elements)

const makeSchema = (feeds) => yup
  .string()
  .url('Ссылка должна быть валидным URL')
  .notOneOf(feeds, 'RSS уже существует')

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(elements.form)
    const url = formData.get('url').trim()

    const schema = makeSchema(watchedState.feeds)

    schema.validate(url)
      .then(() => {
        watchedState.form.error = null
        watchedState.form.valid = true
        watchedState.feeds.push(url)
        elements.form.reset()
        elements.input.focus()
      })
      .catch((err) => {
        watchedState.form.valid = false
        watchedState.form.error = err.message
      })
  })
