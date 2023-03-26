const { build } = require('esbuild')
const replace = require('replace-in-file')

build({
    entryPoints: ['./src/contract.ts'],
    outdir: './dist',
    bundle: true,
    minify: false,
    format: 'iife'
})
.finally(() => {
    replace.sync({
        files: ['./dist/contract.js'],
        from: [/\(\(\) => {/g, /}\)\(\);/g],
        to: '',
        countMatches: true,
    });
})