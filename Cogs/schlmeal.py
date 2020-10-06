#급식 기능
from discord.ext.commands import bot
from discord.ext import commands
import discord
import neispy
import time
import json

neiskey = "e1fa7c85eafc46098f79c372457fa0b7"
with open('./data/chats.json', "r", encoding='UTF-8') as json_file:
    responses = json.load(json_file)

class Schlmeal(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="급식", aliases=responses["Commands"][0]["Meals"])
    async def meals(self, ctx, *, schoolname):

        neis = neispy.Client(neiskey)
        dates = time.strftime(f'%Y%m%d', time.localtime(time.time()))
        ulsans = "H10" #교육청 코드

        scinfo = await neis.schoolInfo(ATPT_OFCDC_SC_CODE=ulsans, SCHUL_NM=schoolname)
        SE = scinfo[0].SD_SCHUL_CODE  # 학교코드

        try:
            scmeal = await neis.mealServiceDietInfo(ulsans, SE, MLSV_YMD=dates)
            meal = scmeal[0].DDISH_NM.replace("<br/>", "\n")
            await ctx.send(f"교명 : ``{schoolname}``\n날짜 : ``{dates}``\n메뉴 :\n``{meal}``")
        except:
            await ctx.send(f"날짜 : ``{dates}``\n오늘은 급식 없어 급식충새끼야")


def setup(bot):
    bot.add_cog(Schlmeal(bot))
