import i18next from "i18next"

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
                    success: 'RSS успешно загружен'
                },
                header: {
                    title: 'RSS агрегатор',
                    subtitle: 'Начните читать RSS сегодня! Это легко, это красиво.'
                }
            }
        }
    }
})

export default i18next