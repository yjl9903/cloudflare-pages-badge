# Cloudflare Pages Badge

[![CI](https://github.com/yjl9903/CloudflarePagesBadge/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/CloudflarePagesBadge/actions/workflows/ci.yml)

## Demo

Personal demo use `https://img.shields.io/endpoint?url=https://pages.onekuma.cn/project/<name>`.

+ XLor's Blog: [![blog](https://img.shields.io/endpoint?url=https://pages.onekuma.cn/project/xlor)](https://xlor.cn)
+ Anime Paste: [![animepaste](https://img.shields.io/endpoint?url=https://pages.onekuma.cn/project/animepaste)](https://anime.xlorpaste.cn)
+ 弥希 Miki 的舰长日报: [![miki](https://img.shields.io/endpoint?url=https://pages.onekuma.cn/project/miki)](https://miki.xlor.cn/)

## Deploy

```bash
npx wrangler secret put CF_ACCOUNT_ID
npx wrangler secret put CF_API_TOKEN
npx wrangler publish
```

Then, you can use `https://img.shields.io/endpoint?url=https://<domain>/project/<name>`.

## Inspiration

+ [aidenwallis/cloudflare-pages-badges](https://github.com/aidenwallis/cloudflare-pages-badges): Render custom badges for Cloudflare Pages projects

## License

MIT License © 2021 [XLor](https://github.com/yjl9903)
