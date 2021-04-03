# discord-miho
<img src=".\profile.jpg" style="zoom:70%;" /> 

Python 3.8 으로 작성된 Discord Bot



**개발 목적**

- 서버 이용 편의
- 오락 요소의 재미
- 프로그래밍 연습


**필수 라이브러리**

```
neispy
discord.py
```
**사용 가이드**

```
Cogs/data/configs.json
{
    "Tokenkey": "discord bot token here",
    "Mudtxt": "type mud text here",
    "Neiskey": "교육청에서 발급해주는 API 키가 필요합니다!! "
} 
```

**Prefix Settings**
```
Cogs/data/chats.json
"Prefixs": ["prefix1","prefix2"]
```

prefix 리로드 ``[파일이름]`` - ./Cogs의 파일을 다시 로드합니다.
prefix 삭제/지워 ``[정수]`` - 간단한 채팅 청소
prefix 급식/배고파/급식뭐야 ``[교명]`` - 급식 정보를 스크롤 합니다.(울산한정)
prefix 말해/따라해 ``[문자열]`` - 문장 따라하기 기능
prefix 명언/덕담 - 랜덤으로 명언을 말합니다
prefix ``[여러 인사 표현]`` - 인사를 받아줍니다
prefix ``[여러 작별 인사]`` - 작별인사를 받아줍니다.
```

