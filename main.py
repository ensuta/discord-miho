from chatbot import Chat, register_call
from discord.ext.commands import bot
from discord.ext import commands
import discord
import os
import random
import wikipedia
import time
import json

# json 불러오기
with open(".\Cogs\data\chats.json", "r", encoding="UTF-8") as json_file:
    json_data = json.load(json_file)
with open(".\Cogs\data\configs.json", "r", encoding="UTF-8") as cfg_data:
    configs = json.load(cfg_data)    
#-----------------설정--------------------------------------------------------
tokenkey = configs["Tokenkey"]
mudtxt = configs["Mudtxt"]
prefix = configs["Prefixs"]
wikipedia.set_lang("ko")
#
#-----------------------------------------------------------------------------


# 접두사 & 상태Text
gametxt = discord.Game(mudtxt)
bot = commands.Bot(command_prefix=prefix, status=discord.Status.online, activity=gametxt)

#보안
bot.remove_command("help")

#핸들러
commandlist = [
    "Cogs.bye",
    "Cogs.badwrd",
    "Cogs.goodwrd",
    "Cogs.hello",
    "Cogs.repeat",
    "Cogs.schlmeal",
    "Cogs.purge"]

os.chdir(".\Cogs")
if __name__ == "__main__":
    for extension in commandlist:
        try:
            bot.load_extension(extension)
        except Exception as err:
            print("ERROR : {}\n{}".format(extension,"{}: {}".format(type(err).__name__, err)))

#콘솔
@bot.event
async def on_ready():
    print("Logged in as")
    print(f"USERNAME : {bot.user.name}")
    print(f"I   D : {bot.user.id}")
    print("---------------------")


#예외 처리
@bot.event
async def on_command_error(ctx, error):
    await ctx.send(f"{random.choice(json_data['Excepts'])}")
    print(error)
    pass

#리로드
@bot.command(aliases=["리로드"])
async def load_commands(ctx, extension):
    bot.unload_extension(f"Cogs.{extension}")
    bot.load_extension(f"Cogs.{extension}")
    await ctx.send(f":white_check_mark: {extension}을(를) 리로드했다!")

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
    return f"나도 {query}가 뭔진 잘 모르겠다"

template_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "list.template")
chats = Chat(template_file_path)

# 검색 기능
@bot.command(name="찾기", aliases=json_data["Commands"][0]["Searchs"], pass_context=True)
async def search(ctx, *, message):
    await ctx.send("찾고 있다 기다려봐...")
    result = chats.respond(message)
    try:
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
    except:
        await ctx.send("검색에 실패함 ㅅㄱ")
        
#토큰
bot.run(tokenkey)
