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
      var altstoreApp = {
        name: app.name,
        bundleIdentifier: app.bundleIdentifier,
        developerName: app.developerName,
        localizedDescription: app.localizedDescription,
        iconURL: app.iconURL,
        versions: []
      }
      if (app.subtitle) {
        altstoreApp.subtitle = app.subtitle
      }
      if (app.tintColor) {
        altstoreApp.tintColor = app.tintColor
      }
      if (app.screenshotURLs) {
        altstoreApp.screenshotURLs = app.screenshotURLs
      }
      const release = Array.isArray(data.data) ? data.data[0] : data.data
      if (release) {
        var versionNumber = release.tag_name
        // trim v from tag name
        if (versionNumber.startsWith("v")) {
          versionNumber = versionNumber.substring(1)
        }
        var version = {
          version: versionNumber,
          date: release.published_at,
          localizedDescription: release.body
        }
        if (app.minOSVersion) {
          version.minOSVersion = app.minOSVersion
        }
        // find the asset with specified name or first one with .ipa
        release.assets.forEach((asset) => {
          if (app.filename) {
            if (app.filename === asset.name) {
              version.downloadURL = asset.browser_download_url
              version.size = asset.size
            }
          } else {
            if (asset.name.endsWith(".ipa")) {
              version.downloadURL = asset.browser_download_url
              version.size = asset.size
            }
          }
        })
        if (version.downloadURL) {
          altstoreApp.versions.push(version)
        }
      }
      return Promise.resolve(altstoreApp)
    })
    .catch(err => {
      return Promise.reject(err)
    })
})

module.exports = Promise
  .all(apps)
  .then(results => {
    var repository = {
      ...config.get("repo"),
      apps: [],
      news: config.get("news")
    }
    results.map(app => {
      repository.apps.push(app)
    })
    return repository
  })
