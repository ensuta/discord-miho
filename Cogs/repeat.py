#따라하기
from discord.ext.commands import bot
from discord.ext import commands
import discord
import json

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)

class Repeat(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="말해", aliases=responses["Commands"][0]["Repeats"])
    async def repeat(self, ctx, *, content):
        await ctx.send(f"{content}")

def setup(bot):
    bot.add_cog(Repeat(bot))
