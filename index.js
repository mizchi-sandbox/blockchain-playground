/* @flow */
import SHA256 from 'crypto-js/sha256'

type Block = {
  index: number,
  previousHash: string,
  timestamp: number,
  data: string,
  hash: string
}

type BlockChain = Block[]

/* initial block chain */
export function getGenesisBlock(): Block {
  return createBlock(
    0,
    '0',
    1465154705,
    'my genesis block!!',
    '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7'
  )
}

export function getLatestBlock(blockchain: BlockChain): Block {
  return blockchain[blockchain.length - 1]
}

/* implementation */

export function createBlock(
  index: number,
  previousHash: string,
  timestamp: number,
  data: any,
  hash: string
): Block {
  return {
    index,
    previousHash,
    timestamp,
    data,
    hash
  }
}

export function calculateHashForBlock(block: Block) {
  return calculateHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.data
  )
}

export function calculateHash(
  index: number,
  previousHash: string,
  timestamp: number,
  data: string = ''
): string {
  return SHA256(index + previousHash + timestamp + data).toString()
}

export function generateNextBlock(
  blockchain: BlockChain,
  blockData: string = ''
): Block {
  const previousBlock = getLatestBlock(blockchain)
  const nextIndex = previousBlock.index + 1
  const nextTimestamp = ~~(Date.now() / 1000)
  const nextHash = calculateHash(
    nextIndex,
    previousBlock.hash,
    nextTimestamp,
    blockData
  )
  return {
    index: nextIndex,
    previousHash: previousBlock.hash,
    timestamp: nextTimestamp,
    data: blockData,
    hash: nextHash
  }
}

export function isValidNewBlock(
  newBlock: Block,
  previousBlock: Block
): boolean {
  if (previousBlock.index + 1 !== newBlock.index) {
    console.log('invalid index')
    return false
  } else if (previousBlock.hash !== newBlock.previousHash) {
    console.log('invalid previoushash')
    return false
  } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
    console.log(
      'invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash
    )
    return false
  }
  return true
}

export function isValidChain(blockchainToValidate: BlockChain): boolean {
  // check genesis block
  if (
    JSON.stringify(blockchainToValidate[0]) !==
    JSON.stringify(getGenesisBlock())
  ) {
    return false
  }

  const tempBlocks = [blockchainToValidate[0]]
  for (var i = 1; i < blockchainToValidate.length; i++) {
    if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
      tempBlocks.push(blockchainToValidate[i])
    } else {
      return false
    }
  }
  return true
}

export function addBlock(blockchain: BlockChain, newBlock: Block): BlockChain {
  if (isValidNewBlock(newBlock, getLatestBlock(blockchain))) {
    return blockchain.concat([newBlock])
  }
  return blockchain
}
