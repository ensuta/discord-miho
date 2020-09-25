from chatbot import Chat, register_call
from discord.ext.commands import bot
from discord.ext import commands
import wikipedia
import os
import asyncio
import discord


class Bye(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name='작별인사',aliases=['잘가', '바이', '빠이'])
    async def bye(self, ctx):
        await ctx.send('꺼져')

def setup(bot):
    bot.add_cog(Bye(bot))
