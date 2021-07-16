/**
 * This bot example show how to direct a bot to collect a specific block type
 * or a group of nearby blocks of that type.
 */

const mineflayer = require('mineflayer')
const collectBlock = require('mineflayer-collectblock').plugin

const bot = mineflayer.createBot({
  host: "localhost",
  port: 58773,
  username: 'MiningBot'
})

bot.on('error',(e)=>{
    console.log(e)
})

bot.loadPlugin(collectBlock)

let mcData
bot.once('spawn', () => {
  mcData = require('minecraft-data')(bot.version)
})

bot.on('chat', (username, message) => {
  const args = message.split(' ')
  if (args[0] !== 'collect') return

  let count = 1
  if (args.length === 3) count = parseInt(args[1])

  let type = args[1]
  if (args.length === 3) type = args[2]

  const blockType = mcData.blocksByName[type]
  if (!blockType) {
    bot.chat(`"I don't know any blocks named ${type}.`)
    return
  }

  const blocks = bot.findBlocks({
    matching: blockType.id,
    maxDistance: 1000000000,
    count: count
  })

  if (blocks.length === 0) {
    bot.chat("I don't see that block nearby.")
    return
  }

  const targets = []
  for (let i = 0; i < Math.min(blocks.length, count); i++) {
    targets.push(bot.blockAt(blocks[i]))
  }

  bot.chat(`Found ${targets.length} ${type}(s)`)

  bot.collectBlock.collect(targets, err => {
    if (err) {
      // An error occurred, report it.
      bot.chat(err.message)
      console.log(err)
    } else {
      // All blocks have been collected.
      bot.chat('Done')
    }
  })
})
