import onChange from "on-change"

export default (state, elements) => {
    const { input, feedback, feedsContainer, postsContainer } = elements

    const renderFeeds = (feeds) => {
        feedsContainer.innerHTML = ''
        const feedsCard = document.getElementById('feedsCard')
        if (feeds.length === 0) {
            feedsCard.style.display = 'none'
            return
        }

        feedsCard.style.display = 'block'

        feeds.forEach((feed) => {
            const li = document.createElement('li')
            li.classList.add('list-group-item')

            const title = document.createElement('h3')
            title.textContent = feed.title
            title.classList.add('h6', 'mb-1')

            const description = document.createElement('p')
            description.textContent = feed.description
            description.classList.add('mb-0')

            li.append(title, description)
            feedsContainer.append(li)
        })
    }

    const renderPosts = (posts) => {
        postsContainer.innerHTML = ''
        const postsCard = document.getElementById('postsCard')
        if (posts.length === 0) {
            postsCard.style.display = 'none'
            return
        }

        postsCard.style.display = 'block'

        posts.forEach((post) => {
            const li = document.createElement('li')
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start')

            const a = document.createElement('a')
            a.href = post.link
            a.textContent = post.title
            a.target = '_blank'
            a.rel = 'noopener noreferrer'
            a.classList.add('fw-bold')

            const button = document.createElement('button')
            button.type = 'button'
            button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
            button.textContent = 'Просмотр'
            button.setAttribute('data-id', post.id)
            button.setAttribute('data-bs-toggle', 'modal')
            button.setAttribute('data-bs-target', '#postModal')

            li.append(a, button)
            postsContainer.append(li)
        })
    }

    let isFirstRender = true

    return onChange(state, (path, value) => {

        if (isFirstRender) {
            isFirstRender = false
            return
        }

        switch (path) {
            case 'form.error':
                if (value) {
                    input.classList.add('is-invalid')
                    feedback.classList.remove('text-success')
                    feedback.classList.add('text-danger')
                    feedback.textContent = value
                } else {
                    input.classList.remove('is-invalid')
                    feedback.textContent = ''
                }
                break
            case 'form.success':
                if (value) {
                    feedback.classList.remove('text-danger')
                    feedback.classList.add('text-success')
                    feedback.textContent = value
                } else {
                    feedback.textContent = ''
                    feedback.classList.remove('text-success')
                    feedback.classList.add('text-danger')
                }
                break
            case 'form.loading':
                elements.submit.disabled = value
                break
                
            case 'feeds':
                renderFeeds(value)
                break

            case 'posts':
                renderPosts(value)
                break

            default:
                break
        }
    })
}