const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6624811684:AAEA-JKSGu3tiNJaqJ2m22NyAcqeq1-E2-A'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Now I'll guess a number from 0 to 9 and you guess`)
        const randomNumber = Math.floor(Math.random() * 10)
        chats[chatId] = randomNumber;
        await bot.sendMessage(chatId, 'Guess', gameOptions)
}

bot.setMyCommands([
    { command: '/start', description: 'Greetings' },
    { command: '/info', description: 'Information' },
    { command: '/game', description: 'Guess the number' }
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        await bot.sendMessage(chatId, `Welcome to my own telegram bot`)
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d09/75d/d0975de5-0e7b-36f9-9f4b-b8c5844ad488/7.webp');
    }

    if (text === '/info') {
        await bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`)
    }

    if (text === '/game') {
        return startGame(chatId);
    }

    if (!['/start', '/info', '/game'].includes(text)) {
        await bot.sendMessage(chatId, `I don't understand you, try again`)
    }
})

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id
    if(data === '/again'){
        return startGame(chatId)
    }
    if(data === chats[chatId]) {
        return await bot.sendMessage(chatId, `YOU WON ${chats[chatId]}`, againOptions)
    } else {
        return await bot.sendMessage(chatId, `YOU LOSE, the bot guessed a number ${chats[chatId]}`, againOptions)
    }
})