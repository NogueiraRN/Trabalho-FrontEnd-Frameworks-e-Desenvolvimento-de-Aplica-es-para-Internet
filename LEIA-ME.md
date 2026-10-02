# CE Agora — portal de notícias (versão 2)

Trabalho acadêmico em HTML, CSS e JavaScript puros, inspirado na organização de portais de notícias. Todas as 8 matérias são fictícias. Fotografias ilustrativas locais incluídas, com fontes em creditos.html; o site não depende de serviços externos para carregar imagens, fontes ou bibliotecas. As fotos não documentam os eventos fictícios descritos.

## 1. Abrir no VS Code

1. Extraia o ZIP (botão direito → Extrair tudo no Windows).
2. No VS Code, clique em Arquivo → Abrir Pasta e selecione portal-noticias.
3. Abra index.html para ver o código da página inicial.
4. Para visualizar rapidamente, abra index.html no Chrome ou Edge pela pasta do Windows.
5. Para testar cadastro, login e CMS com armazenamento consistente, use um servidor local: a extensão Live Server do VS Code pode fornecer isso. Abra a página pela extensão e mantenha sempre o mesmo endereço e porta. Alternativa sem extensão, se já tiver Python: execute `python -m http.server 5500` no terminal dentro da pasta e acesse http://localhost:5500.
6. O site publicado via HTTPS também permite testar todos os recursos. O acesso direto por arquivo pode variar entre navegadores, principalmente quanto ao armazenamento.

## 2. Arquivos e pastas

- index.html: página inicial, destaque, busca e paginação.
- style.css: aparência e adaptação para celular.
- script.js: busca, filtros, paginação, leitura, autenticação demonstrativa e CMS.
- regiao.html: filtro por cidade e categoria.
- login.html: formulário de entrada.
- cadastro.html: cadastro demonstrativo de leitores.
- admin.html: painel administrativo e área do leitor.
- materia.html: página compartilhada para notícias criadas pelo painel.
- materias/: oito arquivos HTML, um para cada notícia inicial.
- js/dados.js: títulos, resumos, categorias e textos iniciais.
- imagens/: sete fotografias JPG, favicon e ilustrações SVG da primeira versão.
- creditos.html: fontes das fotografias e esclarecimento sobre uso ilustrativo.
- LEIA-ME.md: este guia.

Os HTML das matérias usam script.js para buscar o texto em js/dados.js (ou nas alterações locais do CMS). Por isso não basta enviar apenas um HTML: envie a pasta completa.

## 3. Testar o trabalho

1. Na página inicial, confira as notícias e clique na página 2. São 6 matérias na primeira página e 2 na segunda; o destaque repete a principal.
2. Pesquise uma palavra, como biblioteca. Apague a busca para ver todas novamente.
3. Abra Região e filtre Fortaleza, Sobral ou Juazeiro do Norte.
4. Abra uma notícia para ler seu texto completo.
5. Em Cadastro, crie um leitor com dados fictícios e uma senha de teste (mínimo 6 caracteres). Entre com ele: o leitor não recebe o painel de edição.
6. Saia e entre com a conta administrativa abaixo.
7. Crie uma matéria, abra-a no portal, volte ao painel e edite ou exclua.
8. Recarregue a página: as alterações permanecem no mesmo navegador e endereço.
9. Exporte as notícias em JSON para guardar os textos. A exportação é um arquivo de dados, não um backup de contas e não altera automaticamente o código do projeto.
10. Para voltar ao começo, clique em Restaurar 8 matérias iniciais (apaga notícias criadas/editadas neste navegador, após confirmação).

### Administrador de demonstração

E-mail: admin@ceagora.com
Senha: Admin123

## 4. Limitações que você deve saber explicar

Este é um protótipo frontend, não um CMS de produção. O JavaScript roda no navegador. Notícias e cadastros ficam em localStorage; a sessão fica em sessionStorage. As alterações do painel não são enviadas ao GitHub nem aparecem em outros computadores. Limpar os dados do navegador remove alterações e contas. Para mudar o conteúdo inicial de todos os visitantes, edite js/dados.js e envie esse arquivo atualizado ao repositório; navegadores com alterações locais precisam restaurar as matérias iniciais para adotá-las.

