# cloudflare-worker-jest-test

Starter template for Cloudflare Worker project using Typescript, Jest, Eslint, Prettier, Webpack, and of course, Wrangler cli.

This project has been generated using [worker-typescript-template](https://github.com/EverlastingBugstopper/worker-typescript-template).

## Getting started

- Install the dependencies: `yarn install`
- One of the dependency is the Cloudflare Worker cli called [wrangler](https://developers.cloudflare.com/workers/quickstart/#installing-the-cli) which is used to develop and publish the worker

## Development

- `yarn dev` will compile the ts files and open a preview of the worker in the browser (watch mode enabled)
- Switch to the "Testing" tab to check the response status and headers

## Test

```sh
yarn test
```

## Publish

- Add your accound and zone id in _wrangler.toml_
- Login in Cloudflare using `yarn login` (short for `yarn wrangler login`)
- Publish your changes:

```sh
yarn publish
```
