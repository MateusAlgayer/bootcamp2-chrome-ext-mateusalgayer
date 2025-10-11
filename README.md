# ⏱️ Pomodoro Timer

Um aplicativo simples e eficaz baseado na técnica Pomodoro para aumentar sua produtividade. Trabalhe em blocos de tempo com pausas programadas e mantenha o foco nas suas tarefas!

Desenvolvido para a disciplina de Bootcamp II.

# 🔒Permissões necessárias

- alarms
- notifications

# 📦 Instalação

Siga os passos abaixo para instalar e executar o projeto localmente:

1 - Baixe o zip do projeto nas releases

```
https://github.com/MateusAlgayer/bootcamp2-chrome-ext-mateusalgayer/releases
```

2 - Vá até as extensões do chrome 

```
chrome://extensions/
```

Ative o modo de desenvolvedor, e carregue a extensão.

# 🚀 Uso

Após iniciar o app, você verá a interface principal com as seguintes funcionalidades:

* ⏳ Temporizador Pomodoro (15 minutos por padrão)
  * ☕ Botões de 15, 30, 45 e 60 minutos
* 🔔 Notificações sonoras e visuais

Você pode iniciar ou zerar o ciclo a qualquer momento.

# 🛠️ Testes

Para rodar os testes localmente utilizar os comandos:

1 - Para construir a imagem:
```
sudo docker compose build
```

2 - Para rodar os testes E2E locais
```
sudo docker compose run --rm e2e
```

Os testes são realizados utilizando Playwright.

Também são realizados testes de CI ao dar commit das alterações para o git via Github Actions.

# 🧱 Estrutura do Projeto

Abaixo está uma visão geral da estrutura de diretórios:

```
bootcamp2-chrome-ext-mateusalgayer/
├── icons/                       # Ícones da aplicação
│   ├── icon16.png               # Ícone 16x16
│   ├── icon32.png               # Ícone 32x32
│   ├── icon48.png               # Ícone 48x48
│   └── icon128.png              # Ícone 128x128
├── src/                         # Código-fonte principal
│   ├── assets/                  # Assets da aplicação
|   |   └── logo.png             # Logo da aplicação para uso de notificação
│   ├── background/              # Serviços 
|   |   └── service-worker.js    # Service worker para gerenciar as APIs do chrome
│   ├── popup/                   # Funções auxiliares
|   |   ├── popup.html           # HTML estático do popup
|   |   └── popup.js             # Controller da tela de popup
│   └── styles/                  # Estilos
|       └── styles.css           # .css com os estilos do popup
├── docs/                        # Pasta com o conteúdo publicado no github pages
|   ├── index.html               # Página inicial do github pages
|   └── styles/                  # Estilos do github pages
|       └── styles.css           # .css com os estilos do github pages
├── tests/                       # Testes do sistema
|   ├── extension.spec.ts        # Testes unitários da extensão
|   └── playwright.config.ts     # Configurações Playwright
├── scripts/                     # scripts da aplicação
|   └── build-extension.mjs      # script para build da aplicação
├── manifest.json                # Manifesto com as permissões e configurações da extensão.
└── README.md                    # Documentação
```

# 📄 Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).

Você é livre para usar, modificar e distribuir este software com atribuição adequada.
