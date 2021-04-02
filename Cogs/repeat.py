#따라하기
from discord.ext.commands import bot
from discord.ext import commands
import discord
import time
import json

with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)["Commands"][0]

class Repeat(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="말해", aliases=responses["Repeats"])
    async def repeat(self, ctx, *, content):
        await ctx.send(f"{content}")

    @commands.command(name="도배", aliases=["호출","도배해","호출해","불러"])
    async def dobe(self, ctx, *, tags, times=0.2):
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 0/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 1/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 2/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 3/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 4/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 5/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 6/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 7/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 8/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``{times}초 뒤 재전송 9/10``")
        time.sleep(times)
        await ctx.send(f"{tags}\n{tags}\n{tags}\n{tags}\n``10회 도배 완료``")
        print (time.strftime(f'%m-%d-%H:%M:%S', time.localtime(time.time())), f"'{tags}'라는 내용이 도배됨")
        pass
        
def setup(bot):
    bot.add_cog(Repeat(bot))
