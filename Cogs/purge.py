from chatbot import Chat, register_call
from discord.ext.commands import bot
from discord.ext import commands
import wikipedia
import os
import asyncio
import discord

class Purge(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['지워', '삭제', '제거'])
    async def purge(self, ctx, limit: str = None):
        if not limit:
            return await ctx.send('삭제할 메시지의 개수를 입력해라.')
        try:
            await ctx.channel.purge(limit=int(limit) + 1)
        except ValueError:
            return await ctx.send('입력하신 값은 숫자가 아니다.')
        except discord.errors.Forbidden:
            return await ctx.send('봇의 권한이 부족하다.')
        return await ctx.send(f'{limit}개의 메시지가 삭제됐다.', delete_after=5)


def setup(bot):
    bot.add_cog(Purge(bot))
