import i18next from 'i18next'

i18next.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        form: {
          add: 'Добавить',
          urlInvalid: 'Ссылка должна быть валидным URL',
          urlExists: 'RSS уже существует',
          urlPlaceholder: 'ссылка RSS',
          urlLabel: 'Ссылка RSS',
          success: 'RSS успешно загружен',
        },
        header: {
          title: 'RSS агрегатор',
          subtitle: 'Начните читать RSS сегодня! Это легко, это красиво.',
        },
        modal: {
          title: 'Заголовок поста',
          description: 'Описание поста',
          readFull: 'Читать полностью',
          close: 'Закрыть',
        },
        errors: {
          network: 'Ошибка сети',
          parse: 'Ресурс не содержит валидный RSS',
        },
        feeds: {
          title: 'Фиды',
        },
        posts: {
          title: 'Посты',
        },
        loading: 'Загрузка...',
      },
    },
  },
})

export default i18next
