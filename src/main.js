import 'bootstrap/dist/css/bootstrap.min.css'

document.querySelector('#app').innerHTML = `
<div class="container-fluid bg-dark p-5">
  <div class="row">
    <div class="col-md-10 col-lg-8 mx-auto text-white">
      <h1 class="display-3 mb-0">RSS агрегатор</h1>
      <p class="lead">Начните читать RSS сегодня! Это легко, это красиво.</p>
      <form class="rss-form text-body" action="">
        <div class="row">
          <div class="col">
            <div class="form-floating">
              <input id="url-input" class="form-control" autofocus="" type="text" required="" name="url" aria-label="url" placeholder="ссылка RSS" autocomplete="off">
              <label for="url-input">Ссылка RSS</label>
            </div>
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
