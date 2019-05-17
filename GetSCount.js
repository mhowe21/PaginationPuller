var AJXResponse;
var counterSubmissions = 0;
var counterComments = 0;
var counterAttachments = 0;
var instance = "instance"
var course= "course";
var assignment= "assignment";
var token = "token";
var url = "https://" + instance + ".instructure.com/api/v1/courses/"+ course + "/assignments/" + assignment + "/submissions?per_page=100&include[]=submission_history&include[]=submission_comments&include[]=rubric_assessment";
var request;
run();

function run() {
    getData();
}



function getData(){
    ajaxFire1();
    function ajaxFire1() {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + token,
                
                "Accept": "*/*",
                
            }
        }
        
    
        request = $.ajax(settings).done(function (response) {
            console.log(response);
            AJXResponse = response;
            for (let i = 0; i < response.length; i++) {
                counterSubmissions = counterSubmissions + response[i].submission_history.length;
                counterComments = counterComments + response[i].submission_comments.length;
                 
                
                
                
            }
            
            linkHeaders = request.getResponseHeader("Link");
            parsedRequest = parseLinkHeader(linkHeaders);
            if  (typeof parsedRequest.next == 'undefined' || parsedRequest.next.href == "null"){
                console.log("submisison count" + counterSubmissions);
                console.log("comment count " + counterComments);
                console.log("datapoint count " + (counterSubmissions + counterComments));
            } else {paginatePageViews(parsedRequest.next.href)}
            
        });
    }
        function paginatePageViews(nextLink){
            console.log(nextLink);
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": nextLink,
                "method": "GET",
                "headers": {
                  "Authorization": "Bearer " + token,
                  
                 
                }
              }
              
              request= $.ajax(settings).done(function (response) {
                for (let i = 0; i < response.length; i++) {
                    counterSubmissions = counterSubmissions + response[i].submission_history.length;   
                    counterComments = counterComments + response[i].submission_comments.length; 
                    counterAttachments = counterAttachments + response[i].attachments.length;          
                    
                }
                linkHeaders = request.getResponseHeader("Link");
                parsedRequest = parseLinkHeader(linkHeaders);
                if  (typeof parsedRequest.next == 'undefined' || parsedRequest.next.href == "null"){
                	console.log("submisison count " + counterSubmissions);
                    console.log("comment count " + counterComments);
                    console.log("data point count " + (counterSubmissions + counterComments));
                } else {paginatePageViews(parsedRequest.next.href)}
                
              });
        }
    
    
    
    }



function unquote(value) {
    if (value.charAt(0) == '"' && value.charAt(value.length - 1) == '"') return value.substring(1, value.length - 1);
    return value;
}

function parseLinkHeader(header) {
    var linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
    var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

    var matches = header.match(linkexp);
    var rels = new Object();
    for (i = 0; i < matches.length; i++) {
        var split = matches[i].split('>');
        var href = split[0].substring(1);
        var ps = split[1];
        var link = new Object();
        link.href = href;
        var s = ps.match(paramexp);
        for (j = 0; j < s.length; j++) {
            var p = s[j];
            var paramsplit = p.split('=');
            var name = paramsplit[0];
            link[name] = unquote(paramsplit[1]);
        }

        if (link.rel != undefined) {
            rels[link.rel] = link;
        }
    }

    return rels;
}


