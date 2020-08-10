// LINEのアクセストークン
const LINE_TOKEN = 'Vql32cE8Z2rqyVv3p23ZSmtdhdGuMbhvqlBY5YSGSG05AsofBlB3g79FX3Vc7ej03o74yzeS6tPh39ETJV4Q8isp2gOQL/2I17hG9Yr89Yv4BE7desR4o+ey94dyZsX016JLDrq8AdJQ+ZXTqK2+XAdB04t89/1O/w1cDnyilFU=';
const LINE_URL = 'https://api.line.me/v2/bot/message/reply';

function doPost(e) {
  // 投稿されたメッセージを取得
  let userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  //応答用Tokenを取得
  const replyToken = JSON.parse(e.postData.contents).events[0].replyToken; 
  
  if(userMessage.match(/^\$/)) {
    // $から始まるメッセージの場合、$を除いた文字列を再代入
    userMessage = userMessage.substr(1);
  } else {
    // $から始まらない場合は何もしない（処理終了）
    return;
  }
  

  const messages = [
    {
      'type': 'text',
      'text':  "データを入力します。",
    }
  ]
  

  // スプレッドシートへ保存=======================================
  
  const response = e.postData.getDataAsString();
  const spreadsheetId = "1zcYk7E5NwrEJ_7zK0lwDv1kEkjPag1ztTj0g4jrxi-_zHxZ-xmoNpgvV";
  const sheetName = "log";
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
 
  // 空白・タブ・改行で区切り配列に変換  
  let all_msg = userMessage.split(/\s/);
  
  
  // ***************************
  // スプレットシートからデータを抽出
  // ***************************
  // 3. 最終列の列番号を取得
  const numColumn = sheet.getLastColumn();
  // 4. 最終行の行番号を取得
  const numRow    = sheet.getLastRow()-1;
  // 5. 範囲を指定（上、左、右、下）
  const topRange  = sheet.getRange(1, 1, 1, numColumn);      // 一番上のオレンジ色の部分の範囲を指定
  const dataRange = sheet.getRange(2, 1, numRow, numColumn); // データの部分の範囲を指定
  // 6. 値を取得
  const topData   = topRange.getValues();  // 一番上のオレンジ色の部分の範囲の値を取得
  const data      = dataRange.getValues(); // データの部分の範囲の値を取得
  const dataNum   = data.length +2;        // 新しくデータを入れたいセルの列の番号を取得
  
 
  // 配列の先頭に日時を代入

 
 
  // セルの最下部に配列を転記
  sheet.appendRow(all_msg);
  // =======================================
  
   const after_msg = {
    'type': 'text',
    'text': "データを入力しました。",
  }
  messages.push(after_msg);
  
   //lineで返答する
  UrlFetchApp.fetch(LINE_URL, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${LINE_TOKEN}`,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages,
    }),
  });

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  //終了
 
}
