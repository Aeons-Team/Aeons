# XDrive DRE Contract
Warp smart contracts for XDrive designed to run on DRE nodes

(This is not integrated into XDrive yet)

#### Building and testing
building (esbuild)
```shell
npm run build
```

testing (arlocal)
```shell
npm run test
```

#### Deploying
first copy your wallet jwk to `/data`, file name should be `wallet.json`

deploy to testnet
```shell
npm run deploy:test
```

deploy to mainnet
```shell
npm run deploy:prod
```

deployed contract source id will be in `/data/contract_deployment.txt`
