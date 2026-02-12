export const stateTypingDelay = async (msg) => {
    const chat = await msg.getChat();
    await new Promise(res => setTimeout(res, 1000));
    await chat.sendSeen();
    await chat.sendStateTyping();
    await new Promise(res => setTimeout(res, 3000));

}