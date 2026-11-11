# Dawnbringer: Privacy Policy

Effective date: 2026-11-11

Developer: gmunaro (individual developer), contact: dawnbringergame@gmail.com

*Versão em português abaixo.*

## Summary

Dawnbringer does not have accounts, ads, tracking or in-app purchases, and it has no third-party
analytics. Your game progress stays on your device. The game sends data over the internet when you
choose to send a bug report and, only if you turn them on, a record of each run when the run ends.
In the Google Play version for Android it also checks that your Google account owns the game, and
every version asks this website once a day at most whether a newer version exists. Voice notes for
bug reports are turned into text on your phone: no sound is sent.

## Data stored on your device

The game saves your progress (the gold you keep between runs, what you unlocked in the House, the
hunter you made, the hunters that fell or won in earlier runs, your quests, your collection and
your totals) and your settings (language, volume, display options) in the app's private storage on
your device. This save is not sent to us or to anyone else, and it is not included in Android cloud
backups. On Android, uninstalling the game deletes it; on PC it stays in your user data folder
until you delete it. If a bug report you sent could not be delivered (for example, you were
offline), the game keeps it in the same storage and tries again the next times you open the game,
then deletes it. The name you typed in the bug reporter and its random id are kept in the game's
settings. If you turn on run records, the game also keeps your answer and the random id described
below in its settings, and keeps up to 20 records it could not deliver until it can send them
(and, from version 0.8.0, up to 10 duel records). The heroes you keep for duels, your own and the
codes friends sent you, stay in your game profile. A duel code you share holds your hero's build,
name and looks; it leaves your device only when you send it yourself, and the duel page of this
site reads it in your browser without sending it to us.

## Bug reports (only when you send one)

The game has an in-game bug reporter. Nothing is sent unless you open it and press Send. A report
contains:

- the description you type, or dictate with Voice note (see "Voice notes" below);
- the name you type in "Your name (optional)", if you type one. Without it the report is anonymous.
  The game keeps the name on your device for your next reports;
- a random id the game creates on your device for bug reports, so that the reports of one install
  can be counted together. It is separate from the id of the run records (below), so a report
  cannot be tied to your run records, and it is not linked to your Google account or to your
  device's identifiers. "Delete my data" in Options gives you a new one and makes the game forget
  the name you typed; the reports you already sent stay on the server (see the last paragraph of
  this section to have them deleted);
- a screenshot of the game screen, unless you untick "Attach this screenshot" before sending;
- the game version, the operating system name and version, and the game's language setting;
- where you were in the game: the current screen and, during a run, your hunter's trade, week, day
  and the run's seed (the number that generates the run's map);
- an excerpt of the game's own log (technical messages from the game, such as errors). The game
  removes the path of its data folder from the excerpt; other file paths, such as the folder the
  game is installed in, may still appear. On Android the game keeps no log file, so no excerpt is
  sent.

The report is sent over an encrypted connection (HTTPS) to a server run by the developer on
Cloudflare Workers (Cloudflare, Inc.), which files it as an issue in a private GitHub repository
and stores the screenshot in the same repository (GitHub, Inc. hosts it as our service provider).
We use reports only to find and fix bugs. We do not sell them, share them with third parties for
their own use, or use them for advertising.

Like any internet connection, the server sees your IP address while receiving the report. From it,
Cloudflare estimates where the connection comes from: the country, the region, the city and
coordinates that the server rounds to about 11 km. That place is often only the nearest large city.
The server adds the city and the country to the report. It also stores the place, with the report's
number and time, the name, the id, the game version, the platform, the language, the screen and
your hunter's trade, in a database on Cloudflare (Cloudflare D1), so that we can see where bugs
come from. The IP address itself is not stored with the report or in that database. To stop abuse,
the server keeps a count of reports per IP address (for IPv6, per network prefix) for up to two
hours, then the count is deleted automatically. The server also keeps technical logs of each
request (Cloudflare Workers Logs), which may include your IP address, for a few days (at most 7)
before they are deleted automatically; the developer can read them to fix problems with the
server.

