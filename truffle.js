module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "60.226.80.194",
      port: 8545,
      gas: 1000000,
      network_id: "3"
    }
  }
};
