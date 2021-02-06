import discord
import json
from discord.ext import commands
from discord.ext.commands import bot

with open('./data/nogarian.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)

class akmalang(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
            

    @commands.command(name='노가리안명사',aliases=["찐따어명사"])
    async def langnoun(self, ctx, *, words):
        await ctx.send(responses["Nouns"][0][words])

    @commands.command(name='노가리안동사',aliases=["찐따어동사"])
    async def langverb(self, ctx, *, words):
        await ctx.send(responses["Verbs"][0][words])

    @commands.command(name='노가리안고유명사', aliases=["찐따어고유명사"])
    async def langpronoun(self, ctx, *, words):
        await ctx.send(responses["ProNouns"][0][words])

def setup(bot):
    bot.add_cog(akmalang(bot))