Please do not type other personal information (such as your email or phone number) in the
description or in "Your name"; a first name or a nickname is enough. Reports are kept while the bug
is being worked on and then may be kept as part of the project's issue history, with their row in
the database. "Delete my data" does not delete reports already sent. To have a report deleted,
email dawnbringergame@gmail.com with the date you sent it and a few words of its description, and
we will delete it.

## Voice notes (Android only, only when you use them)

The bug button has a Voice note option. It works only on an Android phone that can recognize speech
on the device itself (Android 12 or later); anywhere else the option is turned off. The first time
you use it, Android asks for permission to use the microphone. The game listens only after you tap
Voice note, until you tap it again or for 60 seconds at most.

The speech is recognized by the recognizer built into Android, on your phone. The game does not use
an online recognizer, and it does not record, store or send the sound. Only the words it
recognized are added to the description of your bug report, as if you had typed them. They show
beside the button and in the report panel, where you can edit them before you send the report.
The game uses the microphone for nothing else.

## Run records (only if you turn them on)

Used only to tune Dawnbringer's difficulty and balance. Nothing is sold or shared, and no name,
text or photo is sent.

When you first open the game, it asks whether it may send a record of each run when the run ends.
If you choose "Later", it asks once more when your next run ends, and a yes there also sends that
run. If you answer "No, thanks", it does not ask again. We use the records only to tune the game's
difficulty and balance: to learn in which run players win for the first time, where runs end and
which choices lead there. Nothing is sent unless you answer yes, and you can turn this on or off at
any time in Options.

A record is sent only when a run ends, never while you play it. If you are offline when the run
ends, the game keeps it and sends it the next time you open the game, or later while you are not
in a run. The game keeps at most 20 unsent records and drops the oldest past that. A record
contains:

- the game version, the platform (for example Android or Windows) and the version of the record's
  format;
- a random id the game creates on your device, so that the records of one install can be counted
  together. It is not linked to your Google account, to your device's identifiers or to anything
  else about you. Options shows its first and last four characters. Each record also carries a
  random id of its own, so that a record sent twice is counted once;
- the run's number in your profile and whether you had won a run before;
- how the run was set up: its seed (the number the game draws the run from), your hunter's trade,
  the item families in play, how much gold you took from the bank, the vows, the game speed and the
  game's language;
- every choice you made in the run, in order: where you went on the map, the events and the option
  you picked, the items you were offered, bought, sold, forged and refined, the cards, the Oddities
  you took, the classes offered and taken, the skills and attribute points, resetting your build,
  guild contracts and posts, being expelled from or leaving a guild, and whether you went home or
  went on after each Landlord;
- every fight: the enemies, whether you won, and your health before and after; and the people of
  the world you met or killed on the way;
- how your hunter was built as the run went on: gold, health, level, attributes, gear and build,
  the Dread, whether you carried the mark for killing one of the people of the world, and which
  event choices opened later events;
- the Landlords you faced, how the run ended (you won, died, abandoned the run, went home or went
  down into the Tolleth) and what defeated you;
- how long you played the run, in minutes, and how many steps you walked on the map.

A record never contains text you typed, your hunter's name, screenshots or anything else that
identifies you.

If you turn run records on, the game also sends a short record of each duel you fight on the Duel
screen (from version 0.8.0), after the duel and never during a run. It contains the game version,
the platform, the random id described above, an id of the duel made from that id and the two heroes
(so the same duel sent twice is counted once), the version of the fight rules, whether the duel was
against a friend's code or on the same device, who won, how many rounds it lasted and whether the
round limit decided it; and, for each of the two heroes, the champion, the class, the level, the
vows, the Oddities and the share of health left at the end. A duel record never contains the duel
code, a hero's name or looks, or anything else that identifies you or your friend. It is used, kept
and deleted like the run records.

