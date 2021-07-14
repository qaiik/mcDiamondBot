const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 61039,
    username: 'Bot',
});

bot.loadPlugin(pathfinder)


function locateEmeraldBlock () {
    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []
    bot.pathfinder.setMovements(movements)

    const emeraldBlock = bot.findBlock({
        matching: mcData.blocksByName.diamond_ore.id,
        maxDistance: 500000000000000
    })

    if (!emeraldBlock) {
        bot.chat("I can't see any diamond ore")
        return
    }

    const x = emeraldBlock.position.x
    const y = emeraldBlock.position.y + 1
    const z = emeraldBlock.position.z
    const goal = new GoalBlock(x, y, z)
    bot.pathfinder.setGoal(goal)
}

bot.on('message', locateEmeraldBlock)
