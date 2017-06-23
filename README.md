# Sentry uploader
This package is used to manage releases and upload sourcemap files to sentry.

## Usage

```js 
npm run sentryupload --help
```  

Create a sentry release and uploads sourcemaps and sourcefiles to the release:
```js 
npm run sentryupload uploadsourcemap
``` 

Delete a sentry release:
```js 
npm run sentryupload delete <release name>
``` 