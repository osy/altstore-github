var convict = require('convict');

convict.addFormat({
  name: 'source-array',
  validate: function(sources, schema) {
    if (!Array.isArray(sources)) {
      throw new Error('must be of type Array');
    }

    for (source of sources) {
      convict(schema.children).load(source).validate();
    }
  }
})

// Define a schema
var config = convict({
  config: {
    doc: "User specified config file to merge with",
    format: String,
    default: "config.json",
    env: "CONFIG_FILE",
    arg: "config"
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS",
    arg: "ip"
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port"
  },
  repo: {
    name: {
      doc: "Repository name",
      format: String,
      default: "AltStore Demo Source"
    },
    identifier: {
      doc: "Repository identifier",
      format: String,
      default: "com.rileytestut.AltStore.Demo"
    }
  },
  apps: {
    doc: "Apps in the repository.",
    format: "source-array",
    default: [], 
    children: {
      name: {
        doc: "App name",
        format: String,
        default: null
      },
      bundleIdentifier: {
        doc: "App bundle identifier",
        format: String,
        default: null
      },
      githubOwner: {
        doc: "App github owner",
        format: String,
        default: null
      },
      githubRepository: {
        doc: "App github repository name where releases reside",
        format: String,
        default: null
      },
      skipPrerelease: {
        doc: "If true, any github release marked 'pre-release' will be skipped",
        format: Boolean,
        default: false
      },
      beta: {
        doc: "App is labeled as beta",
        format: Boolean,
        default: false
      },
      developerName: {
        doc: "App developer",
        format: String,
        default: null
      },
      subtitle: {
        doc: "App subtitle",
        format: String,
        default: null
      },
      localizedDescription: {
        doc: "App description",
        format: String,
        default: null
      },
      iconURL: {
        doc: "App icon",
        format: String,
        default: null
      },
      tintColor: {
        doc: "App color",
        format: String,
        default: null
      },
      screenshotURLs: {
        doc: "App screenshots",
        format: Array,
        default: []
      }
    }
  },
  news: {
    doc: "Repo news to show to users",
    format: "source-array",
    default: [],
    children: {
      title: {
        doc: "News title",
        format: String,
        default: null
      },
      identifier: {
        doc: "News slug",
        format: String,
        default: null
      },
      caption: {
        doc: "News caption",
        format: String,
        default: null
      },
      tintColor: {
        doc: "News tint color",
        format: String,
        default: null
      },
      imageURL: {
        doc: "News image URL",
        format: String,
        default: ""
      },
      appID: {
        doc: "News associated bundle id",
        format: String,
        default: null
      },
      date: {
        doc: "News date in YYYY-MM-DD format",
        format: String, //TODO: check date format
        default: null
      },
      notify: {
        doc: "Notify user of this news item",
        format: Boolean,
        default: false
      }
    }
  }
})

// Load environment dependent configuration
const user = config.get('config')
if (user) {
  config.loadFile(user)
} else {
  console.error("No config file loaded!")
}

// Perform validation
config.validate({allowed: 'strict'})

module.exports = config
