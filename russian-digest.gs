function sentRssToMailHTML(){
  
  // we want to get a digest every Monday, Wednesday and Friday
  // for the google sheet used, see the read.me section
  
  var date = new Date();
  
  if (date.getDay() == 1)  
  {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Russia");
    var dan = " в России,";
  }
  else if (date.getDay() == 3)  
    
  {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Europe");
    var dan = " в Европейской России,";
  }
  
  else if (date.getDay() == 5) 
  {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Siberia");
    var dan = " в Сибири и на Дальнем Востоке,"; 
  }
  else return;
 

  var recipient = "INSERT YOUR BLOGGER EMAIL"; 
  var mojmejl = "INSERT YOUR EMAIL";
  
  var today = new Date();
  date.setDate(date.getDate() - 1);
  
  // to get nice date formatting in the subject line
  var russianMonths = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var month = date.getMonth();
  var month1 = russianMonths[month];
  
  var subjectDate = today.getDate() + ' ' + month1 + ' ' + date.getFullYear();
  var subject = "Чё там" + dan + " " + subjectDate + " " + "г." + "?";
 
  
  var yesterday = Utilities.formatDate(date, 'Asia/Tokyo', 'YYYY-MM-dd');  
  
  var lastRow = sh.getLastRow();  

// to get nice body formatting
  
  var body = "<div style='width:100%;max-width:650px'>";
  body += "<table>";

// var napake = "<table>"; use this if you want to get the list of parsing errors to your email 

// create a loop for parsing through the google sheet file
  
  for(var i=1;i<=lastRow;i++){  
    try {    
       var label1 = sh.getRange(i, 1).getValue();
       var feedURL = sh.getRange(i, 2).getValue();
       var res = UrlFetchApp.fetch(feedURL);
       var xml = XmlService.parse(res.getContentText());
       var items = xml.getRootElement().getChildren('channel')[0].getChildren('item');      
      }     
    
    
    catch (err) { 
      
      napake += "<tr><td>" + label1 + "</td><td>" + err.message + "</td></tr>";
       
    continue;
          }  

    
 // create another loop to parse through feeds updated in the last day   
    
    for(var j=0; j<items.length; j++){

      var pubDate = items[j].getChild('pubDate').getText();
      pubDate = Utilities.formatDate(new Date(pubDate), 'Asia/Tokyo', 'YYYY-MM-dd');
     
      
      if(yesterday == pubDate){
        var title = items[j].getChild('title').getText();
        //var des = items[j].getChild('description').getText(); only if you want to add a short description
        var url = items[j].getChild('link').getText();
        
        if(title !== "") {
          body += "<table><div>";
          body += '<tr><td></td><td><h3 style="font-weight:normal;margin:0px;">' + label1 + '</h3></td><td></td><tr>';
          body += '<tr>';
          body += '<td style="padding-left:18px"></td>';
          body += '<td style="padding:18px 0px 12px 0px;vertical-align:top;border-top: ridge 1px">';
          body += '<h3 style="margin:0px; font-weight:normal"><a style="style="color:#427fed;display:inline;text-decoration:none;font-size:16px;line-height:20px;" href="' + url + '">' + title + '</a></h3>';
          //body += des + j + '\n'; only if you want to add a short description
          body += '</td>';
          body += '<td style="padding-right:18px"></td>';
          body += '</tr>';
          
          break;
          
       }
     }
   }
    body += "</table>";
  
 }
  

  napake += "</table>";
  
   
  // MailApp.sendEmail(recipient, subject, body, {htmlBody:body});  use this if you want to send the digest directly to your email 
   GmailApp.createDraft(recipient, subject, body, {htmlBody:body});
   /** we create a draft to keep the formatting, because if we publish it directly to the bloggers email the html falls into pieces,
  shout out if you have a better idea how to solve this **/
  /**GmailApp.createDraft(mojmejl, subject, napake, {htmlBody:napake});
  if you want to get a list of errors to your emails**/
  
   var draft = GmailApp.getDrafts()[0]; // The first draft message in the drafts folder 
  
   var msg = draft.send(); // Send it
   Logger.log(msg.getDate());

  
}

