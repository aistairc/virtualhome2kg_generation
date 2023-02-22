# 前提条件

- Linux, 又は Mac で Docker と Docker Compose がインストールされていること

# Virtualhome スクリプト生成システム

# 起動方法

- https://github.com/aistairc/virtualhome2kg_generation を clone します。
- ディレクトリに入り、ブランチを kgrc4si にします。
- `git submodule update --init`を実行します。
- https://github.com/aistairc/virtualhome_unity_aist/releases/download/Build_2023_0111/Build_2023_0111_linux.zip をダウンロードし、`/virtualhome_aist/docker/unity`に設置します。
- `docker compose -f full.docker-compose.yml up --build`を実行します。
- しばらく待つと http://localhost:8080 で確認することができます。

このとき、SPARQL Endpoint として GraphDB、動画生成を行うための Virtualhome API がローカルで起動します。  
それらが不要な場合は  
`docker compose up`を実行すると、可視化システムのみが立ち上がります。  
そのとき

```docker-compose.yml
  - version: '3'
  - services:
      - vhecitor:
          - ports:
              - - 3000:3000
          - build:
              - context: ui
              - args:
                  - NEXT_PUBLIC_SPARQL_ENDPOINT: xxx # SPARQL Endpoint接続先URL
                  - NEXT_PUBLIC_API_URL: xxx # virtualhome apiのURL
```

この`NEXT_PUBLIC_SPARQL_ENDPOINT`と`NEXT_PUBLIC_API_URL`の値をそれぞれの接続先の URL にする必要があります。  
またそれぞれの接続先が以下の条件を満たすならば、スクリプト生成システムは静的ページとして github pages に展開することもできます。

- レスポンスヘッダーとして Access-Control-Allow-Origin を\*か、可視化システムが存在するドメインを返却すること。
- HTTPS であること。

# 定義ファイル更新方法

Action に関する定義は `/ui/scripts/actions/actions.csv`
Object に関する定義は`/ui/scripts/objects/`の`scene1.csv`から`scene7.csv`
の CSV ファイルを差し替えて再ビルドすることで反映されます。

# データ更新方法

当リポジトリはhttps://github.com/KnowledgeGraphJapan/KGRC-RDF の`kgrc4si`をフォーク元として持っており、そのブランチが持っている RDF データ等に変更があった場合に以下の手順で同期することが可能です。

```
git remote add upstream git@github.com:KnowledgeGraphJapan/KGRC-RDF.git # upstreamリポジトリを設定
git fetch upstream # upstreamリポジトリを更新
git merge upstream/kgrc4si # upstreamブランチと同期
```

# Virtualhome API システム

# 起動方法

- https://github.com/aistairc/virtualhome_aist をクローンします。
- ブランチを`docker`にします。
- https://github.com/aistairc/virtualhome_unity_aist/releases/download/Build_2023_0111/Build_2023_0111_linux.zip をダウンロードし、`/docker/unity`に設置します。
- `docker`に移動します。
- `docker compose up --build`を実行します。
- http://localhost/ を開き画面に`{"Hello":"VirtualHome"}`が表示されていれば起動できています。

ポート番号は 80 になっています。変更する場合は

```docker-compose.yml
  - version: "3.8"
  - services:
      - unity:
          - build:
              - context: ./unity
          - image: vh0
          - volumes:
              - - ./Output:/Output # NOTE: ホスト側を実行するマシンにあわせる
      - api:
          - build:
              - context: ..
              - dockerfile: ./docker/api/Dockerfile
          - image: vh0-api
          - ports:
              - - "80:80"
          - volumes:
              - - ./Output:/Output # NOTE: ホスト側を実行するマシンにあわせる
          - depends_on:
              - unity:
                  - condition: service_started
          - environment:
              - ALLOW_CORS: 'true'
```

の services > api > ports 設定されているものの左側の数値を変更します。
