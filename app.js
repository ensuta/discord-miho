const Discord = require('discord.js');
const fetch = require("node-fetch");
const crypto = require("crypto");
const fs = require("fs");
const token = require("./token.json");
const client = new Discord.Client();
const encryptKey = 'aDogWlsHxuRWLMwz5zkVguZboXn9CXYJ';
const blacklist = [];
const badwords = /words|to|block/gi;

let latestInsta = null;

const pickRandom = array => {
    return array[Math.round(Math.random() * (array.length - 1))];
};

const quickSort = (arr, l, r) => {
    let i;

    (l < r) &&
    (
        i =  partition(arr, l, r),

        quickSort(arr, l, i - 1),
        quickSort(arr, i + 1, r)
    )

    return arr
};
const partition = (arr, l, r) => {
    let i = l,
        j = r,
        pivot = arr[l];

    while (i < j)
    {
        while (arr[j] > pivot) j--;
        while (i < j && arr[i] <= pivot) i++;
        tmp = arr[i], arr[i] = arr[j], arr[j] = tmp
    }
    return arr[l] = arr[j], arr[j] = pivot, j
};
const parse = raw => {
    try {
        return JSON.parse(raw);
    }
    catch (err) {
        return false;
    }
};


const encrypt = text => {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptKey), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
};
const decrypt = text => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptKey), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};

client.on("ready", () => {
    console.log(`Logged in : ${client.user.tag}`);
    client.user.setPresence({
        activity: {
            name: "미호야 도와줘 - 명령어 확인"
        }
    });
    
    fetchInsta("init"),

    setInterval(() => {
        fetchInsta("check")
    }, 1800000)
});

