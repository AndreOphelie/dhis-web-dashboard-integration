/**
 * Created by ophelie on 07/11/2016.
 */



var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Row = ReactBootstrap.Row;
var Tooltip = ReactBootstrap.Tooltip;
var Overlay = ReactBootstrap.Overlay;
var FormControl = ReactBootstrap.FormControl;
//var Image = ReactBootstrap.Image;

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}


class ShareButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, show: false, comment: 'Your comment', social:'fb'};
    }


    render() {

        const sharedProps = {
            show: this.state.show,
            container: this,

        };

        return (
            <div>

                <Button id="button_share" ref="target" onClick={this._toggle.bind(this)}>
                    <i className="fa fa-share-alt"/>
                </Button>
                <Overlay {...sharedProps} placement="bottom">
                    <Tooltip id="overload-bottom">

                        <a id="fbtooltip" className="fa fa-facebook fa-lg" onClick={this._open.bind(this, 'fb')}/>
                        <a className="fa fa-twitter fa-lg" onClick={this._open.bind(this, 'tw')}/>
                    </Tooltip>
                </Overlay>




                <Modal show={this.state.showModal} onHide={this._close.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Share your content</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                        </Row>

                        <div id="modalQuestion">Add your comment:</div>
                        <Row bsClass="text-center">
                            <form>
                                <textarea className="form-control" rows="3" value={this.state.comment} onChange={this._handle_comment_change.bind(this)}/>
                            </form>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this._close.bind(this)}>Cancel</Button>
                        <Button onClick={this._confirm_publish.bind(this)}>Publish</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
    _close(){
        this.setState({ showModal: false});
    }
    _open(social){  
        console.log("hi");
        console.log(social);
        this.setState({ showModal: true, social:social });
    }
    _toggle() {
        this.setState({ show: !this.state.show });
    }
    _handle_comment_change(event){
        this.setState({comment: event.target.value});
    }
    _confirm_publish(){
        console.log('STATE'+this.state.social);
        if(this.state.social == 'fb'){
            console.log('FBBB');
            this._uploadFacebook();
        }
    }
    _uploadFacebook(){

        var comment = this.state.comment;
        var close = this._close();
        var url = "https://play.dhis2.org/demo/api/"+ this.props.type +"/" + this.props.id +"/data?width=800";


        const contentType = 'image/png';

        var img = new Image();
        img.src = "http://192.168.247.1:8082/api/" + this.props.type + "/" + this.props.id + "/data";

        console.log(img);

        img.addEventListener('load', function () {
            var image = getBase64Image(img);
            console.log("couocuocuocuc");
            console.log(image);
            var blob = b64toBlob(image, contentType);
            //var blobUrl = URL.createObjectURL(blob);


       /* var fd = new FormData();

        fd.append("source", blob);
        fd.append("message",comment);*/




        FB.login(function () {
           // FB.getLoginStatus(function(response) {
                //if (response.status === 'connected') {
                   // var access_token = response.authResponse.accessToken;

            var access_token =   FB.getAuthResponse()['accessToken'];
            console.log('Access Token = ' + access_token);


            //fd.append("access_token",access_token);

            var fd = new FormData();
            fd.append("access_token", access_token);
            fd.append("source", blob);
            fd.append("message", comment);
            try {
                $.ajax({
                    url: "https://graph.facebook.com/me/photos?access_token=" + access_token,
                    type: "POST",
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (data) {
                        console.log("success " + data);
                    },
                    error: function (shr, status, data) {
                        console.log("error " + data + " Status " + shr.status);
                    },
                    complete: function () {
                        console.log("Posted to facebook");
                    }
                });
            }
            catch (e) {
                console.log(e);
            }

            /*
             FB.api(
             '/me/photos',
             'post',
             {
             data:fd,
             processData:false,
             contentType:false
             },
             function (response) {
             if (!response) {
             //TODO NOT SUCESS
             alert('Error occurred.');
             } else if (response.error) {
             //TODO NOT SUCESS
             console.log(response.error.message)

             } else {
             //TODO Success
             close
             }
             }
             );
             }, {scope: 'publish_actions,user_photos'});*/
                } ,  {scope: 'publish_actions,user_photos'});
            } );

        //Call function to close the modal

    }

}

ShareButton.propTypes = {
    comment: React.PropTypes.string
};

//module.exports = ShareButton;

/*
 _uploadTwitter(){
 $.ajax({
 type: "POST",
 url: "https://api.twitter.com/1.1/statuses/update.json",
 data: {
 status: "hello!!!!"
 },
 success: function () {
 console.log("SUCCESSSS");
 },
 error: function (e) {
 console.log(e);
 }
 })
 }
 */

/*
 <div id="ZBjCfSaLSqD">
 <Button bsStyle="primary" onClick={this._open.bind(this)} ><i className="fa fa-share-alt fa-3x"/></Button>

 </div>


 <Modal show={this.state.showModal} onHide={this._close.bind(this)}>
 <Modal.Header closeButton>
 <Modal.Title>Share your content</Modal.Title>
 </Modal.Header>
 <Modal.Body>
 <div id="modalQuestion">On which social media would you like to share?</div>
 <Row bsClass="text-center">
 <Button className="btnSocialShare" id="btnFacebook" type="button"><img className="imgShareBtn" id="imgFacebook" src="/app/src/facebook.png"/></Button>
 </Row>
 <Row bsClass="text-center">
 <Button className="btnSocialShare" id="btnTwitter" type="button"><img className="imgShareBtn" id="imgTwitter" src="/app/src/twitter.png"/></Button>
 </Row>


 </Modal.Body>
 <Modal.Footer>
 <Button onClick={this._close.bind(this)}>Close</Button>
 </Modal.Footer>
 </Modal>
 */
