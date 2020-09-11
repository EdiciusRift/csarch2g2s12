$(document).ready(function(){
    $('#siginp').keyup(function(){
        var username = $(this).val();
        if(username == "" || username == null){
            $('#warning').prop('hidden', false);
            $('#warning-msg').text("Must not be left blank");
            $('#siginp').css('background-color', 'red');
            $('#convert').prop('disabled', true)
        }
        else{
            $('#siginp').css('background-color', 'white');
            if($('#expin').css('background-color') == 'rgb(255, 0, 0)'){
                $('#convert').prop('disabled', true)
            }
            else if($('#expin').val() == null || $('#expin').val() == "" && $('#expin').css('background-color') == 'rgb(255, 255, 255)'){
                $('#convert').prop('disabled', true)
                $('#warning').prop('hidden', true);
            }
            else{
                $('#warning').prop('hidden', true);
                $('#convert').prop('disabled', false)
            }
        }
    })
    $('#expin').keyup(function(){
        var username = $(this).val();
        if(username == "" || username == null||username.includes(".")){
            $('#warning').prop('hidden', false);
            $('#warning-msg').text("Invalid input");
            $('#expin').css('background-color', 'red');
            $('#convert').prop('disabled', true)
        }
        else{
            $('#expin').css('background-color', 'white');
            if($('#siginp').css('background-color') == 'rgb(255, 0, 0)'){
                $('#convert').prop('disabled', true)
            }
            else if($('#siginp').val() == null || $('#siginp').val() == "" && $('#siginp').css('background-color') == 'rgb(255, 255, 255)'){
                $('#convert').prop('disabled', true)
                $('#warning').prop('hidden', true);
            }
            else{
                $('#warning').prop('hidden', true);
                $('#convert').prop('disabled', false)
            }
        }
    })
    $('#reset').click(function(){
        $('#siginp').val("");
        $('#expin').val(0);
        $('#signout').val("");
        $('#expout').val("");
        $('#manout').val("");
        $('#hexout').val("");
        $('#convert').prop('disabled', true);
        $('#warning').prop('hidden', true);
        $('#expin').css('background-color', 'white');
        $('#siginp').css('background-color', 'white');
    })
    $('#convert').click(function(){
        BigNumber.config({ DECIMAL_PLACES: 30,
            EXPONENTIAL_AT: 30 })
        var input = $('#siginp').val();
        if(input.toUpperCase() == "NAN"){
            signbit = 0
            e = 255;
            z = 1
            z = z.toString()
            expbit = ('0' + (e>>> 0).toString(2)).slice(-8)
            newz = z.concat('1111111111111111111111')
            output = signbit.toString()
            output = output.concat(expbit, newz)
            hexoutput = parseInt(output, 2).toString(16).toUpperCase();
            $('#signout').val(signbit);
            $('#expout').val(expbit);
            $('#manout').val(newz);
            $('#hexout').val(hexoutput);
            return
        }
        if(input.toUpperCase() == "INFINITY" || input.toUpperCase() == "INF"){
            signbit = 0
            e = 255;
            z = 0
            z = z.toString()
            expbit = ('0' + (e>>> 0).toString(2)).slice(-8)
            newz = z.concat('0000000000000000000000')
            output = signbit.toString()
            output = output.concat(expbit, newz)
            hexoutput = parseInt(output, 2).toString(16).toUpperCase();
            $('#signout').val(signbit);
            $('#expout').val(expbit);
            $('#manout').val(newz);
            $('#hexout').val(hexoutput);
            return
        }
        if(input.toUpperCase() == "-INFINITY" || input.toUpperCase() == "-INF"){
            signbit = 1
            e = 255;
            z = 0
            z = z.toString()
            expbit = ('0' + (e>>> 0).toString(2)).slice(-8)
            newz = z.concat('0000000000000000000000')
            output = signbit.toString()
            output = output.concat(expbit, newz)
            hexoutput = parseInt(output, 2).toString(16).toUpperCase();
            $('#signout').val(signbit);
            $('#expout').val(expbit);
            $('#manout').val(newz);
            $('#hexout').val(hexoutput);
            return
        }
        var accinput = new BigNumber(0.0).plus(input)
        inputnum = Number(input)
        subject =  /[^0-1.+-]/;
        if(input.match(subject))
        {
            $('#warning').prop('hidden', false);
            $('#warning-msg').text("Only binary inputs and special case words are allowed");
            return
        }
        else if(Number.isNaN(inputnum))
        {
            $('#warning').prop('hidden', false);
            $('#warning-msg').text("Invalid Input");
            return
        }
        else{
            if(inputnum > 0)
            {
                signbit = 0
            }
            else{
                signbit = 1
            }
        }
        exp = Number($('#expin').val());
        if(exp < -126){
            e = exp + 126
            xx = new BigNumber(10);
            div = xx.exponentiatedBy(-e)
            y = accinput.dividedBy(div)
            ytext = y.toString()
            newplace1 = ytext.lastIndexOf('1')
            newdecpt = ytext.indexOf('.')
            newexp = newplace1 - newdecpt
            add = xx.exponentiatedBy(newexp)
            yadd = y.multipliedBy(add)
            if(ytext.includes('-')){
                z = ('00000000000000000000000' + yadd.minus(add)).slice(-newexp)
            }
            else{
                z = ('00000000000000000000000' + yadd).slice(-newexp)
            }
            expbit = ('00000000' + (0>>> 0).toString(2)).slice(-8)
            newz = z.concat('00000000000000000000000').slice(0,23)
            output = signbit.toString()
            output = output.concat(expbit, newz)
            hexoutput = binaryToHex(output)
            inputout = input.concat("x2^",exp.toString())
            $('#signout').val(signbit);
            $('#expout').val(expbit);
            $('#manout').val(newz);
            $('#hexout').val(hexoutput);
            return;
        }
        inputtext = input
        decpt = inputtext.indexOf(".")
        place1 = inputtext.indexOf("1")
        if(place1 === -1){
            if(input.includes('-'))
            {
                signbit = 1
            }
            else
                signbit = 0
            e = 0
            expbit = ('0' + (e>>> 0).toString(2)+"0000000").slice(-8)
            z = 0;
            z = z.toString()
            newz = z.concat('00000000000000000000000').slice(0,23)
            output = signbit.toString()
            output = output.concat(expbit, newz)
            hexoutput = (parseInt(output, 2).toString(16).toUpperCase() + "00000000").slice(0,8)
            $('#signout').val(signbit);
            $('#expout').val(expbit);
            $('#manout').val(newz);
            $('#hexout').val(hexoutput);
            return;
        }
        if(decpt>place1)
        {
            place1++
        }
        expoff = decpt - place1
        expadd = exp + expoff
        if(expadd < -126){
            e = expadd + 126
            y = accinput
            ytext = y.toString()
            newplace1 = ytext.lastIndexOf('1')
            newdecpt = ytext.indexOf('.')
            newexp = newplace1 - newdecpt
            xx = new BigNumber(10);
            add = xx.exponentiatedBy(newexp)
            yadd = y.multipliedBy(add)
            if(ytext.includes('-')){
                z = ('00000000000000000000000' + yadd.minus(add)).slice(-newexp)
            }
            else{
                z = ('00000000000000000000000' + yadd).slice(-newexp)
            }
            expbit = ('00000000' + (0>>> 0).toString(2)).slice(-8)
            newz = z.concat('00000000000000000000000').slice(0,23)
            output = signbit.toString()
            output = output.concat(expbit, newz)
            hexoutput = binaryToHex(output)
            inputout = input.concat("x2^",exp.toString())
            $('#signout').val(signbit);
            $('#expout').val(expbit);
            $('#manout').val(newz);
            $('#hexout').val(hexoutput);
            return;
        }
        xx = new BigNumber(10);
        div = xx.exponentiatedBy(expoff)
        y = accinput.dividedBy(div)
        ytext = y.toString()
        newplace1 = ytext.lastIndexOf('1')
        newdecpt = ytext.indexOf('.')
        newexp = newplace1 - newdecpt
        add = xx.exponentiatedBy(newexp)
        yadd = y.multipliedBy(add)
        z = ('00000000000000000000000' + yadd.minus(add)).slice(-newexp)
        e = expadd + 127
        if(e>255){
            e = 255;
            z = 0;
            z = z.toString()
            newz = z.concat('00000000000000000000000').slice(0,23)
            expbit = ('00000000' + (e>>> 0).toString(2)).slice(-8)
            output = signbit.toString()
            output = output.concat(expbit, newz)
            hexoutput = binaryToHex(output)
            $('#signout').val(signbit);
            $('#expout').val(expbit);
            $('#manout').val(newz);
            $('#hexout').val(hexoutput);
            return
        }
        expbit = ('00000000' + (e>>> 0).toString(2)).slice(-8)
        newz = z.concat('00000000000000000000000').slice(0,23)
        output = signbit.toString()
        output = output.concat(expbit, newz)
        hexoutput = binaryToHex(output)
        $('#signout').val(signbit);
        $('#expout').val(expbit);
        $('#manout').val(newz);
        $('#hexout').val(hexoutput);
        return;
    })
})
function binaryToHex(s) {
    var i, k, part, accum, ret = '';
    for (i = s.length-1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i+1-4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== '0' && part[k] !== '1') {
                // invalid character
                return { valid: false };
            }
            // compute the length 4 substring
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            // 'A' to 'F'
            ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
            // '0' to '9'
            ret = String(accum) + ret;
        }
    }
    // remaining characters, i = 0, 1, or 2
    if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== '0' && s[k] !== '1') {
                return { valid: false };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = String(accum) + ret;
    }
    return ret ;
}