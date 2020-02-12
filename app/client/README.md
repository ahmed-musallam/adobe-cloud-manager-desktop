`typescript-axios` client generated with `openapi-generator`

install `openapi-generator`

```sh
npm intsall -g openapi-generator
```

in this directory, run

```sh
npx openapi-generator generate -i api_open-api.yaml -g typescript-axios -o typescript-axios -pmodelPropertyNaming=original -penumPropertyNaming=original
```