import discord
import random
import json
import time
from discord.ext import commands
from discord.ext.commands import bot

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)["Hellos"][0]

class Hello(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
            
    @commands.command(name='인사',aliases=responses["input"])
    async def hello(self, ctx):
        answer = random.choice(responses["output"])
        await ctx.send(f'{answer}')
        print (time.strftime(f'%m-%d-%H:%M:%S', time.localtime(time.time())), answer)
        pass
    
def setup(bot):
    bot.add_cog(Hello(bot))
