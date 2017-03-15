/**
 * Created by Rhys Jones on 15/03/2017.
 */

function ValidURL(str) {{
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
    }
}

$('.btn-shorten').on('click', function(){
    $('#textOutput').val('');
    var lines = $('#textInput').val().split('\n');
    for(var i = 0;i < lines.length;i++){
        //code here using lines[i] which will give you each line
        if(ValidURL(lines[i])){
            $.ajax({
                url: '/api/expand',
                type: 'POST',
                dataType: 'JSON',
                data: {url: lines[i]},
                success: function (data) {
                    var currentdata = $('#textOutput').val();
                    $('#textOutput').val(currentdata + data.longUrl + '\n');
                }
            });
        }
    }
});