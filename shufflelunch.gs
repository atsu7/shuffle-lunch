//SlackAPIトークンは環境変数内
const SLACK_TOKEN = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
//現在のスプレッドシート内のシートをシート名で取得
const membersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('members');
const answersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('answers');

function main() {
  var range = answersSheet.getDataRange();
  range.randomize();
  range = answersSheet.getDataRange();
  numParticipants = range.getNumRows()//参加者数
  console.log(numParticipants);
  
  //１人、偶数、奇数で場合分け
  if(numParticipants == 1){
    var member1Cell = "B1";
    var member1Id = getSlackId(member1Cell);
    postSlackMessageAlone(member1Id);
  }
  else if(numParticipants %2 ==0){
   for(var i = 0; i<numParticipants/2; i++){
    var member1Cell = "B"+String(i*2+1);
    var member2Cell = "B"+String(i*2+2);
    var member1Id = getSlackId(member1Cell);
    var member2Id = getSlackId(member2Cell);
    
    var mpimId = openSlack2Dm(member1Id,member2Id)
    postSlackMessage(mpimId);
  }
  }else{
    for(var i = 0; i<(numParticipants-3)/2; i++){
    var member1Cell = "B"+String(i*2+1);
    var member2Cell = "B"+String(i*2+2);
    var member1Id = getSlackId(member1Cell);
    var member2Id = getSlackId(member2Cell);
    
    var mpimId = openSlack2Dm(member1Id,member2Id)
    postSlackMessage(mpimId);
    }
    var member1Cell = "B"+String(numParticipants-2);
    var member2Cell = "B"+String(numParticipants-1);
    var member3Cell = "B"+String(numParticipants);
    var member1Id = getSlackId(member1Cell);
    var member2Id = getSlackId(member2Cell);
    var member3Id = getSlackId(member3Cell);
    var mpimId = openSlack3Dm(member1Id,member2Id,member3Id)
    postSlackMessage(mpimId);
  }
  clearAnswers();
}

//membersシートを参照して、FullNameからIDを取得
function getSlackId(key) {
  var vals = membersSheet.getRange("A1:B238").getValues();
  var keyVal = answersSheet.getRange(key).getValue();
  for(var i = 0; i < vals.length ; i++ ) {
    if(keyVal == vals[i][0]) {
      return vals[i][1];
    }
  }
}

function openSlack2Dm(member1Id,member2Id){
  const URL = "https://slack.com/api/conversations.open";
  const urlToFetch= URL+"?token="+SLACK_TOKEN+"&users="+member1Id+"%2C"+member2Id;
  var logs = UrlFetchApp.fetch(urlToFetch);
  var logsJson = JSON.parse(logs.getContentText());
  var mpimId = logsJson["channel"]["id"];
  return mpimId;
}

function openSlack3Dm(member1Id,member2Id,member3Id){
  const URL = "https://slack.com/api/conversations.open";
  const urlToFetch= URL+"?token="+SLACK_TOKEN+"&users="+member1Id+"%2C"+member2Id+"%2C"+member3Id;
  var logs = UrlFetchApp.fetch(urlToFetch);
  var logsJson = JSON.parse(logs.getContentText());
  var mpimchannel = logsJson["channel"];
  var mpimId = mpimchannel["id"];
  return mpimId;
}

function postSlackMessage(channelId){
  const URL = "https://slack.com/api/chat.postMessage"
  const textToPost = "こんにちは！ Bizjapan Shuffle Lunch Start!:wave: Please start Slack call or Zoom in this channel now and have good lunch!:bento: If you are not prepared yet, let your partner know in this chat.:smile:"
  const urlToFetch = URL+"?token="+SLACK_TOKEN+"&channel="+channelId+"&text="+textToPost;
  UrlFetchApp.fetch(urlToFetch);
}

function postSlackMessageAlone(channelId){
  const URL = "https://slack.com/api/chat.postMessage"
  const textToPost = "Sorry. You are the only person who participated shuffle lunch today..Try again tomorrow! いいことあるさ！"
  const urlToFetch = URL+"?token="+SLACK_TOKEN+"&channel="+channelId+"&text="+textToPost;
  UrlFetchApp.fetch(urlToFetch);
}

function clearAnswers(){
  var range = answersSheet.getDataRange();
  range.clear();
}

//12:00にトリガーをセットする関数。この関数をGASのトリガーで12時前に実行。
function setTrigger(){
  const timeMain = new Date();
  timeMain.setHours(12);
  timeMain.setMinutes(00);
  const timeClear = new Date();
  ScriptApp.newTrigger('main').timeBased().at(timeMain).create();
}