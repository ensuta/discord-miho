#따라하기
import discord
from discord.ext.commands import bot
from discord.ext import commands
import time
import json
import asyncio

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)["Commands"][0]

logtimes = time.strftime(f'%m-%d-%H:%M:%S', time.localtime(time.time()))
class Repeat(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="말해", aliases=responses["Repeats"])
    async def repeat(self, ctx, *, content):
        await ctx.send(f"{content}")

    @commands.command(name="도배", aliases=["호출","도배해","호출해","불러"])
    async def dobe(self, ctx, times:float, num:int, *, tags):
        i = 1
        print(logtimes, f"{tags}(이)가 {times}동안 {num}번")
        while i <= num:
          await ctx.send(f"`{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 {i}/{num}`")
          await asyncio.sleep(times)
          i = i + 1
        if i > num:
          pass
        
def setup(bot):
    bot.add_cog(Repeat(bot))
