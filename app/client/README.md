`typescript-axios` folder contains a client generated with `openapi-generator`
`wrapper` folder contains a wrapper around that client to prevent supplying common arameters with every API call

install `openapi-generator`

```sh
npm intsall -g openapi-generator
```

in this directory, run

```sh
npx openapi-generator generate -i api_open-api.yaml -g typescript-axios -o typescript-axios -pmodelPropertyNaming=original -penumPropertyNaming=original
```