Records are sent over an encrypted connection (HTTPS) to the same server as bug reports (Cloudflare
Workers) and stored in a database on Cloudflare (Cloudflare D1), with the date, not the time, they
arrived. Cloudflare, Inc. hosts them as our service provider. We do not sell the records, share
them with third parties for their own use, or use them for advertising. The server uses your IP
address only to limit how many records can be sent per minute; the IP address is not stored with
the records. The server's technical logs are the same as for bug reports, described above.

Records are deleted automatically 12 months after they arrive. To delete yours sooner, press
"Delete my data" in Options: the game asks the server to delete every record sent with your id,
then creates a new id. You can also email dawnbringergame@gmail.com with the id shown in Options,
and we will delete them. If you turn records off, the game sends nothing more and deletes the
records it had not sent yet. Records already sent stay until the 12 months pass or you delete
them.

## Google Play license check (Android, Google Play version only)

When you open the game, it sends a one-time token from Google Play and a random number to the same
server as bug reports, which asks Google whether your Google account owns the game and answers only
yes or no. The game keeps that answer on your device; the server keeps nothing about the check
beyond a short-lived count of requests per IP address to stop abuse and the technical logs described
above. Other versions of the game do not
make this check.

## Update check

On the title screen, the game downloads the file latest.json from this website
(gmunaro.github.io/dawnbringer-site) to see whether a newer version exists. It asks once a day at
most and keeps the answer on your device. The request has no id, no cookie and nothing about you.
Like any web request, it shows your IP address to the server that hosts this website (GitHub
Pages, GitHub, Inc.).

## Children

Dawnbringer is not directed at children under 13, and we do not knowingly collect personal
information from children.

## Changes

If this policy changes, the new version will be posted at this address with a new effective
date.

## Contact

dawnbringergame@gmail.com

---

# Dawnbringer: Política de Privacidade

Data de vigência: 2026-11-11

Desenvolvedor: gmunaro (desenvolvedor individual), contato: dawnbringergame@gmail.com

## Resumo

Dawnbringer não tem contas, anúncios, rastreamento nem compras no app, e não usa analytics de
terceiros. Seu progresso fica no seu aparelho. O jogo envia dados pela internet quando você decide
mandar um relatório de bug e, só se você ativar, um registro de cada partida quando ela termina.
Na versão do Google Play para Android, ele também confere se a sua conta Google tem o jogo, e todas
as versões perguntam a este site, no máximo uma vez por dia, se existe uma versão mais nova. A nota
de voz dos relatórios de bug vira texto no seu celular: nenhum som é enviado.

## Dados guardados no seu aparelho

O jogo salva seu progresso (o ouro que você guarda entre as partidas, o que você desbloqueou na
Casa, o caçador que você criou, os caçadores que caíram ou venceram em partidas anteriores, suas
missões, sua coleção e seus totais) e suas configurações (idioma, volume, opções de tela) no
armazenamento privado do app no seu aparelho. Esse save não é enviado para nós nem para ninguém e
não entra no backup em nuvem do Android. No Android, desinstalar o jogo apaga esses dados; no PC
eles ficam na sua pasta de dados de usuário até você apagá-la. Se um relatório de bug que você
enviou não puder ser entregue (por exemplo, sem internet), o jogo o guarda nesse mesmo
armazenamento e tenta de novo nas próximas vezes que você abrir o jogo; depois o apaga. O nome que
você digitou no relator de bugs e o id aleatório dele ficam nas configurações do jogo. Se você
ativar os registros de partida, o jogo também guarda sua resposta e o id aleatório descrito abaixo
nas configurações, e guarda até 20 registros que não conseguiu entregar até poder enviá-los (e, a
partir da versão 0.8.0, até 10 registros de duelo). Os heróis que você guarda para duelos, os seus
e os códigos que amigos mandaram, ficam no seu perfil do jogo. Um código de duelo que você
compartilha leva a build, o nome e a aparência do seu herói; ele só sai do seu aparelho quando você
mesmo o envia, e a página de duelo deste site o lê no seu navegador, sem enviá-lo para nós.

## Relatórios de bug (só quando você envia)

