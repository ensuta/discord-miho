import discord
import json
import time
import random
from discord.ext import commands
from discord.ext.commands import bot

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)["Goodwrds"][0]

class Goodwrd(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name='명언', aliases=responses["input"])
    async def badword(self, ctx, answer = random.choice(responses["output"])):
        await ctx.send(f'``{answer}``')
        print (time.strftime(f'%m-%d-%H:%M:%S', time.localtime(time.time())), answer)
        pass
    
def setup(bot):
    bot.add_cog(Goodwrd(bot))
