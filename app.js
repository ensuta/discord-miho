const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json");
const badwords = /words|to|block/gi;


client.on('ready', () => {
	console.log('Logged in as ${client.user.tag}!');
});

client.on("ready", () => {
    console.log(`Logged in : ${client.user.tag}`);
    client.user.setPresence({
        activity: {
            name: "미호야 도와줘"
        }
    });

client.on('message', msg => {
	if(msg.author.bot) return;
    let content = msg.content;
    
        if (content.startsWith("guild")) {
            if (split[1] === "length") {
                msg.reply(client.guilds.cache.size);
            }
        }
        if (content.startsWith("checkUser")) {
            msg.reply(client.users.cache.get(split[1]) !== undefined);
        }
        if (content.startsWith("sendMessage")) {
            try {
                client.users.cache.get(split[1]).send(split[2])
                msg.reply("succeeded")
            }
            catch (err) {
                msg.reply("failed")
            }
        }
        if (content.startsWith("blockUser")) {
            blacklist.push(split[1]);
            msg.reply("succeeded")
        }
        if (content.startsWith("eval")) {
            try {
                eval(split[1]);
                msg.reply("succeeded");
            }
            catch (err) {
                msg.reply("error");
            }
        }
    }

    if (content.startsWith("미호야") || content.startsWith("호야")) {
        const author = msg.author;
        const authorid = author.id;
        if(blacklist.includes(authorid)) return;
        const user = msg.mentions.users.first();
        const member = user && msg.guild.member(user);
        content = content.slice(4);

        // bad word blocker
        if (badwords.test(content)) {
            return msg.reply("바르고 고운 말 사용하는거예요!");
        }

        // If user typed nothing
        if (content === "") {
            const ranCat = files[pickRandom(gifCategory)];
            msg.channel.send(pickImg(ranCat));
        }

        // Help
        else if (content === "도와줘") {
            msg.channel.send("[미호아 or 호아] [명령어] 구조로 이루어져 있는 것이예요.\n말해 [문자] : 봇이 한 말을 따라 하는 것이예요. 마지막에 -지워를 붙이면 해당 메시지를 지우고 따라 하는 거예요.\n날씨 : 기상청에서 받은 중기예보를 알려주는 거예요.\n게임 : 주사위, 동전, 가위바위보\n제비뽑기 [@유저] : 유저 중 한 명만 당첨되는 거예요. 반드시 2인 이상 언급해야 하는 거예요.")
        } 

        // Greeting, Farewell
        else if (content === "안녕") {
            msg.react("안녕하셨어요?")
            .then(() => {
                msg.channel.send(pickImg(files.hi));
            })
        }
        else if (content === "잘 가" || content === "잘가") {
            msg.react("안녕히 주무시는 거예요")
            .then(() => {
                msg.channel.send(pickImg(files.bye));
            })
        }

		// Info
        else if (content.startsWith("자기소개")) {
            msg.reply("이름은 미호! /n성별은 여성인 것이예요 /n나쁜 생각은 안돼는 것이예요");
        }
		
		// Music
        else if (content.startsWith("재생해줘")) {
            const uri = content.split(" ")[1];
            if (!uri) return msg.reply("재생할 주소를 입력해주셔야 되는 것이예요.");
    
            const voiceChannel = msg.member.voice.channel;
    
            if (!voiceChannel) {
                return msg.reply("음성 채팅방에 들어가셔야 재생할 수 있어요오~");
            }
    
            voiceChannel.join().then(connection => {
                const stream = ytdl(uri, {filter: "audioonly"});
                const dispatcher = connection.play(stream);
    
                dispatcher.on("end", () => voiceChannel.leave());
            });
        }
		
		// Extra Functions
        else if (content.startsWith("말해")) {
            if (content.split(" ").length >= 2) {
                if (content.slice(-3) === "-지워") {
                    msg.channel.send(content.slice(0, -3).replace("말해 ", ""))
                    .then(() => {
                        try {
                            msg.delete();
                        }
                        catch(err) {
                            msg.channel.send("메시지 삭제 권한을 부여받지 못한거예요... \n링크를 통해 봇을 추가하시면 문제가 해결됩니다.");
                        }
                    })
                }
                else {
                    msg.channel.send(content.replace("말해 ", ""));
                }
            }
            else {
                msg.reply("``미호아 말해 [말할 내용]``이 올바른 사용법인거예요.")
            }
        }
		
		// weather
        else if (content === "날씨") {
            const date = () => {
                const now = new Date();
                const format = number => {
                    return `${number < 10 ? `0${number}` : number}`
                };
                let hhmm = 0;

                if (now.getHours() <= 6) {
                    now.setDate(now.getDate() - 1);
                    hhmm = "1800"
                }

                const month = now.getMonth() + 1;
                const date = now.getDate();
                hhmm = hhmm ? hhmm : now.getHours() < 18 ? "0600" : "1800";

                return `${now.getFullYear()}${format(month)}${format(date)}${hhmm}`
            };

            fetch(`http://apis.data.go.kr/1360000/MidFcstInfoService/getMidFcst?serviceKey=${keys.weatherApi}&pageNo=1&numOfRows=10&dataType=JSON&stnId=108&tmFc=${date()}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                msg.channel.send(data.response.body.items.item[0].wfSv)
            })
        }
			
		 // mini games
        else if (content === "주사위") {
            const result = Math.floor(Math.random() * 5 + 1);
            msg.reply(`${result === 1 ? "⚀ (1)" : result === 2 ? "⚁ (2)" : result === 3 ? "⚂ (3)" : result === 4 ? "⚃ (4)" : result === 5 ? "⚄ (5)" : "⚅ (6)"}`);
        }
        
		else if (content === "동전") {
            const result = Math.round(Math.random());
            msg.reply(`${result ? "앞" : "뒤"}`);
        }
        
		else if (content === "가위바위보") {
            const arr = ["✊", "✌️", "✋"];
            const choose = Math.round(Math.random() * 2);
            const filter = (reaction, user) => {
                return arr.includes(reaction.emoji.name) && user.id === msg.author.id;
            };

            Promise.all([
		        msg.react("✊"),
		        msg.react("✌️"),
		        msg.react("✋"),
            ])
            .catch(() => msg.reply("다음에 하고 싶은거예요"));

            msg.awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] })
	        .then(collected => {
                const reaction = collected.first();
                msg.reply(`${
                    reaction.emoji.name === "✊"
                    ?
                        choose === 0
                        ? "✊ 비긴거예요 😏"
                        : choose === 1
                            ? "✌️ 내가 지다니... 😥"
                            : "✋ 제가 이긴거예요!! 😁"
                    : reaction.emoji.name === "✌️"
                        ?
                            choose === 0
                            ? "✊ 제가 이긴거예요!! 😁"
                            : choose === 1
                                ? "✌️ 비긴거예요 😏"
                                : "✋ 내가 지다니... 😥"
                        :
                            choose === 0
                            ? "✊ 내가 지다니... 😥"
                            : choose === 1
                                ? "✌️ 제가 이긴거예요!! 😁"
                                : "✋ 비긴거예요 😏"
                }`);
                
	        });
        }
        
		else if (content.startsWith("제비뽑기")) {
            const users = msg.mentions.users;
            const size = users.size;
            
            if (size < 2) {
                msg.reply("2인 이상 언급해주셔야 되는거예요!")
            }
            else {
                const random = [...users][
                    Math.round(Math.random() * (size - 1))
                ];

                msg.channel.send(`당첨! 🎉<@${random[0]}>🎉`)
            }
        }
		
		else if (content.startsWith("타이머")) {
            const time = content.replace("타이머 ", "").split(" ");
            const regex = /^([0-9]+)(분|초|시간)$/;
            const timeToMs = (time, unit) => {
                return `${unit === "시간" ? time*3600000 : unit === "분" ? time*60000 : unit === "초" ? time*1000 : false}`
            };
            try {
                let result = 0;
                time.forEach(time => {
                    const match = time.match(regex);
                    result += +timeToMs(match[1], match[2])
                })
                if (result > 10800000) return msg.reply("3시간 이하로 설정해주시는거예요!");
                msg.reply(`${result/1000}초 뒤에 알려드릴게요오~ ⏲️`)
                .then(() => {
                    setTimeout(() => {
                        msg.reply("띠리리링 🔔")
                    }, result)
                })
            }
            catch (err) {
                msg.reply("올바른 시간을 입력해주시는거예요")
            }
        }
        
		
		//EasterEgg
		else if (content.startWith("마법주문 엄준식")) {
			msg.channel.send("엄/n준/n식")
		}
		
client.login(token.token);