O jogo tem um relator de bugs. Nada é enviado a menos que você o abra e toque em Enviar. Um
relatório contém:

- a descrição que você digitar, ou ditar com a Nota de voz (veja "Notas de voz" abaixo);
- o nome que você digitar em "Seu nome (opcional)", se digitar. Sem ele o relatório é anônimo. O
  jogo guarda o nome no seu aparelho para os próximos relatórios;
- um id aleatório que o jogo cria no seu aparelho para os relatórios de bug, para que os
  relatórios de uma instalação possam ser contados juntos. Ele é separado do id dos registros de
  partida (abaixo), então um relatório não pode ser ligado aos seus registros de partida, e não tem
  ligação com a sua conta Google nem com os identificadores do seu aparelho. "Apagar meus dados",
  nas Opções, cria um id novo e faz o jogo esquecer o nome que você digitou; os relatórios que você
  já enviou continuam no servidor (veja o último parágrafo desta seção para apagá-los);
- uma captura da tela do jogo, a menos que você desmarque "Anexar esta captura de tela" antes de
  enviar;
- a versão do jogo, o nome e a versão do sistema operacional e o idioma configurado no jogo;
- onde você estava no jogo: a tela atual e, durante uma partida, o ofício do seu caçador, a semana,
  o dia e a semente da partida (o número que gera o mapa da partida);
- um trecho do log do próprio jogo (mensagens técnicas do jogo, como erros). O jogo tira do trecho
  o caminho da sua pasta de dados; outros caminhos de arquivo, como a pasta onde o jogo está
  instalado, ainda podem aparecer. No Android o jogo não grava arquivo de log, então nenhum
  trecho é enviado.

O relatório vai por conexão criptografada (HTTPS) para um servidor do desenvolvedor no Cloudflare
Workers (Cloudflare, Inc.), que o registra como uma issue num repositório privado no GitHub e
guarda a captura de tela nesse mesmo repositório (o GitHub, Inc. hospeda como nosso prestador de
serviço). Usamos os relatórios só para achar e corrigir bugs. Não vendemos, não compartilhamos com
terceiros para uso próprio deles e não usamos para publicidade.

Como em qualquer conexão à internet, o servidor vê seu endereço IP ao receber o relatório. A
partir dele, a Cloudflare estima de onde vem a conexão: o país, a região, a cidade e coordenadas
que o servidor arredonda para cerca de 11 km. Esse lugar muitas vezes é só a cidade grande mais
próxima. O servidor acrescenta a cidade e o país ao relatório. Ele também guarda o lugar, com o
número e a hora do relatório, o nome, o id, a versão do jogo, a plataforma, o idioma, a tela e o
ofício do seu caçador, num banco de dados na Cloudflare (Cloudflare D1), para sabermos de onde vêm
os bugs. O endereço IP em si não é guardado no relatório nem nesse banco. Para evitar abuso, o
servidor guarda uma contagem de relatórios por endereço IP (no IPv6, por prefixo de rede) por até
duas horas, e depois a contagem é apagada automaticamente. O servidor também guarda registros
técnicos de cada requisição (Cloudflare Workers Logs), que podem incluir seu endereço IP, por
alguns dias (no máximo 7), e depois eles são apagados automaticamente; o desenvolvedor pode lê-los
para corrigir problemas do servidor.

Não escreva outros dados pessoais (como e-mail ou telefone) na descrição nem em "Seu nome"; um
primeiro nome ou apelido basta. Os relatórios ficam guardados enquanto o bug é tratado e podem
continuar no histórico de issues do projeto, com a linha deles no banco de dados. "Apagar meus
dados" não apaga os relatórios já enviados. Para apagar um relatório, mande um e-mail para
dawnbringergame@gmail.com com a data do envio e algumas palavras da descrição, e nós o apagaremos.

## Notas de voz (só Android, só quando você usa)

O botão de bug tem a opção Nota de voz. Ela só funciona num celular Android que reconhece fala no
próprio aparelho (Android 12 ou mais novo); em qualquer outro lugar a opção fica desligada. Na
primeira vez que você a usa, o Android pede permissão para usar o microfone. O jogo só escuta
depois que você toca em Nota de voz, até você tocar de novo ou por 60 segundos no máximo.

