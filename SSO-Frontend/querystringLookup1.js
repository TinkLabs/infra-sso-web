import url from 'url'

export default {
  name: 'querystring1',

  lookup(req, res, options) {
    let found

    if (
      options.lookupQuerystring1 !== undefined &&
      typeof req !== 'undefined'
    ) {
      if (req.query) {
        found = req.query[options.lookupQuerystring1]
      } else {
        let querystring = url.parse(req.url, true)
        found = querystring.query[options.lookupQuerystring1]
      }

      console.log(
        options.lookupQuerystring1,
        found,
        req.url,
        req.query,
        121321312
      )
    }

    return found
  }
}
