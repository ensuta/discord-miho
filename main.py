import discord
import asyncio
import os
import wikipedia
import time
import neispy
from discord.ext import commands
from discord.ext.commands import bot
from chatbot import Chat, register_call

#-----------------설정--------------------------------------------------------
prefix = '병신아 '
tokenkey = ''
wikipedia.set_lang("ko")
#
#-----------------------------------------------------------------------------

# 접두사 & 상태Text
gametxt = discord.Game('레벨6 시프트 실험')
bot = commands.Bot(command_prefix=prefix, status=discord.Status.online, activity=gametxt)

#보안
bot.remove_command("help")

#핸들러
startup_extensions = [
    'Cogs.bye',
    'Cogs.slfboom',
    'Cogs.badwrd',
    'Cogs.hello']
os.chdir('.\Cogs')
if __name__ == '__main__':
    for extension in startup_extensions:
        try:
            bot.load_extension(extension)
        except Exception as err:
            print('ERROR : {}\n{}'.format(extension,'{}: {}'.format(type(err).__name__, err)))

#콘솔
@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')


#리로드
@bot.command(aliases=['리로드'])
async def load_commands(ctx, extension):
    bot.load_extension(f"Cogs.{extension}")
    await ctx.send(f":white_check_mark: {extension}을(를) 로드했다!")

#언로드
@bot.command(aliases=['언로드'])
async def unload_commands(ctx, extension):
    bot.unload_extension(f"Cogs.{extension}")
    await ctx.send(f":white_check_mark: {extension}을(를) 언로드했다!")



#삭제 기능
@bot.command(name='삭제',aliases=['지워','없애', '제거'])
async def purge(ctx, limit: str = None):
    if not limit:
        return await ctx.send('삭제할 메시지의 개수를 입력해라.')
    try:
        await ctx.channel.purge(limit=int(limit) + 1)
    except ValueError:
        return await ctx.send('입력하신 값은 숫자가 아니다.')
    except discord.errors.Forbidden:
        return await ctx.send('봇의 권한이 부족하다.')
    return await ctx.send(f'{limit}개의 메시지가 삭제됐다.', delete_after=5)
        
@register_call("whoIs")
def who_is(query, session_id="general"):
    try:
        return wikipedia.summary(query)
    except Exception:
        for new_query in wikipedia.search(query):
            try:
                return wikipedia.summary(new_query)
            except Exception:
                pass
    return "가 뭔지 궁금해? "+query

template_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "list.template")
chats = Chat(template_file_path)

# 검색 기능
@bot.command(pass_context=True)
async def 검색(ctx, *, message):
    result = chats.respond(message)
    if(len(result) <= 2048):
        embed = discord.Embed(
            title="검색 결과", description=result, color=(0xD700F5))
        await ctx.send(embed=embed)
    else:
        embedList = []
        n = 2048
        embedList = [result[i:i+n] for i in range(0, len(result), n)]
        for num, item in enumerate(embedList, start=1):
            if(num == 1):
                embed = discord.Embed(
                    title="검색 결과", description=item, color=(0xD700F5))
                embed.set_footer(text="페이지 {}".format(num))
                await ctx.send(embed=embed)
            else:
                embed = discord.Embed(description=item, color=(0xD700F5))
                embed.set_footer(text="페이지 {}".format(num))
                await ctx.send(embed=embed)

#급식 기능
@bot.command(name='급식')
async def meals(ctx, *, schoolname, dates: str = None):
    
    neis = neispy.Client('e1fa7c85eafc46098f79c372457fa0b7')

    scinfo = await neis.schoolInfo(ATPT_OFCDC_SC_CODE='H10', SCHUL_NM=schoolname)
    AE = scinfo[0].ATPT_OFCDC_SC_CODE  # 교육청코드
    SE = scinfo[0].SD_SCHUL_CODE  # 학교코드

    try:
        scmeal = await neis.mealServiceDietInfo(AE, SE, MLSV_YMD=dates)
        meal = scmeal[0].DDISH_NM.replace("<br/>", "\n")
        await ctx.send(schoolname, '\n', meal)
    except:
        await ctx.send('오늘은 급식 없어 급식충새끼야')
        
#따라하기
@bot.command(name='말해', aliases=['라고해','따라해'])
async def repeat(ctx, *, content):
    await ctx.send(f"{content}")

#토큰
bot.run(tokenkey)