A fala é reconhecida pelo reconhecedor embutido no Android, no seu celular. O jogo não usa
reconhecedor online e não grava, não guarda nem envia o som. Só as palavras reconhecidas entram na
descrição do seu relatório de bug, como se você as tivesse digitado. Elas aparecem ao lado do botão
e no painel do relatório, onde você pode editá-las antes de enviar. O jogo não usa o microfone para
mais nada.

## Registros de partida (só se você ativar)

Usado só para ajustar a dificuldade e o equilíbrio do Dawnbringer. Nada é vendido nem
compartilhado, e não vai nome, texto nem foto.

Na primeira vez que você abre o jogo, ele pergunta se pode enviar um registro de cada partida
quando ela termina. Se você escolher "Depois", ele pergunta mais uma vez quando a sua próxima
partida terminar, e um sim ali também envia essa partida. Se você responder "Não, obrigado", ele
não pergunta de novo. Usamos os registros só para ajustar a dificuldade e o equilíbrio do jogo:
saber em que partida os jogadores vencem pela primeira vez, onde as partidas terminam e que
escolhas levam até lá. Nada é enviado a menos que você responda sim, e você pode ativar ou
desativar isso quando quiser nas Opções.

Um registro só é enviado quando a partida termina, nunca enquanto você joga. Se você estiver sem
internet quando a partida terminar, o jogo o guarda e envia na próxima vez que você abrir o jogo,
ou depois, quando você não estiver numa partida. O jogo guarda no máximo 20 registros não enviados
e descarta os mais antigos além disso. Um registro contém:

- a versão do jogo, a plataforma (por exemplo Android ou Windows) e a versão do formato do
  registro;
- um id aleatório que o jogo cria no seu aparelho, para que os registros de uma instalação possam
  ser contados juntos. Ele não tem ligação com a sua conta Google, com os identificadores do seu
  aparelho nem com nada mais sobre você. As Opções mostram os quatro primeiros e os quatro últimos
  caracteres dele. Cada registro também leva um id aleatório próprio, para que um registro enviado
  duas vezes seja contado uma vez só;
- o número da partida no seu perfil e se você já tinha vencido uma partida antes;
- como a partida começou: a semente (o número a partir do qual o jogo sorteia a partida), o ofício
  do seu caçador, as famílias de itens em jogo, quanto ouro você tirou do banco, os votos, a
  velocidade do jogo e o idioma do jogo;
- cada escolha que você fez na partida, em ordem: por onde você andou no mapa, os eventos e a opção
  escolhida, os itens que lhe foram oferecidos, comprados, vendidos, forjados e refinados, as
  cartas, as Oddities que você pegou, as classes oferecidas e escolhidas, as habilidades e os
  pontos de atributo, o reinício da sua build, os contratos e os postos nas guildas, a expulsão de
  uma guilda ou a saída dela, e se você voltou para casa ou seguiu depois de cada Senhorio;
- cada luta: os inimigos, se você venceu e a sua vida antes e depois; e as pessoas do mundo que
  você encontrou ou matou pelo caminho;
- como o seu caçador estava montado ao longo da partida: ouro, vida, nível, atributos, equipamento
  e build, o Pavor, se você carregava a marca de quem matou uma das pessoas do mundo e que escolhas
  de evento abriram eventos seguintes;
- os Senhorios que você enfrentou, como a partida acabou (você venceu, morreu, abandonou a
  partida, voltou para casa ou desceu ao Tolleth) e o que derrotou você;
- quanto tempo você jogou a partida, em minutos, e quantos passos você andou no mapa.

Um registro nunca contém texto que você digitou, o nome do seu caçador, capturas de tela nem nada
mais que identifique você.

