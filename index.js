const mineflayer = require('mineflayer')
const collectBlock = require('mineflayer-collectblock').plugin

const bot = mineflayer.createBot({
  host: "localhost",
  port: 51262,
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
  if (args[0] !== 'mine') return

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

bot.on('chat', (username,message)=>{
    if (message == 'drop') {
        const items = bot.inventory.items() // get the items

        const dropper = (i) => {
          if (!items[i]) return // if we dropped all items, stop.
          bot.tossStack(items[i], () => dropper(i + 1)) // drop the item, then wait for a response from the server and drop another one.
        }
        dropper(0)
    }
})


bot._client.on('update_health', (packet) => { 
    if (Math.floor(packet.health) <= 5){
       bot.chat("Leaving to save items, hp=5")
        bot.quit()
        }
})

       
