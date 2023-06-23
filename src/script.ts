interface Payload {
  project: string;
  worker: string;
  startDate: string;
  endDate: string;
  tasks: string;
  pmo?: string;
  member?: string;
}

// 値を修正する
const configs = {
  slackMessageTrigger: "SlackToSpreadSheet",
  spreadSheetFileId: "",
  spreadSheetSheetName: "",
  calendarTitle: "",
  permanentGuests: [""] // カレンダー: 必須で招待するゲストのメールアドレス
};

// [${slack workflow param}, ${spread sheet column}]
const cellMap: [keyof Payload, string][] = [
  ["project", "1"],
  ["worker", "2"],
  ["startDate", "3"],
  ["endDate", "4"],
  ["tasks", "5"],
];

// メイン関数
function doPost(e: GoogleAppsScript.Events.DoPost) {
  const postMessage: string = detectPostMessageOrDebugString(e);
  const payload: Payload = convertPostMessageToPayload(postMessage);
  writeSpreadSheet(payload);
  registerSchedule(payload);
}

// Postイベントパラメータを文字列に変換
function detectPostMessageOrDebugString(event): string {
  if (event && event.postData) {
    return event.postData.getDataAsString();
  }
  
  // デバッグ用の文字列を返す
  return "token=xx" + 
    "&team_id=xx" + 
    "&team_domain=xx" +
    "&service_id=xx" + 
    "&channel_id=xx" + 
    "&channel_name=xx" + 
    "&timestamp=0.0" + 
    "&user_id=xx" + 
    "&user_name=xx" +
    "&text=" + encodeURI(`${configs.slackMessageTrigger}` + 
      ",,startDate::2099/01/01-01:00" + 
      ",,endDate::2099/01/01-02:00" + 
      ",,worker::<mailto:xx|xx>" +
      ",,pmo::<mailto:xx|xx>" +
      ",,member::<mailto:xx|xx>" +
      ",,tasks::xx" + 
      ",,project::xx") + 
    `&trigger_word=${configs.slackMessageTrigger}`
  ;
}

// payloadを生成
function convertPostMessageToPayload(postMessage: string): Payload{
  const textField = postMessage
    .split("&")
    .map(v => v.split("="))
    .find(v => v[0] === "text");
  
  const payload = decodeURIComponent(textField[1])
    .split(",,")
    .reduce((acc, item) => {
      const [key, value] = item.split("::");
      if (value) {
        if (["worker", "pmo", "member"].includes(key)) {
          acc[key] = value.replace(/.*:/, "").replace(/\|.*/, "");
        } else if (["startDate", "endDate"].includes(key)) {
          const date = new Date(value)
          acc[key] = formatDate(date);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Payload);

  return payload
}

// スプレッドシートの最終行にSlackからの申請内容を記入
function writeSpreadSheet(payload: Payload) {
  const sheet = SpreadsheetApp.openById(configs.spreadSheetFileId).getSheetByName(configs.spreadSheetSheetName);
  const lastRow = sheet.getLastRow();
  cellMap.map(([key, column]) => {
    sheet.getRange(lastRow+1, Number(column)).setValue(payload[key]);
  });
}

// 本番環境への作業時間をGoogleカレンダーに登録
function registerSchedule(payload: Payload) {
  const calendar = CalendarApp.getDefaultCalendar();
  const title = configs.calendarTitle
  const startTime = new Date(payload.startDate); 
  const endTime = new Date(payload.endDate);
  const guests = [payload.worker, payload.pmo, payload.member, ...configs.permanentGuests].filter(Boolean);
  const options = {
    description: "※会議予定ではございません。\nプロジェクト:" + payload.project + "\n作業内容:\n" + payload.tasks,
    sendInvites: false,
    guests: guests.join(",")
  };
  
  calendar.createEvent(title, startTime, endTime, options);
}

function formatDate(date: Date): string {
  return date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }).replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).*/, "$1/$2/$3 $4:$5");
}