Se você ativar os registros de partida, o jogo também envia um registro curto de cada duelo que
você lutar na tela de Duelo (a partir da versão 0.8.0), depois do duelo e nunca durante uma partida.
Ele contém a versão do jogo, a plataforma, o id aleatório descrito acima, um id do duelo feito desse
id e dos dois heróis (para que o mesmo duelo enviado duas vezes conte uma vez só), a versão das
regras de luta, se o duelo foi contra o código de um amigo ou no mesmo aparelho, quem venceu,
quantas rodadas durou e se o limite de rodadas decidiu; e, para cada um dos dois heróis, o campeão,
a classe, o nível, os votos, as Oddities e a parte da vida que sobrou no fim. Um registro de duelo
nunca contém o código do duelo, o nome ou a aparência de um herói, nem nada mais que identifique
você ou o seu amigo. Ele é usado, guardado e apagado como os registros de partida.

Os registros são enviados por uma conexão criptografada (HTTPS) para o mesmo servidor dos
relatórios de bug (Cloudflare Workers) e guardados num banco de dados na Cloudflare (Cloudflare
D1), com a data, não a hora, em que chegaram. A Cloudflare, Inc. os hospeda como nossa prestadora
de serviço. Não vendemos os registros, não os compartilhamos com terceiros para uso deles e não os
usamos para publicidade. O servidor usa o seu endereço IP só para limitar quantos registros podem
ser enviados por minuto; o endereço IP não é guardado com os registros. Os registros técnicos do
servidor são os mesmos dos relatórios de bug, descritos acima.

Os registros são apagados automaticamente 12 meses depois de chegarem. Para apagar os seus antes,
toque em "Apagar meus dados" nas Opções: o jogo pede ao servidor que apague todos os registros
enviados com o seu id e depois cria um id novo. Você também pode mandar um e-mail para
dawnbringergame@gmail.com com o id mostrado nas Opções, e nós os apagamos. Se você desativar os
registros, o jogo não envia mais nada e apaga os registros que ainda não tinha enviado. Os
registros já enviados ficam até passarem os 12 meses ou até você apagá-los.

## Verificação de licença do Google Play (só Android, versão do Google Play)

Quando você abre o jogo, ele envia um código de uso único do Google Play e um número aleatório ao
mesmo servidor dos relatórios de bug, que pergunta ao Google se a sua conta Google tem o jogo e
responde só sim ou não. O jogo guarda essa resposta no seu aparelho; o servidor não guarda nada da
verificação além de uma contagem breve de pedidos por endereço IP, contra abuso, e dos registros
técnicos descritos acima. As outras
versões do jogo não fazem essa verificação.

## Verificação de atualização

Na tela de título, o jogo baixa o arquivo latest.json deste site (gmunaro.github.io/dawnbringer-site)
para ver se existe uma versão mais nova. Ele pergunta no máximo uma vez por dia e guarda a resposta
no seu aparelho. O pedido não leva id, cookie nem nada sobre você. Como em qualquer pedido web, ele
mostra o seu endereço IP ao servidor que hospeda este site (GitHub Pages, GitHub, Inc.).

## Crianças

Dawnbringer não é direcionado a menores de 13 anos, e não coletamos dados pessoais de crianças
de propósito.

## Mudanças

Se esta política mudar, a nova versão será publicada neste mesmo endereço com nova data de
vigência.

## Contato

dawnbringergame@gmail.com

---

<section lang="es">
<h2>Verificación de licencia de Google Play (Android, solo versión de Google Play)</h2>
<p>Al abrir el juego, se envían al servidor del desarrollador (el mismo que recibe los reportes de errores) un token de un solo uso de Google Play y un número aleatorio. Ese servidor le pregunta a Google si su cuenta de Google tiene el juego, y solo recibe una respuesta: sí o no. El juego guarda esa respuesta en su dispositivo. El servidor no guarda nada sobre la verificación, salvo un recuento breve de solicitudes por dirección IP para evitar abusos y algunos días de registros técnicos. Las demás versiones del juego no realizan esta verificación.</p>
</section>

