const fs = require("fs");
const sleep =  require("time-sleep");
const login = require("@xaviabot/fca-unofficial");
const server = require("./Utils/server.js");
const { listen } = require("./script/listen");
const { spawn } = require("child_process");

server.server();

const start = () => {
  function startBot(message) {

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Hercai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
  
  child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Starting up...");
            global.countRestart += 1;
            return;
        } else return;
    });

  child.on("error", function(error) {

  });
};
  startBot("hi");
    setInterval(() => {
        const t = process.uptime();
        const[i, a, m] = [Math.floor(t / 3600), Math.floor((t % 3600) / 60), Math.floor(t % 60)].map((num) => (num < 10 ? "0" + num : num));
        const formatMemoryUsage = (data) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
        const memoryData = process.memoryUsage();
        process.title = `HRRCAI BOT UPTIME SERVER - ${i}: ${a}: ${m} - External: ${formatMemoryUsage(memoryData.external)}`;
    }, 1000);

    (async() => {

        login({
            appState: JSON.parse(fs.readFileSync('./setUpHercai/HercaiState.json', 'utf8'))
        }, (err, api) => {
            if (err) {
                console.error(err);
            }

            api.setOptions({
                forceLogin: true,
                listenEvents: true,
                listenTyping: false,
                updatePresence: true,
                selfListen: true
            });

           // await api.markAsRead(event.threadID);

            const listenMqtt = async() => {
                try {
                    if (!listenMqtt.isListening) {
                        listenMqtt.isListening = true;
                        const mqtt = await api.listenMqtt(async(err, event) => {
                            if (err) {
                                console.log("error", err);
                            }
                            await listen({
                                api, event
                            });
                        });
                        await sleep(1200000);
                        console.log("[ MQTT ]", "Mqtt refresh in progress!");
                        await mqtt.stopListening();
                        await sleep(5000);
                        console.log("[ MQTT ]", "Refresh successful!");

                        listenMqtt.isListening = false;
                    }
                    listenMqtt();
                } catch (error) {
                    console.log('system:error', err);
                }
            };

            listenMqtt.isListening = false;
            listenMqtt();
        });
    })();
};

start();