client.on("message", msg => {
    if(msg.author.bot) return;
    let content = msg.content;
    
    if (content.startsWith("!!") && msg.author.id === "285671139110420490") {
        content = content.slice(2);
        split = content.split(" ");
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

    if (content.startsWith("미호야")) {
        const author = msg.author;
        const authorid = author.id;
        if(blacklist.includes(authorid)) return;
        const user = msg.mentions.users.first();
        const member = user && msg.guild.member(user);
        content = content.slice(4);

        // 나쁜 말 탐지견
        if (badwords.test(content)) {
            return msg.reply("바르고 고운 말 사용하는거예요!");
        }

        // 도움!
        else if (content === "도와줘") {
            msg.channel.send("``[미호야] [명령어]`` 구조로 이루어져 있는거예요.\n``말해 [문자]`` : 봇이 한 말을 따라 하는거예요. 마지막에 ``-지워``를 붙이면 해당 메시지를 지우고 따라 하는거예요\n``정렬해줘 [배열]`` : Quick Sort로 배열을 정렬해주는거예요.\n``역할 [행동(추가 / 삭제)] [@유저] [역할 이름]`` : 유저의 역할을 관리하는거예요.\n유튜브 : 유튜브를 켜주는거예요.\n``타이머 [시간(n시간 n분 n초)]`` : 설정한 시간 뒤에 알림을 보내주는거예요.\n``암호 [행동(생성 / 해독)] [문자열]`` : 문자열을 암호화, 복화화해주는거예요.\n``소수 [숫자](번째)`` : [숫자]번째 소수를 알려줄꺼예요. \n게임은``동전, 가위바위보, 주사위``로 게임을 할 수 있는거예요."
		)}

        // 인사 
        else if (content === "안녕") || (content === "안녕하세요") || (content === "안녕하신거예요") {
            msg.react("안녕하신거예요")
        }
        else if (content === "잘 가" || content === "잘가" || content === "바이") {
            msg.react("잘 가는거예요")
        }

        // 자기소개
        else if (content.startsWith("자기소개")) {
            msg.reply("미호예요! \n나쁜 말은 안되는거예요!");
        }
        
        else if (content === "유튜브") {
            msg.channel.send("https://www.youtube.com/");
        }

        // 추가 기능
        
		//대답하기
		else if (content.startsWith("말해")) {
            if (content.split(" ").length >= 2) {
                if (content.slice(-3) === "-지워") {
                    msg.channel.send(content.slice(0, -3).replace("말해 ", ""))
                    .then(() => {
                        try {
                            msg.delete();
                        }
                        catch(err) {
                            msg.channel.send("메시지 삭제 권한을 부여받지 못한거예요. \n링크를 통해 봇을 추가하시면 문제가 해결돼요.");
                        }
                    })
                }
                else {
                    msg.channel.send(content.replace("말해 ", ""));
                }
            }
            else {
                msg.reply("``미호야 말해 [말할 내용]``이 올바른 사용법인 거예요.")
            }
        }
        
		//집합시키기
		else if (content === "집합시켜") {
            msg.channel.send(`@everyone ${author}님이 집합하시랍니다!`)
        }
        
		//수열생성
		else if (content.startsWith("정렬해줘")) {
            const arrRegex = content.match(/\[(.*)\]/g);
            if (arrRegex) {
                const array = arrRegex[0];
                const start = new Date().getTime();
                const parsed = parse(array) ;

                if (parsed) {
                    const sorted = quickSort(parsed, 0, parsed.length - 1);
                    msg.reply(`[${sorted}]\n정렬하는데 \`\`${new Date().getTime() - start}ms\`\`가 소요되는거예요.`);
                }
                else {
                    msg.reply("정렬할 수 없는 배열인 거예요 😥")
                }
            }
            else {
                msg.reply("``미호야 정렬해줘 [배열]``로 정렬할 수 있는거예요.")
            }
        }
        
		//암호
		else if (content.startsWith("암호")) {
            const split = content.split(" ");
            const action = split[1];

            if (action === "생성") {
                msg.reply(encrypt(split.slice(2).join(" ")));
            }
            else if (action === "해독") {
                try {
                    msg.reply(decrypt(split[2]));
                }
                catch(err) {
                    msg.reply("복호화에 실패한거예요. 😥")
                }
            }
            else {
                msg.reply("암호 [행동(생성, 해독)] [문자열]로 암호를 생성하고 해독할 수 있는거예요")
            }
        }
        
		//타이머 기능
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
                if (result > 10800000) return msg.reply("3시간 이하로 설정해주세요!");
                msg.reply(`${result/1000}초 뒤에 알려드리는거예요! ⏲️`)
                .then(() => {
                    setTimeout(() => {
                        msg.reply("시간, 다 된거예요! 🔔")
                    }, result)
                })
            }
            catch (err) {
                msg.reply("올바른 시간을 입력해주셔야 하는거예요.")
            }
        }
        
		//안부인사 
		else if (content === "잘 자" || content === "잘자") {
            msg.reply("안녕히 주무시는거예요 \nhttps://www.youtube.com/watch?v=9VPLBCmhCiE")
        }

        // 소수 찾기 
        else if (content.startsWith("소수")) {
            const input = content.split(" ")[1];
            let num = input ? input.replace("번째", "") : null;
            if (num && +num) {
                num -= 1;
                fs.readFile("./prime.txt", (err, data) => {
                    if (err) throw err;
                    data = data.toString().split(" ")[num];
                    if (data) {
                        msg.reply(data)
                    }
                    else {
                        msg.reply("적당한 숫자를 입력해주셔야 하는거예요. 😥");
                    }
                });
            }
            else {
                msg.reply("``미호야 소수 [숫자](번째)``가 올바른 사용법인거예요.");
            }
        }

        // 미니게임
        
		//주사위
		else if (content === "주사위" ||content === "주사위던지기") {
            const result = Math.floor(Math.random() * 5 + 1);
            msg.reply(`${result === 1 ? "주사위에서 ⚀ (1)이 나온거예요" : result === 2 ? "주사위에서 ⚁ (2)가 나온거예요" : result === 3 ? "주사위에서 ⚂ (3)이 나온거예요" : result === 4 ? "주사위에서 ⚃ (4)가 나온거예요" : result === 5 ? "주사위에서 ⚄ (5)가 나온거예요" : "주사위에서 ⚅ (6)이 나온거예요"}`);
        }
        
		//동전
		else if (content === "동전" || content === "동전던지기" || content === "코인토스") {
            const result = Math.round(Math.random());
            msg.reply(`${result ? "동전 ``앞``면이 나온거예요" : "동전 ``뒷``면이 나온거예요"}`);
        }
        
		//가위바위보
		else if (content === "가위바위보" || content === "쟝켄보")  {
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
            .catch(() => msg.reply("다음에 다시 결판 짓는 거예요!"));

            msg.awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] })
	        .then(collected => {
                const reaction = collected.first();
                msg.reply(`${
                    reaction.emoji.name === "✊"
                    ?
                        choose === 0
                        ? "✊ 비겼네요 😏"
                        : choose === 1
                            ? "✌️ 제가 진거예요 😥"
                            : "✋ 제가 이긴거예요 😁"
                    : reaction.emoji.name === "✌️"
                        ?
                            choose === 0
                            ? "✊ 제가 이긴거예요 😁"
                            : choose === 1
                                ? "✌️ 비겼네요 😏"
                                : "✋ 제가 진거예요 😥"
                        :
                            choose === 0
                            ? "✊ 제가 진거예요 😥"
                            : choose === 1
                                ? "✌️ 제가 이긴거예요 😁"
                                : "✋ 비겼네요 😏"
                }`);
                
	        });
        }
        
		//제비뽑기
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

        // 역할 부여
        else if (content.startsWith("역할")) {
            if (!user) return msg.reply("누굴요?");

            if (member) {
                const split = content.split(" ");
                const action = split[1];
                if (!action || !split[2] || !split[3]) return msg.reply("역할 [행동(추가 / 삭제)] [@유저] [역할 이름]으로 사용하실 수 있어요.");
                const role = msg.guild.roles.cache.find(role => role.name === split.slice(3).join(" "));
                if (!role) return msg.reply("그런 역할은 없는거예요. 😥");

                if (action === "추가") {
                    if (member.roles.cache.has(role.id)) {
                        msg.reply("이미 역할이 부여되어있네요.")
                    }
                    else {
                        member.roles.add(role.id)
                        .then(() => {
                            msg.channel.send(`축하합니다! ${split[2]} 님! \`\`${role.name}\`\` 역할을 부여받았어요!`)
                        })
                        .catch(err => {
                            console.log(err);
                            msg.reply("역할 부여에 실패한 거예요. 😥");
                        })
                    }
                }
                if (action === "삭제") {
                    if (member.roles.cache.has(role.id)) {
                        member.roles.remove(role.id)
                        .then(() => {
                            msg.channel.send(`${split[2]} 님에게서 \`\`${role.name}\`\` 역할을 삭제한 거예요.`)
                        })
                        .catch(err => {
                            console.log(err);
                            msg.reply("역할 삭제에 실패한 거예요. 😥");
                        })
                    }
                    else {
                        msg.reply("그런 역할은 부여되어 있지 않네요.")
                    }
                }
                if (action === "확인") {

                }
            }
            else {
                msg.reply("그런 사람은 없어요. 😥")
            }
        }
        
		// 밴 기능 
		else if (content.startsWith("밴") || content.startsWith("내쫓아") || content.startsWith("뜯어물어")) {
            if (user) {
                const reason = content.match(/ /g)[1];
                if (member) {
                    if (content.startsWith("밴")) {
                        msg.reply("정말 진행하시는거예요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행하는 거예요?!")
                        .then(() => {
                            const filter = m => msg.author.id === m.author.id;

                            msg.channel.awaitMessages(filter, { time: 10000, max: 1, errors: ['time'] })
                            .then(reply => {
                                const result = reply.first().content;
                                if (result === "응" || result === "ㅇㅇ") {
                                    member
                                    .ban({
                                        reason: `${reason ? message.slice(message.lastIndexOf(" ")+1) : "나빴어"}`
                                    })
                                    .then(() => {
                                        msg.reply(`${user.tag}을(를) 밴한 거예요.`)
                                    })
                                    .catch(() => {
                                        msg.reply("이 사람은 밴할 수 없는 거예요.")
                                    })
                                }
                                else {
                                    msg.reply("작업을 취소할께요.")
                                }
                            })
                            .catch(() => {
                                msg.reply("대답하지 않으셨으니 없던 일로 하는거예요.")
                            })
                        })
                    }
                    else {
                        msg.reply("정말 진행하시는거예요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행하는 거예요?!")
                        .then(() => {
                            const filter = m => msg.author.id === m.author.id;

                            msg.channel.awaitMessages(filter, { time: 10000, max: 1, errors: ['time'] })
                            .then(reply => {
                                const result = reply.first().content;
                                if (result === "응" || result === "ㅇㅇ") {
                                    member
                                    .kick({
                                        reason: `${reason ? message.slice(message.lastIndexOf(" ")+1) : "나빴어"}`
                                    })
                                    .then(() => {
                                        msg.reply(`${user.tag}을(를) 내쫓은거예요.`)
                                    })
                                    .catch(() => {
                                        msg.reply("이 사람은 내쫓을 수 없는거예요.")
                                    })
                                }
                                else {
                                    msg.reply("작업을 취소하는거예요.")
                                }
                            })
                            .catch(() => {
                                msg.reply("대답하지 않으셨으니 없던 일로 하는 거예요.")
                            })
                        })
                    }
                }
                else {
                    msg.reply("찾을 수 없는거예요 . 😥")
                }
            }
            else {
                msg.reply("누굴요?")
            }
        }
        
		
		//대화
		
		else if (content === "이스터에그"){
			msg.reply("있는지 없는지는 찾아보면 아는거예요!");
        }
			
		//명령여 Not Found
		else {
            msg.react("❌")
            .then(() => {
                msg.reply("찾을 수 없는 명령어네요. 😥\n``미호야 도와줘`` 명령어를 이용해 명령어 목록을 확인할 수 있는거예요.");
            })
        }
    }
});

client.login(token.token);
