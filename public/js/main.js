
var BitMaker = function() {
    return ({
        renderLaunch: function() {
            return React.createClass({
                getInitialState: function() {
                    return ({
                        expand: false
                    });
                },
                expandLaunch: function(e) {
                    var thisNode = e.target;
                   if(this.state.expand == false) {
                       this.setState({expand: true});
                       $(this.refs.bittext).css('display','block');
                   } else {
                       this.setState({expand: false});
                       $(this.refs.bittext).css('display','none');
                   }
                },
                submitBit: function(){
                },
                render: function() {
                    var bittitlebar = React.createElement('div', {className: 'bittitlebar', onClick: this.expandLaunch}, 'Bit Launcher');
                    var bittextarea = React.createElement('textarea', {className: 'bittextarea', maxLength: 200});
                    var bitpasscode = React.createElement('input', {className: 'bitpasscode', type: 'password'});
                    var chardiv = React.createElement('div', {className: 'charMax'});
                    var bitsubmit = React.createElement('div', {className: 'bitsubmit', onClick: this.submitBit}, 'Add Bit');
                    var bittext = React.createElement(
                        'div',
                        {className: 'bittext', ref: 'bittext'},
                        bittextarea,
                        chardiv,
                        bitpasscode,
                        bitsubmit
                    );

                    return React.createElement(
                            'div',
                            {className: 'bitbox-wrapper'},
                            bittitlebar,
                            bittext
                    );
                }
            });
        },
        launch: function() {
            ReactDOM.render( React.createElement(this.renderLaunch()), document.getElementById('bitbox'))
        }
    })
};

$(document).ready(function(){
    var bitbox = $('<div />').attr("id", "bitbox");
    var socket = io();
    var bit = BitMaker();

    $('body').append(bitbox);
    bit.launch();


    var text_max = 200;
    $('.charMax').html(text_max + ' characters remaining');

    $('#bitbox .bittext textarea').keyup(function() {
        var text_length = $(this).val().length;
        var text_remaining = text_max - text_length;

        $('.charMax').html(text_remaining + ' characters remaining');
    });

    var errDiv = $('<div />'), text = $('#bitbox .bittext textarea'), passcode = $('.bitpasscode');
    errDiv.addClass('error');
    $('.bitsubmit').on("click", function(){
        var sendBits = {
            bittext: text.val(),
            passcode: passcode.val()
        };
        if(text.val().length === 0) {
            $(errDiv.html('Write something!')).insertBefore('.bitsubmit');
            return;
        }
        if(passcode.val().length === 0){
            $(errDiv.html('Are you Sam? What\'s the passcode?')).insertBefore('.bitsubmit');
            return;
        }
        socket.emit('send bits', sendBits);
    });

    socket.on('receive bits', function(data){
        console.log("receiving bits: " + data.text);
        if(data.status == true) {
            $('<li>'+data.text+'</li>').prependTo('.minibits').hide().slideDown('slow');
            errDiv.html('');
            text.val('');
            passcode.val('');
        } else {
            $(errDiv.html('Wrong passcode!')).insertBefore('.bitsubmit');
        }
    });

});