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

console.log(toChecksumAddress('0xe9a68bb8e83b16d6760d60a67f51a870a4215174'));
console.log(toChecksumAddress('0x5c201bcc64f90efb1328d76940e740bf933633ad'));
