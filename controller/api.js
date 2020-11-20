const axios = require('axios')
const googleVolumeApiURL = 'https://www.googleapis.com/books/v1/volumes'

module.exports = {
  getBooksFromGoogleVolumeAPI: (query, callBack) => {
    console.log(`Get new books from Google Volume API searching for: ${query}`)
    axios
      .get(googleVolumeApiURL, {
        params: {
          q: query
            .trim()
            .replace(' ', '+')
            .toLowerCase(),
          key: process.env.KEY
        }
      })
      .then(booksApiResponse => callBack(null, booksApiResponse.data.items))
      .catch(apiError => callBack(apiError))
  }
}