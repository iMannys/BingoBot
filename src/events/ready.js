const { ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        try {
            await client.user.setPresence({
                 activities: [
                    {
                        name: 'Lectio for den næste fællessamling',
                        type: ActivityType.Watching,
                    },
                ],

                status: 'online'
            })
        } catch (error) {
            console.error(error);
        }
    },
};