module.exports = {
    data : {
        name: 'delete_ticket'
    },
    async execute(interaction){
        interaction.channel.delete();
    }
}