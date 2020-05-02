const Discord = require('discord.js');
const fetch = require("node-fetch");
const crypto = require("crypto");
const fs = require("fs");
const math = require("mathjs");
const token = require("./token.json");
const files = require("./files.json");
const client = new Discord.Client();
const encryptKey = 'aDogWlsHxuRWLMwz5zkVguZboXn9CXYJ';
const blacklist = [];
const badwords = /words|to|block/gi;

let latestInsta = null;

const pickRandom = array => {
    return array[Math.round(Math.random() * (array.length - 1))];
};
const pickImg = array => {
    return pickRandom(array).replace("[gfy]", "https://giant.gfycat.com/").replace("[zgfy]", "https://zippy.gfycat.com/").replace("[ten]", "https://tenor.com/view/").replace("[fgfy]", "https://fat.gfycat.com/").replace("[tgfy]", "https://thumbs.gfycat.com/");
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

    if (content.startsWith("미호야") || content.startsWith("호야")) {
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

        // If user typed nothing
        if (content === "") {
            const ranCat = files[pickRandom(gifCategory)];
            msg.channel.send(pickImg(ranCat));
        }

        // 도움!
        else if (content === "도와줘") {
            msg.channel.send("[미호야 or 호야] [명령어] 구조로 이루어져 있는거예요.\n말해 [문자] : 봇이 한 말을 따라 하는거예요. 마지막에 -지워를 붙이면 해당 메시지를 지우고 따라 하는거예요\n정렬해줘 [배열] : Quick Sort로 배열을 정렬해주는거예요.\n[내쫓아 or 밴] [@유저] [문자(밴 사유, 선택)] : 순서대로 kick, ban인 거예요.\n역할 [행동(추가 / 삭제)] [@유저] [역할 이름] : 유저의 역할을 관리하는거예요\n인스타 [n번째(생략 가능)] : 인스타그램을 게시글을 표시해주는거예요. 마지막에 (숫자)번째를 추가하면 해당 게시물을 보여주는거예요.\n유튜브 : 유튜브를 켜주는거예요.\n타이머 [시간(n시간 n분 n초)] : 설정한 시간 뒤에 알림을 보내주는거예요.\n암호 [행동(생성 / 해독)] [문자열] : 문자열을 암호화, 복화화해주는거예요.\n날씨 : 기상청에서 받은 중기예보를 알려주는거예요.\n랜덤 [최소 숫자] [최대 숫자] : 최소 숫자와 최대 숫자 사이의 수 중 하나를 무작위로 뽑아주는거예요.\n계산 [수식] : 해당 수식을 계산해주는거예요.\n(단위변환 or 단위 변환) [변환할 항목] [단위] : 단위를 변환해주는거예요. 변환할 항목엔 숫자와 단위, 단위엔 단위만 입력하시면 되는거예요.\n소수 [숫자](번째) : [숫자]번째 소수를 알려줄꺼예요.\n게임 : 주사위, 동전, 가위바위보\n제비뽑기 [@유저] : 유저 중 한 명만 당첨되는 거예요. 반드시 2인 이상 언급해야 하는거예요."
		)}

        // 인사 
        else if (content === "안녕") {
            msg.react("안녕하신거예요")
            .then(() => {
                msg.channel.send(pickImg(files.hi));
            })
        }
        else if (content === "잘 가" || content === "잘가") {
            msg.react("잘 가는거예요")
            .then(() => {
                msg.channel.send(pickImg(files.bye));
            })
        }

        // Info
        else if (content.startsWith("자기소개")) {
            msg.reply("이름은 미호 /n 이상한 생각은 안되는거예요!");
        }
        
        else if (content === "유튜브") {
            msg.channel.send("https://www.youtube.com/");
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
        else if (content === "집합시켜") {
            msg.channel.send(`@everyone ${author}님이 집합하시랍니다!`)
        }
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
        else if (content === "잘 자" || content === "잘자") {
            msg.reply("안녕히 주무시는거예요 \n https://youtube.com/")
        }

        // math
        else if (content.startsWith("랜덤")) {
            const split = content.split(" ");
            const min = +split[1];
            const max = +split[2];
            if (split.length === 3 && min !== NaN && max !== NaN && max > min) {
                msg.reply(Math.round(Math.random() * (max - min)) + min)
            }
            else {
                msg.reply("``미호야 랜덤 [최소 숫자] [최대 숫자]``가 올바른 사용법인거예요.")
            }
        }
        else if (content.startsWith("계산")) {
            content = content.slice(3)
            if (content) {
                try {
                    const result = math.evaluate(content);
                    const resStr = math.format(result, {precision: 14});
                    const type = typeof(result);
                    if (type === "function") {
                        throw "error";
                    }
                    msg.reply(resStr);
                }
                catch (err) {
                    msg.reply("올바른 수식을 입력해주시는거예요.");
                }
            }
            else {
                msg.reply("``미호야 계산 [수식]``이 올바른 사용법인거예요.");
            }
        }
        
		else if (content.startsWith("단위변환") || content.startsWith("단위 변환")) {
            const split = content.replace("단위 변환", "단위변환").split(" ");
            if (split.length === 3) {
                try {
                    msg.reply(math.format(math.evaluate(`${split[1]} to ${split[2]}`)), {precision: 14});
                }
                catch (err) {
                    msg.reply("올바른 단위를 입력해주시는거예요.");
                }
            }
            else {
                msg.reply("``미호야 (단위변환 or 단위 변환) [변환할 항목] [단위]``가 올바른 사용법이 되는거예요.");
            }
        }
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

        // 날씨
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

        // 미니게임
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
		else if (content.startsWith("밴") || content.startsWith("내쫓아")) {
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
                                    msg.reply("작업을 취소합니다.")
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
        else {
            msg.react("❌")
            .then(() => {
                msg.reply("찾을 수 없는 명령어네요. 😥\n``미호아 도와줘`` 명령어를 이용해 명령어 목록을 확인할 수 있는거예요.");
            })
        }
    }
});

client.login(token.token);
