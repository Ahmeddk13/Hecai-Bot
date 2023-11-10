const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

module.exports.acceptFriend = async function(api) {
  try {
    const cookies = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));
    const friends_req_url = "https://mbasic.facebook.com/friends/center/requests/?eav=AfZpn_HiAFMvxbJeAuRa5B5w5UfWFgOkZy4yMoW6GYmRhD7WI5u1yrOz9cLfP5tdl44&paipv=0&refid=5#friends_center_main";
    const cookieString = cookies.map(cookie => `${cookie.key}=${cookie.value}`).join('; ');
    
    const response = await axios.get(friends_req_url, {
      headers: {
        'Cookie': cookieString,
      },
    });

    const $ = cheerio.load(response.data);
    //fs.writeFileSync('frindr.html',response.data);
    const confirmUrls = [];

    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href.includes('/a/notifications.php?confirm=')) {
        confirmUrls.push(href);
      }
    });
    //console.log(confirmUrls);

    // Send GET requests to all confirmation URLs
    confirmUrls.forEach(async url => {
      try {
        const confirmResponse = await axios.get("https://mbasic.facebook.com" + url, {
          headers: {
            'Cookie': cookieString,
          },
        });
        //console.log(`GET request to ${url} successful`);
        // Handle the response as needed
        const match = url.match(/confirm=(\d+)/);
          if (match) {
              const id_user = match[1];
              await api.sendMessage("   \n👑Auto-accept👑\n you have been accepted ✅😁\n now you can use the bot just send /menu 💕❄️",id_user);
          } else {
              console.log('id User not found in the URL');
             }
          
      } catch (error) {
        console.error(`Error making GET request to ${url}:`, error.message);
        // Handle errors
      }
    });
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};