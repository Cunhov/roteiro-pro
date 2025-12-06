<div align="center">
<img width="1200" height="475" alt="Roteiro YouTube Pro - Gemini Edition" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<h1 align="center">🎬 Roteiro YouTube Pro - Gemini Edition</h1>

<p align="center">
  <strong>Automatize a criação de roteiros profissionais para o YouTube transformando transcrições em conteúdo estruturado usando Google Gemini AI.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-docker-deployment">Docker</a> •
  <a href="#-vps-deployment">VPS Deployment</a> •
  <a href="#-usage">Usage</a>
</p>

---

## 📋 Sobre

**Roteiro YouTube Pro - Gemini Edition** é uma aplicação web completa que utiliza o poder da IA do Google Gemini para criar roteiros profissionais de YouTube. A ferramenta oferece um conjunto completo de funcionalidades para criadores de conteúdo, desde a análise de nichos até a geração de thumbnails.

### 🎯 Features

#### 🎬 **Gerador de Roteiro Profissional**
Pipeline de 7 etapas que transforma ideias em roteiros prontos para gravação:
- **Estratégia & Estrutura**: Define ângulo, duração e ganchos culturais
- **Introdução**: Cria gancho viral e apresentação do problema
- **Desenvolvimento**: Conteúdo principal com narrativa envolvente
- **Integração de Produto**: CTA de infoproduto inserido naturalmente
- **Patrocínio & Encerramento**: Integração de patrocinador e call-to-action final
- **Auditoria de Conteúdo**: Verificação automática de tom, idioma e validação
- **Normalização SSML**: Otimização para ElevenLabs com pausas e marcações

#### 🔍 **Analisador de Nichos**
Identifica oportunidades de mercado usando estratégia Blue Ocean:
- Extração hierárquica (Nichos → Subnichos → Temas)
- Scanner de mercado com simulação de dados
- Matriz de oportunidade
- Plano estratégico personalizado

#### 🎨 **Criador de Temas**
Gera ideias de vídeos virais baseadas em:
- Análise de tendências
- Pesquisa de concorrência
- Hooks emocionais otimizados
- Estratégias de engajamento

#### 📝 **Gerador de Título e Descrição**
Cria títulos otimizados para SEO e descrições completas:
- Análise de palavras-chave
- Hooks de clique otimizados
- Descrições estruturadas com CTAs
- Otimização para algoritmo do YouTube

#### 🎥 **B-Roll Creator**
Gera sugestões de B-roll sincronizadas com o roteiro:
- Análise temporal do conteúdo
- Sugestões de imagens e vídeos
- Integração com busca ou geração de imagens
- Pacing configurável (rápido/médio/lento)

#### 🖼️ **Criador de Thumbnail**
Gera thumbnails profissionais usando IA:
- Múltiplos estilos visuais
- Textos otimizados
- Análise de concorrência
- Export em alta resolução

