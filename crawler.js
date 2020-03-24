const request = require('request');
const ppy = require('puppeteer');

let tb_cookie = 'thw=cn; x=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0%26__ll%3D-1%26_ato%3D0; t=2ad2754532b9e62a8fab8f013afde98f; cookie2=17c8f0a8b76011310e75cce28475f247; _tb_token_=e65ee63191a04; _samesite_flag_=true; tfstk=c9iCBR9pl6fIKv2C849a841SvkqPavI_eewxdVIe1LwWcID36sjd0SwKY4flXre1.; sgcookie=EGSuWU3ERewFYuMiqd8eu; unb=2206399564217; sn=cenovis%E6%B5%B7%E5%A4%96%E6%97%97%E8%88%B0%E5%BA%97%3A%E5%93%81%E7%89%8C%E5%B8%82%E5%9C%BA; uc1=cookie21=UtASsssmfufd&cookie14=UoTUP2KjCZUCbw%3D%3D; csg=a195e904; skt=9023aa72f2f73c8c; _cc_=W5iHLLyFfA%3D%3D; cna=Q+TLFRbX1hQCAXLbFnSQKpkk; _euacm_ac_l_uid_=2206399564217; 2206399564217_euacm_ac_c_uid_=4118562075; 2206399564217_euacm_ac_rs_uid_=4118562075; _euacm_ac_rs_sid_=508773719; v=0; _portal_version_=new; cc_gray=1; XSRF-TOKEN=505cbcc2-17b6-4bae-8752-a0800e8e3f5d; datawar_version=new; enc=eUVFX7suXmVAwbnp5MkDZU1xndaZxgKCqdKq2mgHOhZbFnuM6YMNhTJfZyHnFH6qTUlcTtU7ZUb%2B1JxZKbBcq3e28eiBbxzQvh1n1GfJkfM%3D; l=dBMuaT2qquTSSpCQKOfNVDKul5Q9gKAjcsPr9akBJICPO8BJ4Jv5BZ4stCtvCnGVnsQ6R3oGfmNDB4YL7PUshigGXYpHvwbrndLh.; isg=BPT0Od_WFl58pYE35-JHq26NxbJmzRi3DHOiy45dkX4V-YxDtt0gRTb7fTEhAVAP';
let cookie_list = tb_cookie.split('; ').map((_cookie) => {
    return {
        name: _cookie.split('=')[0],
        value: _cookie.split('=')[1],
        domain: '.sycm.taobao.com'
    };
});

module.exports = {
    get_page: () => {
        return new Promise((resolve, reject) => {
            request({
                url: 'https://sycm.taobao.com/portal/home.htm',
                method: 'GET',
                headers: {
                    'cookie': tb_cookie,
                    'referrer': 'https://sycm.taobao.com/fa/analyze/overview?spm=a21ag.8718589.TopMenu.d724.33db50a5H32shX',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
                }
            }, (err, resp, body) => {
                if (err || resp.statusCode != 200) reject('fail');
                resolve(body);
            })
        })
    },

    get_page_ppy: async () => {
        const browser = await ppy.launch({
            headless: false,
        });
        const page = await browser.newPage();
        await page.goto('https://sycm.taobao.com/portal/home.htm');
        await page.waitForSelector('.ant-modal-close');
        await page.click('.ant-modal-close');
        await page.waitForSelector('.recharts-surface');
        let html = await page.content();
        browser.close();
        return html;
    }
}