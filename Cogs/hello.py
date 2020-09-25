import discord
import asyncio
import os
import wikipedia
from discord.ext import commands
from discord.ext.commands import bot
from chatbot import Chat, register_call

class Hello(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name='인사',aliases=['안녕', '안녕하세요', '하이'])
    async def hello(self, ctx):
        await ctx.send('인사 잘~하네')

def setup(bot):
    bot.add_cog(Hello(bot))
