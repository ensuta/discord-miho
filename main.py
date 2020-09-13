import discord
import asyncio
import os
import wikipedia
from discord.ext import commands
from discord.ext.commands import bot
from chatbot import Chat, register_call

# 접두사 & 상태Text
gametxt = discord.Game('레벨6 시프트 실험')
bot = commands.Bot(command_prefix='병신아 ', status=discord.Status.online, activity=gametxt)

#보안
bot.remove_command("help")
tokenkey = 'TOKEN_VAULE_IS_HERE'

#핸들러
startup_extensions = ['Cogs.Purge','Cogs.Bye','Cogs.Slfboom','Cogs.Ping','Cogs.Badwrd','Cogs.Hello','Cogs.Repeat']
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

#토큰
bot.run(tokenkey)
