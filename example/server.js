var path = require('path')
var express = require('express')
var _ = require('lodash')

var navTree = require('./nav.json')
var config = require('./config')

var Doxx = require('..')
var doxxConfig = require('./config/doxx')

var app = express()
var doxx = Doxx(doxxConfig)
doxx.configureExpress(app)

var staticDir = path.join(__dirname, 'static')
var contentsDir = path.join(__dirname, config.destDir)

app.use(express.static(staticDir))

var getLocals = function (extra) {
  return doxx.getLocals({ nav: navTree }, extra)
}

doxx.loadLunrIndex()

app.get('/search-results', function (req, res) {
  var searchTerm = req.query.searchTerm
  res.render('search', getLocals({
    title: "Search results for " + searchTerm,
    breadcrumbs: [
      'Search Results',
      searchTerm
    ],
    searchTerm: searchTerm,
    searchResults: doxx.lunrSearch(searchTerm)
  }))
})

app.use(express.static(contentsDir))

app.get('*', function (req, res) {
  res.render('not-found', getLocals({
    title: "We don't seem to have such page",
    breadcrumbs: [ 'Page not found' ]
  }))
})

var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log("Server started, open http://localhost:" + port)
})
