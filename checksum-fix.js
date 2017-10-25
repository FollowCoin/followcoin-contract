const createKeccakHash = require('keccak')

function toChecksumAddress (address) {
  address = address.toLowerCase().replace('0x','');
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

//console.log(toChecksumAddress('0x656b382b8424f8a2627c898e2e1de89d5cdf8eec'));
console.log(toChecksumAddress('0xf174528db0fcedcf34dd6372766a95a3ff0b1e63'));
