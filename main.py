import asyncio,discord,os
from discord.ext import commands

token_path = os.path.dirname( os.path.abspath(__file__ ) )+"/env/token.txt"
t = open(token_path,"r",encoding="utf-8")
token = t.read().split()[0]
print("Token_key : ",token)

# 접두사 & 상태Text
gametxt = discord.Game('레벨6 시프트 실험')
bot = commands.Bot(command_prefix='미호야 ',status=discord.Status.online,activity=gametxt)

@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')

@bot.command()
async def 안녕(ctx):
    await ctx.send('안녕하신거예요!')

@bot.command()
async def 잘가(ctx):
    await ctx.send('조심히 가는거예요!')

@bot.command()
async def 뭐해(ctx):
    await ctx.send('미호는 조금씩 성장하고 있다구요!')

@bot.command()
async def 엄준식(ctx):
    await ctx.send('엄\n준\n식')

@bot.command()
async def 샌즈(ctx):
    await ctx.send('와 샌즈 아시는구나! 겁·나·어·렵·습·니·다')

bot.run(token)
