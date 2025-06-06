const https = require('https');
require('dotenv').config();
const token = process.env.TOKEN;
const channelToRead = process.env.CHANNEL;
const hook = process.env.HOOK;
const mnum = 2;
const options = {
    headers: {
        Authorization: `${token}`
    }
};

// Create a helper function for delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    let prevmsgs = [];
    while (true) {
        await sleep(3000); // Pause for 5 seconds
        https.get(`https://discord.com/api/v9/channels/${channelToRead}/messages?limit=${mnum}`, options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const msgs = JSON.parse(body);
		let count = 0;
                    for (let i = 0; i < mnum; i++) {
			   if (prevmsgs.length != 0){
			   }
			if (prevmsgs.length != 0 && msgs[i].id != prevmsgs[count].id) {
				const embeds = JSON.stringify(msgs[i].embeds);
                            const payload = JSON.stringify({ content: `${msgs[i].author.username}: ${msgs[i].content}`,
			    					embeds: msgs[i].embeds,
			    					attachments: msgs[i].attachments
				});
                            const postOptions = {
                                hostname: 'discord.com',
                                path: hook,
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };
                            const postReq = https.request(postOptions, (postRes) => {
                                console.log(`Status: ${postRes.statusMessage}`);
				console.log(`PAYLOAD: ${payload}`);
                            });
                            postReq.write(payload);
                            postReq.end();
			    
                        }else{
			count++
			}
                    }
                    prevmsgs = msgs;
                } catch (error) {
                    console.error(`Error parsing response: ${error.message}`);
                }
            });
        });
    }
})();
