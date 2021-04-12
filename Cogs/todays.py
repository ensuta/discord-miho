import discord
import time
from discord.ext import commands
from discord.ext.commands import bot

class Todays(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command(name='오늘')
    async def bye(self, ctx):
        nows = time.ctime(time.time())
        await ctx.send(f"{nows}")
        print ("출력된 시간", nows)
        pass
        
def setup(bot):
    bot.add_cog(Todays(bot))
