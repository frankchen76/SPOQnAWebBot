const user = {
    "User": {
        "Id": "dl_A8A8A3C7-798B-4ECF-AEF7-A0ACF9CE6487",
        "name": "frank@m365x725618.onmicrosoft.com"
    }
};
const botSecret = "[bot-secret]";

fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + botSecret
    },
    body: JSON.stringify(user),
})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.WebChat.renderWebChat(
            {
                directLine: window.WebChat.createDirectLine({
                    token: data.token
                }),
                userID: 'dl_A8A8A3C7-798B-4ECF-AEF7-A0ACF9CE6487',
                username: 'frank@m365x725618.onmicrosoft.com',
                locale: 'en-US'
            },
            document.getElementById('webchat')
        );
        alert("Done");
    })
    .catch((error) => {
        console.error('Error:', error);
    });
