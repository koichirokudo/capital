# syntax = docker/dockerfile:1
FROM node:alpine

# アプリケーションディレクトリを作成
WORKDIR /app

# アプリケーションの依存関係をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースをコピー
COPY . .

# build
RUN npm run build

# コンテナ起動時に実行するコマンド
CMD ["npm", "run", "start"]
