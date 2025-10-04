FROM mcr.microsoft.com/playwright:v1.55.1-jammy

WORKDIR /app

# Atualiza o nodeJS, npm e instala as dependências do projeto
RUN apt update && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs && \
    npm install -g npm

# Instalar o Playwright e os navegadores necessários
RUN npx playwright install --with-deps chromium

# Copia apenas os arquivos de configuração primeiro
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto dos arquivos
COPY . .

# roda o script de build
RUN node scripts/build-extension.mjs

CMD ["npm","test"]