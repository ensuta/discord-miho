from chatbot import Chat, register_call
from discord.ext.commands import bot
from discord.ext import commands
import wikipedia
import os
import asyncio
import discord


class Slfboom(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['자폭해'])
    async def slfboom(self, ctx):
        await ctx.send('**알라후 아크바르**')


def setup(bot):
    bot.add_cog(Slfboom(bot))
