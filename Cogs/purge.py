#삭제 기능
from discord.ext.commands import bot
from discord.ext import commands
import discord
import time

class Purge(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="삭제",aliases=["지워","없애", "제거", "지워줘"])
    async def purge(self, ctx, limit: str = None):
        if not limit:
            return await ctx.send("삭제할 메시지의 개수를 입력해라.")
        try:
            await ctx.channel.purge(limit=int(limit) + 1)
        except ValueError:
            return await ctx.send("입력하신 값은 숫자가 아니다.")
        except discord.errors.Forbidden:
            return await ctx.send("봇의 권한이 부족하다.")
        print (time.strftime(f'%m-%d-%H:%M:%S', time.localtime(time.time())), "{limit}개의 메세지 삭제됨")
        return await ctx.send(f"{limit}개의 메시지가 삭제됐다.", delete_after=3)


def setup(bot):
    bot.add_cog(Purge(bot))
