from chatbot import Chat, register_call
from discord.ext.commands import bot
from discord.ext import commands
import wikipedia
import os
import asyncio
import discord

class Repeat(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['말해', '따라해'])
    async def repeat(self, ctx, *, content):
        await ctx.send(f"{content}")

def setup(bot):
    bot.add_cog(Repeat(bot))
