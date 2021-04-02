from discord.ext.commands import bot
from discord.ext import commands
import random
import json
import discord

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)

class Bye(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name='작별인사',aliases=responses["Byes"][0]["input"])
    async def bye(self, ctx):
        await ctx.send(f'{random.choice(responses["Byes"][0]["output"])}')

def setup(bot):
    bot.add_cog(Bye(bot))
