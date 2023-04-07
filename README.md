# XDrive
DApp for storing and managing files on Arweave

## Run locally
to test the full extent of the application, we need to run it locally on a secure context (access localhost over https)

### generating certificates for localhost
you can generate certificates using [mkcert](https://github.com/FiloSottile/mkcert). the certificates should be inside /ssl folder

```shell
cd ssl
mkcert localhost
```

### run the development server

```shell
npm run dev
```
