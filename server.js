import { serve } from 
"https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from 
"https://deno.land/std@0.138.0/http/file_server.ts";

let previousWord = "しりとり";
console.log("Listening on http://localhost:8000");

serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    
    //ブラウザから送られてきた次の単語を受け取る部分を作成
    if(req.method === "GET" && pathname === "/shiritori") {
        const startWord = ['いちご','えい','ふえ','ばなな','いぬ','かめ','ねこ','あざらし','ひょう','すいか','いぎりす','ろぼっと'];
        previousWord = startWord[getRandomInt(0,startWord.length)];
        return new Response(previousWord);
    }
    if(req.method === "POST" && pathname === "/shiritori") {
        const requestJson = await req.json();   //ブラウザから送られてきたjson形の単語
        const nextWord = requestJson.nextWord;

       /*最後の文字と次の最初の文字があっているか
        HTTP のステータスコードを 400 にして、エラーメッセージを返すようにします。*/
        if (nextWord.length > 0 &&
            previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
        ) {
            return new Response("前の単語に続いていません。", { status: 400 });
        }

        //最後の文字が「ん」だったら終わるようにする
        if(nextWord.length > 0 && nextWord.charAt(nextWord.lengtWth - 1) === 'ん') {
            return new Response("ゲーム終了！", { status: 400});  
        }

        //ひらがなかどうか判定
        if(isHiragana(nextWord) === false){
            return new Response("ひらがな以外が入力されています", { status: 400 });
        }

        previousWord = nextWord;
        return new Response(previousWord);
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    function isHiragana(nextWord){
        return /^[\u3040-\u309f]+$/.test(nextWord);
    }
});

