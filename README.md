# Estudo Faixa Preta

Site simples para assistir as aulas, protegido por uma senha fixa.

## Configurar
1. Suba os .mp4 da pasta `0_faixa-preta (WhatsApp)` para uma pasta do servidor que seja acessivel por HTTPS
   (ex.: `https://videos.seudominio.com.br/faixa-preta/001 - passagem....mp4`).
2. Na Vercel, crie as variaveis de ambiente:
   - `SITE_PASSWORD` = a senha
   - `VIDEO_BASE_URL` = URL da pasta, sem barra no final
3. Deploy.

## Rodar local
```
cp .env.example .env.local
npm install
npm run dev
```

A lista de aulas fica em `data/videos.json`.
