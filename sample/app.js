const {Client, MessageAttachment} = require('discord.js');
const axios = require("axios");
const fetch = require("node-fetch");
const crypto = require("crypto");
const ytdl = require("ytdl-core");
const fs = require("fs");
const math = require("mathjs");
const keys = require("./keys.json");
const files = require("./files.json");
const client = new Client();
const encryptKey = 'aDogWlsHxuRWLMwz5zkVguZboXn9CXYJ';
const gifCategory = ["hi", "bye", "ok", "no", "good", "surprised", "angry", "laugh", "cry", "fighting", "love"];
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
const fetchInsta = action => {
    axios
    .get("https://www.instagram.com/dlwlrma/")
    .then(response => {
        const a = response.data;
        const media = JSON.parse(a.slice(a.indexOf("edge_owner_to_timeline_media") + 30, a.indexOf("edge_saved_media") - 2));
        const latest = media.edges[0].node;

        if (action === "init") {
            latestInsta = latest.id
        }
        else if (action === "check") {
            if (latestInsta && latestInsta !== latest.id) {
                latestInsta = latest.id,
                fs.readFile("./channel.txt", "utf8", function(err, data) {
                    if (err) return console.log(err);
                    const channels = data.split("!!");
                    const comment = latest.edge_media_to_caption.edges[0].node.text;

                    if (latest.is_video) {
                        fetch(`https://www.instagram.com/p/${latest.shortcode}/`)
                        .then(response => {
                            if (response.status === 200) {
                                return response.text()
                            }
                            else {
                                return false
                            }
                        })
                        .then(a => {
                            const attachment = new MessageAttachment(a.slice(a.indexOf("video_url") + 12, a.indexOf("video_view_count") - 3).replace(/\\u0026/gm, "&"));

                            channels.forEach(channel => {
                                const id = channel.replace(/<|#|>/g, "");
                                client.channels.cache.get(id).send(attachment)
                                .then(() => {
                                    client.channels.cache.get(id).send(`>>> ${comment}\nhttps://www.instagram.com/p/${latest.shortcode}`)
                                })
                            })
                        })
                    }
                    else {
                        const attachment = new MessageAttachment(latest.display_url);

                        channels.forEach(channel => {
                            const id = channel.replace(/<|#|>/g, "");
                            client.channels.cache.get(id).send(attachment)
                            .then(() => {
                                client.channels.cache.get(id).send(`>>> ${comment}\nhttps://www.instagram.com/p/${latest.shortcode}`)
                            })
                        })
                    }
                })
            }
        }
    })
    .catch(err => {
        console.log(err);
    })
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
            name: "지은아 도와줘 - 명령어 확인"
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

    if (content.startsWith("지은아") || content.startsWith("지금아")) {
        const author = msg.author;
        const authorid = author.id;
        if(blacklist.includes(authorid)) return;
        const user = msg.mentions.users.first();
        const member = user && msg.guild.member(user);
        content = content.slice(4);

        // bad word blocker
        if (badwords.test(content)) {
            return msg.reply("바르고 고운 말 사용하기!");
        }

        // If user typed nothing
        if (content === "") {
            const ranCat = files[pickRandom(gifCategory)];
            msg.channel.send(pickImg(ranCat));
        }

        // Help
        else if (content === "도와줘") {
            msg.channel.send("[지은아 or 지금아] [명령어] 구조로 이루어져 있습니다.\n말해 [문자] : 봇이 한 말을 따라 합니다. 마지막에 -지워를 붙이면 해당 메시지를 지우고 따라 합니다.\n알림 추가 [채널] : 인스타그램 알림 채널을 설정합니다.\n정렬해줘 [배열] : Quick Sort로 배열을 정렬합니다.\n[내쫓아 or 밴] [@유저] [문자(밴 사유, 선택)] : 순서대로 kick, ban입니다.\n역할 [행동(추가 / 삭제)] [@유저] [역할 이름] : 유저의 역할을 관리합니다\n인스타 [n번째(생략 가능)] : 인스타그램을 게시글을 표시해줍니다. 마지막에 (숫자)번째를 추가하면 해당 게시물을 보여줍니다.\n유튜브 : 유튜브 링크를 표시합니다.\n뮤비 or 뮤직비디오 : 뮤직비디오 링크를 무작위로 표시합니다.\n타이머 [시간(n시간 n분 n초)] : 설정한 시간 뒤에 알림을 보내줍니다.\n암호 [행동(생성 / 해독)] [문자열] : 문자열을 암호화, 복화화합니다.\n날씨 : 기상청에서 받은 중기예보를 알려줍니다.\n랜덤 [최소 숫자] [최대 숫자] : 최소 숫자와 최대 숫자 사이의 수 중 하나를 무작위로 뽑습니다.\n계산 [수식] : 해당 수식을 계산해줍니다.\n(단위변환 or 단위 변환) [변환할 항목] [단위] : 단위를 변환해줍니다. 변환할 항목엔 숫자와 단위, 단위엔 단위만 입력하시면 됩니다.\n소수 [숫자](번째) : [숫자]번째 소수를 알려줍니다.\n게임 : 주사위, 동전, 가위바위보\n제비뽑기 [@유저] : 유저 중 한 명만 당첨됩니다. 반드시 2인 이상 언급해야 합니다.\n\n 움짤 목록 : 안녕, 잘 가, ㅇㅋ, ㄴㄴ, ㅠㅠ, ㅋㅋ, 굿, 헉, 열받네, 사랑해, 화이팅")
        }

        // Greeting, Farewell
        else if (content === "안녕") {
            msg.react("💜")
            .then(() => {
                msg.channel.send(pickImg(files.hi));
            })
        }
        else if (content === "잘 가" || content === "잘가") {
            msg.react("💜")
            .then(() => {
                msg.channel.send(pickImg(files.bye));
            })
        }

        // Sending GIFs(Videos)
        else if (content === "ㅇㅋ") {
            msg.channel.send(pickImg(files.ok));
        }
        else if (content === "ㄴㄴ") {
            msg.channel.send(pickImg(files.no));
        }
        else if (content === "ㅠㅠ") {
            msg.channel.send(pickImg(files.cry));
        }
        else if (content === "ㅋㅋ") {
            msg.channel.send(pickImg(files.laugh));
        }
        else if (content === "굿") {
            msg.channel.send(pickImg(files.good));
        }
        else if (content === "헉") {
            msg.channel.send(pickImg(files.surprised));
        }
        else if (content === "열 받네" || content === "열받네") {
            msg.channel.send(pickImg(files.angry));
        }
        else if (content === "화이팅") {
            msg.channel.send(pickImg(files.fighting));
        }
        else if (content === "사랑해") {
            msg.channel.send(pickImg(files.love));
        }

        // notification
        else if (content.startsWith("알림")) {
            const splitted = content.split(" ");
            let action = splitted[1];

            if (action === "추가") {
                if (splitted[2]) {
                    let channel = splitted[2].match(/<#(.[0-9]+)>/g);
                    if (!channel) {return msg.reply("올바른 채널을 입력해주세요.");}
                    const path = "./channel.txt";
                    channel = channel[0].replace(/<|#|>/g, "");
    
                    try {
                        if (fs.existsSync(path)) {
                            fs.appendFile(path, `!!${channel}`, function (err) {
                                if (err) {
                                    console.log(err),
                                    msg.reply("채널 추가에 실패했어요. 😢");
                                    return;
                                };
                                console.log(`new channel saved${channel}`),
                                client.channels.cache.get(channel).send(`성공적으로 알림 채널로 등록했어요.\n채널 ID : ${channel}`)
                                .then(() => {
                                    msg.reply("완료!")
                                })
                            });
                        }
                        else {
                            fs.writeFile(path, channel, function (err) {
                                if (err) {
                                    console.log(err),
                                    msg.reply("채널 추가에 실패했어요. 😢");
                                    return;
                                };
                                console.log(`new channel saved${channel}`),
                                client.channels.cache.get(channel).send(`성공적으로 알림 채널로 등록했어요.\n채널 ID : ${channel}`)
                                .then(() => {
                                    msg.reply("완료!")
                                })
                            });
                        }
                    }
                    catch (err) {
                        console.log(err);
                        msg.reply("채널 추가에 실패했어요. 😢")
                    }
                }
                else {
                    msg.reply("올바른 채널을 입력해주세요.")
                }
            }
        }

        // Info
        else if (content.startsWith("이름")) {
            msg.reply("예명 : IU(아이유)\n본명 : 이지은 (李知恩, Lee Ji-Eun)");
        }
        else if (content.startsWith("인스타")) {
            axios
            .get("https://www.instagram.com/dlwlrma/")
            .then(response => {
                const a = response.data;
                const media = JSON.parse(a.slice(a.indexOf("edge_owner_to_timeline_media") + 30, a.indexOf("edge_saved_media") - 2));
                let target = content.split(" ")[1];

                target && (target = target.replace("번째", "").replace("번쨰", "")),
                +target ? (target =  --target) : (target = 0);

                const targetPost = media.edges[`${target ? target > 11 ? 11 : target : 0}`].node;
                const targetPostComment = targetPost.edge_media_to_caption.edges[0].node.text;

                if (targetPost.is_video) {
                    axios
                    .get(`https://www.instagram.com/p/${targetPost.shortcode}/`)
                    .then(response => {
                        const a = response.data;
                        const attachment = new MessageAttachment(a.slice(a.indexOf("video_url") + 12, a.indexOf("video_view_count") - 3).replace(/\\u0026/gm, "&"));

                        msg.channel.send(attachment)
                        .then(() => {
                            msg.channel.send(`>>> ${targetPostComment}\n더 자세한 내용은 https://www.instagram.com/dlwlrma/ 로!`);
                        })
                    })
                }
                else {
                    const attachment = new MessageAttachment(targetPost.display_url);
                    msg.channel.send(attachment)
                    .then(() => {
                        msg.channel.send(`>>> ${targetPostComment}\n더 자세한 내용은 https://www.instagram.com/dlwlrma/ 로!`);
                    })
                }
            });            
        }
        else if (content === "유튜브") {
            msg.channel.send("https://www.youtube.com/channel/UC3SyT4_WLHzN7JmHQwKQZww");
        }
        else if (content === "뮤비" || content === "뮤직비디오") {
            msg.channel.send(`https://youtu.be/${pickRandom(files.mv)}`)
        }

        // Music
        else if (content.startsWith("재생해줘")) {
            const uri = content.split(" ")[1];
            if (!uri) return msg.reply("재생할 주소를 입력해주세요.");
    
            const voiceChannel = msg.member.voice.channel;
    
            if (!voiceChannel) {
                return msg.reply("음성 채팅방에 들어가셔야 재생할 수 있어요.");
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
                            msg.channel.send("메시지 삭제 권한을 부여받지 못했습니다. 서버 관리자에게 문의해주세요.\nhttps://discordapp.com/api/oauth2/authorize?client_id=684667274287906835&permissions=8&scope=bot\n링크를 통해 봇을 추가하시면 문제가 해결됩니다.");
                        }
                    })
                }
                else {
                    msg.channel.send(content.replace("말해 ", ""));
                }
            }
            else {
                msg.reply("``지은아 말해 [말할 내용]``이 올바른 사용법이에요.")
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
                    msg.reply(`[${sorted}]\n정렬하는데 \`\`${new Date().getTime() - start}ms\`\`가 소요되었어요.`);
                }
                else {
                    msg.reply("정렬할 수 없는 배열이에요. 😥")
                }
            }
            else {
                msg.reply("``지은아 정렬해줘 [배열]``로 정렬할 수 있어요.")
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
                    msg.reply("복호화에 실패했어요. 😥")
                }
            }
            else {
                msg.reply("암호 [행동(생성, 해독)] [문자열]로 암호를 생성하고 해독할 수 있어요.")
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
                msg.reply(`${result/1000}초 뒤에 알려드릴게요! ⏲️`)
                .then(() => {
                    setTimeout(() => {
                        msg.reply("설정한 시간이 끝났어요! 🔔")
                    }, result)
                })
            }
            catch (err) {
                msg.reply("올바른 시간을 입력해주세요.")
            }
        }
        else if (content === "잘 자" || content === "잘자") {
            msg.reply("Baby, sweet good night\nhttps://youtu.be/aepREwo5Lio")
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
                msg.reply("``지은아 랜덤 [최소 숫자] [최대 숫자]``가 올바른 사용법이에요.")
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
                    msg.reply("올바른 수식을 입력해주세요.");
                }
            }
            else {
                msg.reply("``지은아 계산 [수식]``이 올바른 사용법이에요.");
            }
        }
        else if (content.startsWith("단위변환") || content.startsWith("단위 변환")) {
            const split = content.replace("단위 변환", "단위변환").split(" ");
            if (split.length === 3) {
                try {
                    msg.reply(math.format(math.evaluate(`${split[1]} to ${split[2]}`)), {precision: 14});
                }
                catch (err) {
                    msg.reply("올바른 단위를 입력해주세요.");
                }
            }
            else {
                msg.reply("``지은아 (단위변환 or 단위 변환) [변환할 항목] [단위]``가 올바른 사용법이에요.");
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
                        msg.reply("적당한 숫자를 입력해주세요. 😥");
                    }
                });
            }
            else {
                msg.reply("``지은아 소수 [숫자](번째)``가 올바른 사용법이에요.");
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
            .catch(() => msg.reply("다음에 할래요."));

            msg.awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] })
	        .then(collected => {
                const reaction = collected.first();
                msg.reply(`${
                    reaction.emoji.name === "✊"
                    ?
                        choose === 0
                        ? "✊ 비겼네요 😏"
                        : choose === 1
                            ? "✌️ 제가 졌어요 😥"
                            : "✋ 제가 이겼네요 😁"
                    : reaction.emoji.name === "✌️"
                        ?
                            choose === 0
                            ? "✊ 제가 이겼네요 😁"
                            : choose === 1
                                ? "✌️ 비겼네요 😏"
                                : "✋ 제가 졌어요 😥"
                        :
                            choose === 0
                            ? "✊ 제가 졌어요 😥"
                            : choose === 1
                                ? "✌️ 제가 이겼네요 😁"
                                : "✋ 비겼네요 😏"
                }`);
                
	        });
        }
        else if (content.startsWith("제비뽑기")) {
            const users = msg.mentions.users;
            const size = users.size;
            
            if (size < 2) {
                msg.reply("2인 이상 언급해주세요!")
            }
            else {
                const random = [...users][
                    Math.round(Math.random() * (size - 1))
                ];

                msg.channel.send(`당첨! 🎉<@${random[0]}>🎉`)
            }
        }

        // Moderation
        else if (content.startsWith("역할")) {
            if (!user) return msg.reply("누굴요?");

            if (member) {
                const split = content.split(" ");
                const action = split[1];
                if (!action || !split[2] || !split[3]) return msg.reply("역할 [행동(추가 / 삭제)] [@유저] [역할 이름]으로 사용하실 수 있어요.");
                const role = msg.guild.roles.cache.find(role => role.name === split.slice(3).join(" "));
                if (!role) return msg.reply("그런 역할은 없어요. 😥");

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
                            msg.reply("역할 부여에 실패했어요. 😥");
                        })
                    }
                }
                if (action === "삭제") {
                    if (member.roles.cache.has(role.id)) {
                        member.roles.remove(role.id)
                        .then(() => {
                            msg.channel.send(`${split[2]} 님에게서 \`\`${role.name}\`\` 역할을 삭제했습니다.`)
                        })
                        .catch(err => {
                            console.log(err);
                            msg.reply("역할 삭제에 실패했어요. 😥");
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
        else if (content.startsWith("밴") || content.startsWith("내쫓아")) {
            if (user) {
                const reason = content.match(/ /g)[1];
                if (member) {
                    if (content.startsWith("밴")) {
                        msg.reply("정말 진행하시겠어요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행합니다.")
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
                                        msg.reply(`${user.tag}을(를) 밴했어요.`)
                                    })
                                    .catch(() => {
                                        msg.reply("이 사람은 밴할 수 없네요.")
                                    })
                                }
                                else {
                                    msg.reply("작업을 취소합니다.")
                                }
                            })
                            .catch(() => {
                                msg.reply("대답하지 않으셨으니 없던 일로 할게요.")
                            })
                        })
                    }
                    else {
                        msg.reply("정말 진행하시겠어요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행합니다.")
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
                                        msg.reply(`${user.tag}을(를) 내쫓았어요.`)
                                    })
                                    .catch(() => {
                                        msg.reply("이 사람은 내쫓을 수 없네요.")
                                    })
                                }
                                else {
                                    msg.reply("작업을 취소합니다.")
                                }
                            })
                            .catch(() => {
                                msg.reply("대답하지 않으셨으니 없던 일로 할게요.")
                            })
                        })
                    }
                }
                else {
                    msg.reply("cannot found . 😥")
                }
            }
            else {
                msg.reply("누굴요?")
            }
        }
        else {
            msg.react("❌")
            .then(() => {
                msg.reply("찾을 수 없는 명령어네요. 😥\n``지은아 도와줘`` 명령어를 이용해 명령어 목록을 확인할 수 있어요.");
            })
        }
    }
});

client.login(keys.token);