<section lang="fr">
<h2>Vérification de licence Google Play (Android, version Google Play uniquement)</h2>
<p>À l&#x27;ouverture du jeu, un jeton à usage unique fourni par Google Play et un nombre aléatoire sont envoyés au serveur du développeur (celui qui reçoit aussi les rapports de bogues). Ce serveur demande à Google si votre compte Google possède le jeu, et ne reçoit qu&#x27;une réponse : oui ou non. Le jeu conserve cette réponse sur votre appareil. Le serveur ne garde aucune donnée sur cette vérification, à part un compteur bref du nombre de requêtes par adresse IP pour lutter contre les abus, et quelques jours de journaux techniques. Les autres versions du jeu n&#x27;effectuent pas cette vérification.</p>
</section>

<section lang="de">
<h2>Lizenzprüfung über Google Play (Android, nur Google-Play-Version)</h2>
<p>Beim Öffnen des Spiels werden ein einmalig gültiges Token von Google Play und eine Zufallszahl an den Server des Entwicklers gesendet (derselbe, der auch Fehlerberichte empfängt). Dieser Server fragt bei Google an, ob Ihr Google-Konto das Spiel besitzt, und erhält nur die Antwort ja oder nein. Das Spiel speichert diese Antwort auf Ihrem Gerät. Der Server speichert zu dieser Prüfung nichts, außer einer kurzzeitigen Zählung der Anfragen pro IP-Adresse zum Schutz vor Missbrauch sowie einigen Tagen technischer Protokolle. Andere Versionen des Spiels führen diese Prüfung nicht durch.</p>
</section>

<section lang="it">
<h2>Verifica della licenza di Google Play (Android, solo versione Google Play)</h2>
<p>All&#x27;apertura del gioco vengono inviati al server dello sviluppatore (lo stesso che riceve le segnalazioni di bug) un token monouso di Google Play e un numero casuale. Il server chiede a Google se il suo account Google possiede il gioco e riceve solo una risposta: sì o no. Il gioco conserva la risposta sul dispositivo. Il server non conserva nulla della verifica, a parte un breve conteggio delle richieste per indirizzo IP, per contrastare gli abusi, e alcuni giorni di log tecnici. Le altre versioni del gioco non effettuano questa verifica.</p>
</section>

<section lang="ru">
<h2>Проверка лицензии Google Play (Android, только версия для Google Play)</h2>
<p>При открытии игры на сервер разработчика (тот же, что принимает отчёты об ошибках) отправляются одноразовый токен от Google Play и случайное число. Сервер спрашивает у Google, владеет ли ваш аккаунт Google этой игрой, и получает только ответ: да или нет. Игра сохраняет этот ответ на вашем устройстве. Сервер не хранит ничего о проверке, кроме краткосрочного счётчика запросов по IP-адресу для защиты от злоупотреблений и нескольких дней технических журналов. Другие версии игры эту проверку не проводят.</p>
</section>

<section lang="uk">
<h2>Перевірка ліцензії Google Play (Android, лише версія для Google Play)</h2>
<p>Під час відкриття гри на сервер розробника (той самий, що приймає звіти про помилки) надсилаються одноразовий токен від Google Play і випадкове число. Сервер запитує у Google, чи володіє ваш обліковий запис Google цією грою, і отримує лише відповідь: так або ні. Гра зберігає цю відповідь на вашому пристрої. Сервер не зберігає нічого про перевірку, окрім короткочасного лічильника запитів за IP-адресою для захисту від зловживань і кількох днів технічних журналів. Інші версії гри цієї перевірки не виконують.</p>
</section>

<section lang="pl">
<h2>Sprawdzenie licencji Google Play (Android, tylko wersja z Google Play)</h2>
<p>Po otwarciu gry na serwer dewelopera (ten sam, który odbiera zgłoszenia błędów) wysyłane są: jednorazowy token z Google Play oraz losowa liczba. Serwer pyta Google, czy Twoje konto Google posiada grę, i otrzymuje tylko odpowiedź: tak lub nie. Gra zachowuje tę odpowiedź na urządzeniu. Serwer nie przechowuje nic o tym sprawdzeniu, poza krótkotrwałym licznikiem żądań na adres IP, aby przeciwdziałać nadużyciom, oraz kilkoma dniami dzienników technicznych. Inne wersje gry nie wykonują tego sprawdzenia.</p>
</section>

