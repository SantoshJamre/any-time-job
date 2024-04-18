module.exports = {
    dbUrl: 'mongodb://127.0.0.1:27017/test',
    hashConfig: {
        SIGNERKEY: "jxspr8Ki0RYycVU8zykbdLGjFQ3McFsasaUH0uiiTvC8pVMXAn210wjLNmdZJzxUECKbm0QsEmYUSDzZvpjeJ9WmXA==",
        SALTSEPARATOR: "Bw==",
        ALGORITHM: "aes-256-cbc",
        IV_LENGTH: 16,
        IV_VALUE: "mfN5PaAnRvNRfLUJ0yfzJg==",
        KEYLEN: 32,
        PARAMS: {
            "N": 16384,
            "r": 8,
            "p": 1,
            "maxmem": 33554432
        }
    },
    jwt: {
        secret: "b6QBvxXz4LRQ3PXXDQuYlICO1dswewee",
        issuer: "test",
        accessTokenExpiresIn: "10 days",
        refreshTokenExpiresIn: "30 days"
      }    
}