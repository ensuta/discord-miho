import discord
import random
import json
from discord.ext import commands
from discord.ext.commands import bot

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)

class Hello(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
            

    @commands.command(name='인사',aliases=responses["Hellos"][0]["input"])
    async def hello(self, ctx):
        await ctx.send(f'{random.choice(responses["Hellos"][0]["output"])}')

def setup(bot):
    bot.add_cog(Hello(bot))
