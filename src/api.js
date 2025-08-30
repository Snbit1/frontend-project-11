import axios from 'axios'

const fetchRss = async (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url='
  
  return axios.get(`${proxyUrl}${encodeURIComponent(url)}`)
    .then((response) => response.data.contents)
    .catch(() => {
      const error = new Error('Network error')
      error.isNetworkError = true
      throw error
    })
}

export default fetchRss
