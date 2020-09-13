import discord
import asyncio
import os
import wikipedia
from discord.ext import commands
from discord.ext.commands import bot
from chatbot import Chat, register_call

# 위키 언어
wikipedia.set_lang("ko")

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
    return "가 뭔지 궁금한거예요 "+query

template_file_path = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), "data", "list.template")
chat = Chat(template_file_path)


class Search(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    # 검색 기능
    @commands.command(pass_context=True)
    async def 검색(self, ctx, *, message):
        result = chat.respond(message)
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


def setup(bot):
    bot.add_cog(Search(bot))
