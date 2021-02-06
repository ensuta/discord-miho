# discord-miho
<img src=".\profile.jpg" style="zoom:70%;" /> 

Python 3.8 으로 작성된 Discord Bot



개발 목적

- 서버 이용 편의
- 오락 요소의 재미
- 스트레스 해소(?)
- 프로그래밍 연습



사용 가이드

```
교육청에서 발급해주는 API 키가 필요합니다!!
Cogs\data\configs.json
neiskey = [API 키]
디스코드 봇 토큰 넣는 곳
Cogs\data\cofigs.json

접두사 설정
Cogs\data\configs.json
prefix = "병신아", "ㅄ아", "ㅂㅅ아 ", "이놈아 ", "상놈아 ", "개놈아 ", "잡것아 ", "상것아 ", "어이 ", "문디야 ", "야이새끼야 "

prefix 리로드 [파일이름] - ./Cogs의 파일을 다시 로드합니다.
prefix 삭제/지워 [정수] - 간단한 채팅 청소
prefix 검색 해줘 [문자열] - wikipedia korea 에서 검색을 시도합니다.
prefix 급식/배고파/급식뭐야 [교명] - 급식 정보를 스크롤 합니다.(울산한정)
prefix 말해/따라해 [문자열] - 문장 따라하기 기능
prefix 명언/덕담 - 랜덤으로 명언을 말합니다
prefix [여러 인사 표현] - 인사를 받아줍니다
prefix [여러 작별 인사] - 작별인사를 받아줍니다.
prefix [욕설] - 욕을 대신 먹습니다.
```



사용된 라이브러리

```
pip install -r requirement.txt
```



requirement.txt (below)

```
aiohttp>=3.6.2
astroid>=2.4.2
async-timeout>=3.0.1
asyncio>=3.4.3
attrs>=20.2.0
autopep8>=1.5.4
cffi>=1.14.2
chardet>=3.0.4
colorama>=0.4.3
discord>=1.0.1
discord.py>=1.4.1
gevent>=20.6.2
greenlet>=0.4.16
idna>=2.10
importlib>=1.0.4
isort>=5.4.2
lazy-object-proxy>=1.4.3
mccabe>=0.6.1
MouseInfo>=0.1.3
multidict>=4.7.6
numpy>=1.19.1
opencv-python>=4.4.0.42
Pillow>=7.2.0
PyAutoGUI>=0.9.50
pycodestyle>=2.6.0
pycparser>=2.20
pygame>=1.9.6
PyGetWindow>=0.0.8
pylint>=2.6.0
PyMsgBox>=1.0.8
pyperclip>=1.8.0
PyQt5>=5.15.0
PyQt5-sip>=12.8.1
PyRect>=0.1.4
PyScreeze>=0.1.26
PyTweening>=1.0.3
six>=1.15.0
toml>=0.10.1
websocket>=0.2.1
websockets>=8.1
wrapt>=1.12.1
yarl>=1.5.1
zope.event>=4.4
zope.interface>=5.1.0
```

