export default function parseRss(xmlString) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlString, 'application/xml')

    const parseError = doc.querySelector('parsererror')
    if (parseError) {
        const err = new Error('parseError')
        err.isParseError = true
        throw err
    }

    const channel = doc.querySelector('channel')
        if (!channel) {
            const err = new Error('noRss')
            err.isParseError = true
            throw err
    }

    const getText = (el) => (el ? el.textContent.trim() : '')

    const title = getText(doc.querySelector('channel > title'))
    const description = getText(doc.querySelector('channel > description'))

    const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
        title: getText(item.querySelector('title')),
        link: getText(item.querySelector('link')),
        description: getText(item.querySelector('description')),
    }))

    return {
        feed: { title, description },
        items,
    }
}