#### ⚙️ **Sistema de Configurações Avançadas**
Controle total sobre os provedores de IA:
- Suporte para múltiplos providers (Gemini, OpenAI, Anthropic, Grok, DeepSeek, Poe)
- Configuração separada para texto/imagem/search
- Controle de temperatura e tokens
- Modelos de reasoning/thinking

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: CSS (Vanilla)
- **Icons**: Lucide React
- **AI Provider**: Google Gemini API (@google/genai)
- **Audio**: ElevenLabs integration
- **Utilities**: JSZip para export
- **Deployment**: Docker + Nginx

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** 18+ (recomendado: 20+)
- **NPM** ou **Yarn**
- **Gemini API Key** (obtenha em [Google AI Studio](https://ai.google.dev/))
- **Docker** (opcional, para deployment containerizado)

### Instalação Local

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd roteiro-pro
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure a API Key**
   
   Crie um arquivo `.env.local` na raiz do projeto:
   ```bash
   GEMINI_API_KEY=sua_chave_api_aqui
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   
   Abra seu navegador em `http://localhost:5173`

### Build para produção

```bash
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

### Opção 1: Docker Compose (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd roteiro-pro
   ```

2. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env.local`:
   ```bash
   GEMINI_API_KEY=sua_chave_api_aqui
   ```

3. **Build e execute**
   ```bash
   docker-compose up -d
   ```

4. **Acesse a aplicação**
   
   Abra `http://localhost:3000`

5. **Gerenciamento**
   ```bash
   # Ver logs
   docker-compose logs -f
   
   # Parar Container
   docker-compose down
   
   # Rebuild após mudanças
   docker-compose up -d --build
   ```

### Opção 2: Docker Manual

1. **Build da imagem**
   ```bash
   docker build -t roteiro-youtube-pro .
   ```

2. **Execute o container**
   ```bash
   docker run -d \
     -p 3000:80 \
     -e VITE_GEMINI_API_KEY=sua_chave_api_aqui \
     --name roteiro-youtube-pro \
     roteiro-youtube-pro
   ```

3. **Acesse**
   
   Abra `http://localhost:3000`

### Configuração de Portas

Para usar uma porta diferente, edite o `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Troque 8080 pela porta desejada
```

---

## 🌐 VPS Deployment

### Passo 1: Preparar o VPS

1. **Conecte via SSH**
   ```bash
   ssh user@seu-vps-ip
   ```

2. **Atualize o sistema**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Instale o Docker**
   ```bash
   # Instalar Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Adicionar usuário ao grupo docker
   sudo usermod -aG docker $USER
   
   # Instalar Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Verificar instalação
   docker --version
   docker-compose --version
   ```

4. **Configure o Firewall**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS (se usar SSL)
   sudo ufw enable
   ```

### Passo 2: Deploy da Aplicação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd roteiro-pro
   ```

2. **Configure a API Key**
   ```bash
   nano .env.local
   ```
   
   Adicione:
   ```
   GEMINI_API_KEY=sua_chave_api_aqui
   ```

3. **Inicie a aplicação**
   ```bash
   docker-compose up -d
   ```

4. **Verifique o status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### Passo 3: Configurar Domínio (Opcional)

Se você tem um domínio, pode configurar SSL com Let's Encrypt:

1. **Instale o Nginx**
   ```bash
   sudo apt install nginx -y
   ```

2. **Configure o reverse proxy**
   ```bash
   sudo nano /etc/nginx/sites-available/roteiro-pro
   ```
   
   Adicione:
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Ative o site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/roteiro-pro /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Configure SSL com Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d seu-dominio.com
   ```

### Passo 4: Manutenção

```bash
# Ver logs
docker-compose logs -f

# Restart
docker-compose restart

# Atualizar aplicação
git pull
docker-compose up -d --build

# Backup (se necessário)
docker-compose down
tar -czf backup-$(date +%Y%m%d).tar.gz .
```

---

## 📖 Usage

### 1. Gerador de Roteiro

1. Acesse a ferramenta "Gerador de Roteiro"
2. Preencha os campos:
   - **Tipo de Canal**: Autoridade ou Dark/Faceless
   - **Tema**: Assunto do vídeo
   - **Transcrição**: Cole a transcrição de referência (opcional)
   - **Nome do Canal/Narrador**: Personalização
   - **CTA de Produto**: Descrição do infoproduto
   - **CTA de Patrocínio**: Mensagem do patrocinador
   - **Estilo**: Informal, Profissional, Investigativo, etc.
   - **Duração**: 8-12 minutos (padrão)
   - **Idioma**: Português (Brasil), English, etc.
3. Clique em "Gerar Roteiro"
4. Aguarde o processamento das 7 etapas
5. Copie o roteiro final ou exporte em PDF
6. Use o botão de áudio para gerar narração com ElevenLabs

### 2. Configurações do Sistema

1. Acesse "Configurações"
2. Configure seus providers de IA:
   - **Text Provider**: Modelo para geração de texto
   - **Image Provider**: Modelo para geração de imagens
   - **API Keys**: Adicione as chaves de cada provider
3. Ajuste parâmetros avançados:
   - **Temperature**: Criatividade (0.0 - 2.0)
   - **Max Tokens**: Limite de saída
   - **Enable Search**: Grounding com busca
   - **Enable Thinking**: Modelos de reasoning
4. Salve as configurações

### 3. Outras Ferramentas

- **Analisador de Nichos**: Insira uma área de interesse e receba análise completa
- **Criador de Temas**: Gere ideias virais baseadas em tendências
- **Título & Descrição**: Otimize para SEO e CTR
- **B-Roll Creator**: Sincronize sugestões visuais com o roteiro
- **Thumbnail Creator**: Gere thumbnails profissionais com IA

---

## 🔧 Environment Variables

| Variável | Descrição | Exemplo | Obrigatório |
|----------|-----------|---------|-------------|
| `GEMINI_API_KEY` | Chave da API do Google Gemini | `AIzaSy...` | ✅ Sim |
| `VITE_GEMINI_API_KEY` | Alias para build (Docker) | `AIzaSy...` | ✅ Sim (Docker) |

> **Nota**: No desenvolvimento local, use `.env.local`. No Docker, passe via `docker-compose.yml` ou variável de ambiente do sistema.

---

## 🏗️ Architecture

```
roteiro-pro/
├── components/          # Componentes React
│   ├── Sidebar.tsx
│   ├── InputSection.tsx
│   ├── NicheAnalyzer.tsx
│   ├── ThemeCreator.tsx
│   ├── BRollCreator.tsx
│   ├── ThumbnailCreator.tsx
│   ├── TitleDescriptionGenerator.tsx
│   ├── Settings.tsx
│   └── ...
├── services/            # Serviços de integração
│   ├── llmGateway.ts    # Gateway multi-provider
│   ├── geminiService.ts # Serviço Gemini
│   ├── elevenLabsService.ts
│   └── storageService.ts
├── utils/               # Utilitários
│   ├── prompts.ts       # Prompts do pipeline
│   └── validators.ts    # Validadores de conteúdo
├── types.ts             # Definições TypeScript
├── App.tsx              # Componente principal
├── Dockerfile           # Multi-stage build
├── docker-compose.yml   # Orquestração
└── nginx.conf           # Configuração SPA
```

---

## 🐛 Troubleshooting

### Erro: "API Key inválida"

**Solução**:
1. Verifique se a API Key está correta no `.env.local`
2. Confirme que a key tem permissões no Google AI Studio
3. Reinicie o servidor de desenvolvimento

### Docker: Container não inicia

**Solução**:
```bash
# Ver logs
docker-compose logs -f

# Verificar portas em uso
lsof -i :3000

# Rebuild completo
docker-compose down -v
docker-compose up -d --build
```

### Build falha no Vite

**Solução**:
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

### Erro de CORS no VPS

**Solução**:
- Verifique se o Nginx está configurado corretamente
- Confirme que o firewall permite tráfego na porta 80/443
- Verifique os headers de CORS no `nginx.conf`

---

## 📄 License

Este projeto está sob a licença especificada no arquivo LICENSE.

---

## 🤝 Contributing

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

## 📞 Support

Para dúvidas ou suporte, abra uma issue no GitHub ou consulte a [documentação do Google Gemini](https://ai.google.dev/docs).

---

<div align="center">
  <p>Desenvolvido com ❤️ usando Google Gemini AI</p>
  <p>Link do AI Studio: <a href="https://ai.studio/apps/drive/1N9lwZRhHvq0LIiW8ZIndXeNQj-JZwsDQ">Ver App no AI Studio</a></p>
</div>
