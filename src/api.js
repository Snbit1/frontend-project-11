import axios from 'axios'

const fetchRss = (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url='
  return axios.get(`${proxyUrl}${encodeURIComponent(url)}`)
    .then(response => response.data.contents)
}

export default fetchRss