O cadastro usa hash SHA-256 com salt para evitar gravar a senha em texto puro, mas isso não fornece autenticação real. A conta de admin é pública e o controle de acesso pode ser alterado pelo próprio navegador. Use somente dados e senhas fictícios. Um sistema real exige backend, banco de dados e autenticação no servidor.

## 5. Relação com o enunciado informado

Implementado: início, região, CMS administrativo demonstrativo, cadastro, login, 8 matérias completas, paginação, busca, filtros e layout responsivo.

IMPORTANTE: pastas organizadas NÃO significam utilização de framework. Este projeto usa HTML/CSS/JS puros, como solicitado. O framework e o significado de “extensões” exigidos pelo professor não foram informados. Não apresente esses dois requisitos como atendidos sem confirmar com ele. A extensão de editor Live Server, por si só, não comprova um requisito de extensão do site. Se ele exigir CMS real com banco de dados, este protótipo também precisará ser ampliado.

## 6. Colocar no GitHub e publicar

1. Entre em github.com e crie um repositório chamado portal-noticias. Para o caminho gratuito mais simples do Pages, use repositório público; não envie dados pessoais.
2. Na área de arquivos, use Add file → Upload files (ou o link de upload exibido em repositório vazio).
3. Arraste o CONTEÚDO de portal-noticias, incluindo as pastas js, imagens e materias. Não envie somente o ZIP e não deixe index.html dentro de uma pasta extra no repositório.
4. Confirme o envio em Commit changes. Confira que index.html aparece na raiz junto com style.css e script.js.
5. Acesse Settings → Pages. Em Build and deployment, escolha Deploy from a branch. Selecione a branch main e a pasta /(root), e salve.
6. Aguarde a publicação e use o link exibido pelo GitHub Pages. O endereço normalmente segue https://SEU-USUARIO.github.io/portal-noticias/.
7. Entregue o link do repositório (código) e o link do site (demonstração), conforme solicitado pelo professor.

Referências oficiais consultadas em 02/10/2026:
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 7. Como explicar em sala

“O HTML estrutura as páginas. O CSS cuida do visual responsivo. O JavaScript busca as notícias, aplica filtros e divide os resultados em páginas. O painel demonstra criação, leitura, edição e exclusão de matérias. Os dados ficam no navegador, pois este projeto não possui backend.”

Antes de entregar, leia o código e teste esses fluxos para conseguir explicar o funcionamento.


## 8. O que mudou na versão 2

- Cabeçalho vermelho, fundo branco, tipografia maior e layout inspirado em portais como o G1, com identidade CE Agora.
- Manchete principal e dois destaques fotográficos.
- Feed com fotos, resumo, cidade, categoria e tempo estimado de leitura.
- Coluna lateral com links de cidades, seleção editorial e assuntos (não há contagem inventada de notícias mais lidas).
- Menu recolhível, melhorias de layout no celular e botão para voltar ao topo.
- Página da matéria com crédito da foto, botão de copiar link, progresso de leitura e duas sugestões de notícias.
- Formulários mais claros e opção de mostrar/ocultar senha.
- Painel com contadores de matérias/categorias/cidades e prévia da foto.
- Armazenamento compatível com a primeira versão: contas e notícias locais permanecem ao atualizar no mesmo endereço.

## 9. Atualizar o projeto já publicado no GitHub

1. Extraia o novo ZIP em uma pasta separada para não confundir com a versão anterior.
2. No repositório existente, vá em Add file → Upload files.
3. Arraste todo o CONTEÚDO da pasta portal-noticias: arquivos soltos e as pastas imagens, js e materias.
4. Os arquivos com os mesmos nomes e caminhos serão atualizados. O README.md que você escreveu no GitHub será preservado: este pacote não contém esse arquivo.
5. Confirme em Commit changes. Aguarde a publicação em Actions terminar com sucesso e recarregue o site com Ctrl + F5.
6. Seu link público continua o mesmo. Não é necessário criar outro repositório nem apagar os dados do navegador.

As fotos foram obtidas no Pexels. Veja as páginas de origem e autoria em creditos.html e os termos em https://www.pexels.com/license/. Fotos temáticas de banco de imagens; os fatos narrados nas matérias são fictícios.

Validação desta versão: navegação das oito matérias, paginação, busca, filtros, cadastro e login de leitor, login administrativo, criação/edição/exclusão de matéria e persistência após recarregar foram testados em Chromium. A adaptação para celular foi verificada em 390 px.
