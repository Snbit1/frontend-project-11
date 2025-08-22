import onChange from "on-change"

export default (state, elements) => {
    const { input, feedback } = elements

    return onChange(state, (path, value) => {
        if (path === 'form.error') {
            if (value) {
                input.classList.add('is-invalid')
                feedback.classList.remove('text-success')
                feedback.classList.add('text-danger')
                feedback.textContent = value
            } else {
                input.classList.remove('is-invalid')
                feedback.textContent = ''
            }
        }
        if (path === 'form.valid') {
            if (value) {
                input.classList.remove('is-invalid')
            }
        }
        if (path === 'form.success') {
            if (value) {
            feedback.classList.remove('text-danger')
            feedback.classList.add('text-success')
            feedback.textContent = value
        } else {
            feedback.textContent = ''
            feedback.classList.remove('text-success')
            feedback.classList.add('text-danger')
            }
        }
    })
}