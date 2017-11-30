/* @flow */
import {
  getGenesisBlock,
  generateNextBlock,
  getLatestBlock,
  addBlock,
  isValidChain,
  isValidNewBlock
} from './index'
import range from 'lodash.range'

const blockchain = [getGenesisBlock()]

const wait = n => new Promise(resolve => setTimeout(resolve, n))

// It should not be singleton but easy to test.
let receivedBlockchain = [getGenesisBlock()]
const bloadcast = (name, next) => {
  console.log(`${name} bloadcasted`)
  receivedBlockchain = next
}

const createMiner = (name: string) => {
  let myBlockchain = blockchain.slice()

  const accept = () => {
    console.log(
      `${name} checks receivedBlockchain. Size: ${receivedBlockchain.length}`
    )
    if (receivedBlockchain.length > myBlockchain.length) {
      if (isValidChain(receivedBlockchain)) {
        console.log(`${name} accepted received blockchain`)
        myBlockchain = receivedBlockchain
      } else {
        console.log('Received blockchain invalid')
      }
    }
  }

  const addNewBlock = () => {
    const next = generateNextBlock(myBlockchain)
    myBlockchain = addBlock(myBlockchain, next)
    console.log(`${name} add new block: ${next.hash}`)
  }

  return async () => {
    while (true) {
      await wait(Math.random() * 3000)
      accept()
      range(~~(Math.random() * 3)).forEach(_ => addNewBlock())
      bloadcast(name, myBlockchain)
    }
  }
}

// competitive miners
createMiner('miner1')()
createMiner('miner2')()
createMiner('miner3')()
