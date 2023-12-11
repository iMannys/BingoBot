const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ALLOWED_STICKER_EXTENSIONS, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start the epic Sune bingo :)')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
		option.setName('bingo_link')
			.setDescription('Linket til bingo pladen. (Skal være 1 tal i slutningen af linket)')
            .setRequired(true)
    )
    .addChannelOption(option => 
        option.setName('bingo_channel')
            .setDescription('Kanalen bingo announcementet skal postes i')
            .setRequired(true)
    ),
    async execute(interaction, client) {
        let string = interaction.options.getString('bingo_link');
        let channel = interaction.options.getChannel('bingo_channel');

        let link = string.split("1")[0];
        
        let embed = new EmbedBuilder()
        .setTitle('DELTAG I SUNE BINGO HER!')
        .setDescription('Han er bare sulten :/')
        .setColor('ff0000')
        .setImage('https://i.imgur.com/Ca2MbuF.jpg')
        .setTimestamp()
        
        let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Få din plade')
                .setCustomId('plade_get')
                .setStyle(ButtonStyle.Danger)
        )

        let message = await channel.send({
            embeds: [embed], components: [row]
        })

        let alreadyHasBingo = [];
        const filter = i => i.customId === 'plade_get';
        const collector = channel.createMessageComponentCollector({ filter });
        
        collector.on('collect', async i => {
            if (!!alreadyHasBingo.find(id => {  
                return id.ID === i.user.id
            })) {
                i.reply({ content: 'Du har allerede en bingo plade! Check din DM.', ephemeral: true})
            } else {
                let length = alreadyHasBingo.length + 1
                if (length > 30) { // Hvis der er flere end 60 plader der skal være i brug sørg for at minusse med 60 også hvis length er for høj
                    length -= 30
                }
                i.user.send({ content: `${link}${length}` })
                i.reply({ content: 'Du har fået et link til en plade i din DM.', ephemeral: true });
                alreadyHasBingo.push({ID: i.user.id})
            }
        });

        await interaction.reply({ content: 'Sætter Sune bingo op.', ephemeral: true });
        await interaction.editReply({ content: 'Bingo er nu startet i den valgte kanal.', ephemeral: true });
    },
};