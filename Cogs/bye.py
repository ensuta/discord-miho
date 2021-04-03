import discord
import discord
import random
import json
import time
from discord.ext import commands
from discord.ext.commands import bot

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)["Byes"][0]

class Bye(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name='작별인사',aliases=responses["input"])
    async def bye(self, ctx, answer = random.choice(responses["output"])):
        await ctx.send(f'{answer}')
        print (time.strftime(f'%m-%d-%H:%M:%S', time.localtime(time.time())), answer)
        pass
        
def setup(bot):
    bot.add_cog(Bye(bot))
