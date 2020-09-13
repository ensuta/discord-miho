import discord
import asyncio
import os
import wikipedia
from discord.ext import commands
from discord.ext.commands import bot
from chatbot import Chat, register_call

class Badwrd(commands.Cog):
    def __init__(self,bot):
        self.bot = bot
    @commands.command(aliases=['노엄마','느그어매','凸', '병신이야', '병신이니', '느금마', '나가뒤져', '애미없니', '도움말'])
    async def badword(self, ctx):
        await ctx.send('凸')
    
def setup(bot):
    bot.add_cog(Badwrd(bot))