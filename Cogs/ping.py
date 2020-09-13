from chatbot import Chat, register_call
from discord.ext.commands import bot
from discord.ext import commands
import wikipedia
import os
import asyncio
import discord

class Ping(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['핑확인'])
    async def ping(self, ctx):
        return await ctx.send(f'{int(round(commands.latency, 0))}ms')

def setup(bot):
    bot.add_cog(Ping(bot))
