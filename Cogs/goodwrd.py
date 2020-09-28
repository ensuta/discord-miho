import discord
import os
import json
import random
from discord.ext import commands
from discord.ext.commands import bot

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)["Goodwrds"][0]

class Goodwrd(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name='명언', aliases=responses["input"])
    async def badword(self, ctx):
            
        await ctx.send(f'``{random.choice(responses["output"])}``')
def setup(bot):
    bot.add_cog(Goodwrd(bot))