<section lang="tr">
<h2>Google Play lisans kontrolü (Android, yalnızca Google Play sürümü)</h2>
<p>Oyunu açtığınızda, Google Play&#x27;den alınan tek kullanımlık bir belirteç ve rastgele bir sayı, geliştiricinin sunucusuna (hata raporlarını alan sunucuya) gönderilir. Bu sunucu Google&#x27;a Google hesabınızın oyuna sahip olup olmadığını sorar ve yalnızca evet ya da hayır yanıtını alır. Oyun bu yanıtı cihazınızda saklar. Sunucu, kontrol hakkında kötüye kullanımı önlemek için IP adresi başına kısa süreli tutulan istek sayısı ve birkaç günlük teknik kayıtlar dışında hiçbir şey saklamaz. Oyunun diğer sürümleri bu kontrolü yapmaz.</p>
</section>

<section lang="ja">
<h2>Google Play ライセンス確認（Android、Google Play 版のみ）</h2>
<p>ゲームを起動すると、Google Play から発行された一度限りのトークンとランダムな数値が、開発者のサーバー（バグ報告も受け付けているサーバー）に送信されます。サーバーは、お使いの Google アカウントがこのゲームを所有しているかを Google に問い合わせ、「はい」か「いいえ」の回答のみを受け取ります。ゲームはその回答をお使いの端末に保存します。サーバーには、この確認に関するものとして、不正利用を防ぐための IP アドレスごとのリクエスト数の短期間の集計と、数日分の技術ログを除き、何も保存されません。ゲームの他のバージョンでは、この確認は行われません。</p>
</section>

<section lang="ko">
<h2>Google Play 라이선스 확인 (Android, Google Play 버전에만 해당)</h2>
<p>게임을 실행하면 Google Play에서 발급한 일회용 토큰과 임의의 숫자가 개발자의 서버(버그 신고를 받는 서버와 동일)로 전송됩니다. 이 서버는 이용자의 Google 계정이 게임을 소유하고 있는지 Google에 문의하며, 응답은 예 또는 아니요 중 하나만 받습니다. 게임은 이 응답을 이용자의 기기에 저장합니다. 서버는 부정 사용을 막기 위한 IP 주소별 요청 횟수의 짧은 기간 집계와 며칠간의 기술 로그를 제외하고는 이 확인과 관련하여 아무것도 보관하지 않습니다. 게임의 다른 버전은 이 확인을 하지 않습니다.</p>
</section>

<section lang="zh-CN">
<h2>Google Play 许可证验证（Android，仅限 Google Play 版本）</h2>
<p>打开游戏时，Google Play 提供的一次性令牌和一个随机数会发送到开发者的服务器（即接收错误报告的同一服务器）。该服务器会向 Google 询问您的 Google 账户是否拥有此游戏，只接收“是”或“否”的答复。游戏会将该答复保存在您的设备上。除了为防止滥用而短期保存的每个 IP 地址的请求计数，以及几天的技术日志外，服务器不会保存与此验证有关的任何内容。游戏的其他版本不进行此验证。</p>
</section>

<section lang="zh-TW">
<h2>Google Play 授權檢查（Android，僅限 Google Play 版本）</h2>
<p>開啟遊戲時，Google Play 提供的一次性權杖和一組隨機數字會傳送到開發者的伺服器（即接收錯誤回報的同一台伺服器）。該伺服器會向 Google 查詢您的 Google 帳戶是否擁有此遊戲，並且只接收「是」或「否」的回覆。遊戲會將該回覆儲存在您的裝置上。除了為防止濫用而短期保存的每個 IP 位址請求次數，以及幾天的技術紀錄外，伺服器不會保存與此檢查有關的任何內容。遊戲的其他版本不進行此檢查。</p>
</section>
