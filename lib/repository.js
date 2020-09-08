var config = require('../config.js')
const { Octokit } = require("@octokit/rest")
const octokit = new Octokit()

var apps = config.get("apps").map(app => {
  if (app.skipPrerelease) {
    var listReleases = octokit.repos
    .getLatestRelease({
      owner: app.githubOwner,
      repo: app.githubRepository,
    })
  } else {
    var listReleases = octokit.repos
    .listReleases({
      owner: app.githubOwner,
      repo: app.githubRepository,
    })
  }
  return listReleases
    .then(data => {
      const release = Array.isArray(data.data) ? data.data[0] : data.data
      if (release) {
        var version = release.tag_name
        // trim v from tag name
        if (version.startsWith("v")) {
          version = version.substring(1)
        }
        app.version = version
        app.versionDate = release.published_at
        app.versionDescription = release.body
        // find the asset with an .ipa
        release.assets.forEach((asset) => {
          if (asset.name.endsWith(".ipa")) {
            app.downloadURL = asset.browser_download_url
            app.size = asset.size
          }
        })
      }
      return Promise.resolve(app)
    })
    .catch(err => {
      return Promise.reject(err)
    })
})

module.exports = Promise
  .all(apps)
  .then(results => {
    var repository = {
      name: config.get("repo.name"),
      identifier: config.get("repo.identifier"),
      apps: [],
      news: config.get("news")
    }
    results.map(app => {
      repository.apps.push(app)
    })
    return repository
  })
