# XDrive Contract
Warp smart contracts for XDrive

#### Building and testing
building wasm
```shell
npm run build-wasm
```

testing (arlocal)
```shell
npm run test
```

#### Deploying
first copy your wallet jwk to `/data`, file name should be `wallet.json`

```shell
npm run deploy
```

deployed contract data will be in `/data/contract_deployment.json`