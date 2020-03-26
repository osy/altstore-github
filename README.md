altstore-github
===============
Builds a repository for [AltStore][1] from data in Github releases.

## Configuration

Look at `config.sample.json` for an example and `config.js` for the schema.

## Launch as Server

To start a repository as a server, create `config.json` and run:
```
npm start
```

You can also specify port, host, and a different config file name:
```
npm start -- --ip 0.0.0.0 --port 8080 --config custom.json
```

## Output repository file

Alternatively, you can output the repository JSON directly:
```
node index.js --config custom.json > repo.json
```
or with `npx` (in another directory):
```
npx altstore-github --config custom.json > repo.json
```

The repository JSON will be written to standard output.

[1]: https://altstore.io