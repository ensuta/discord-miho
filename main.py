from discord.ext import commands
import discord
import os
import random
import time
import json

# json 불러오기
with open("Cogs/data/chats.json", "r", encoding="UTF-8") as json_file:
    json_data = json.load(json_file)
with open("Cogs/data/configs.json", "r", encoding="UTF-8") as cfg_data:
    configs = json.load(cfg_data)    
#-----------------설정--------------------------------------------------------
tokenkey = configs["Tokenkey"]
mudtxt = configs["Mudtxt"]
prefix = json_data["Prefixs"]
# Change /Cogs/data/configs.json
# Change /Cogs/data/chats.json
#-----------------------------------------------------------------------------


# 접두사 & 상태Text
gametxt = discord.Game(mudtxt)
bot = commands.Bot(command_prefix=prefix, status=discord.Status.online, activity=gametxt, intents=discord.Intents.all())

#보안
bot.remove_command("help")

#핸들러
commandlist = [
    "Cogs.bye",
    "Cogs.goodwrd",
    "Cogs.hello",
    "Cogs.repeat",
    "Cogs.schlmeal",
    "Cogs.purge",
    "Cogs.badwrd",
    "Cogs.wlslang",
    "Cogs.Today"
    ]

os.chdir("./Cogs")
if __name__ == "__main__":
    for extension in commandlist:
        try:
            bot.load_extension(extension)
        except Exception as err:
            print("ERROR : {}\n{}".format(extension,"{}: {}".format(type(err).__name__, err)))

#콘솔
@bot.event
async def on_ready():
    print("----------------------")
    print("Logged in as")
    print(f"USERNAME : {bot.user.name}")
    print(f"I   D : {bot.user.id}")
    print("---------------------")
    
#예외 처리
@bot.event
async def on_command_error(ctx, error):
    print (time.strftime(f'%m-%d-%H:%M:%S', time.localtime(time.time())), error)
    await ctx.send(f'{random.choice(json_data["Excepts"])}')
    pass

#리로드
@bot.command(aliases=["리로드"])
async def load_commands(ctx, extension):
    bot.reload_extension(f"Cogs.{extension}")
    await ctx.send(f":white_check_mark: {extension}을(를) 리로드했다!")
        
# 토큰 동작
bot.run(tokenkey)
