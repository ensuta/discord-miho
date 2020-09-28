import discord
import asyncio
import os
import random
import json
from discord.ext import commands
from discord.ext.commands import bot

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)

class Badwrd(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        

    @commands.command(name='나쁜말',aliases=responses["Badwrds"][0]["input"])
    async def badword(self, ctx):
        await ctx.send(f'{random.choice(responses["Badwrds"][0]["output"])}')
    
def setup(bot):
    bot.add_cog(Badwrd(bot))
