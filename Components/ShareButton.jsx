/**
 * Created by ophelie on 07/11/2016.
 */

//import react boostrap components
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Row = ReactBootstrap.Row;
var Tooltip = ReactBootstrap.Tooltip;
var Overlay = ReactBootstrap.Overlay;
var FormControl = ReactBootstrap.FormControl;
var Images = ReactBootstrap.Image;

/**
 * Component React represent our Share Button with his modal
 */
class ShareButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { source:"",showModal: false, show: false, comment:"",disabled:"disabled",nodisplay:"", social:'fb',maxlength:0,text:""};
    }


    render() {

        const sharedProps = {
            show: this.state.show,
            container: this,

        };

        return (
            <div>

                <a id="button_share" ref="target" onClick={this._toggle.bind(this)}>
                    <i className="fa fa-share-alt"/>
                </a>
                <Overlay {...sharedProps} placement="bottom">
                    <Tooltip id="overload-bottom">

                        <a id="fbtooltip" className="fa fa-facebook fa-lg" onClick={this._open.bind(this, 'fb')}/>
                        <a className="fa fa-twitter fa-lg" onClick={this._open.bind(this, 'tw')}/>
                    </Tooltip>
                </Overlay>


                <Modal id="modal" show={this.state.showModal} onHide={this._close.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Share your content</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="center">

                            <Images onLoad={this._hideLoading.bind(this)} id="sharedImgModal" src={this.state.source} rounded />
                            <div id="loading">
                                <img id="loader" className={this.state.nodisplay} src="images/loading1.gif" />
                            </div>
                        </Row>

                        <div id="modalQuestion">{this.state.text}</div>
                        <Row bsClass="text-center">
                            <form>
                                <textarea className="form-control" placeholder="Enter your comment here... " rows="3"  maxLength={this.state.maxlength} value={this.state.comment} onChange={this._handle_comment_change.bind(this)}/>
                            </form>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this._close.bind(this)}>Cancel</Button>
                        <Button id="publish" onClick={this._confirm_publish.bind(this)} disabled={this.state.disabled}>Publish</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }


    /**
     * Method call to close the modal
     */
    _close(){
        //Set the state of the show modal to false
        this.setState({ showModal: false});
    }


    /**
     *Method call to open the modal
     * @param : social : reprensent the social media selected by the user ( twitter or facebook)
     */
    _open(social){
        var self = this;
        //If it's a reportTables that the user want to share
        if(this.props.type==='reportTables'){

            //Get the HTML represent the pivot table
            var d  = document.getElementById("plugin-" + this.props.id);

            //Use the library dom to image to convert our HTML table to an image
            domtoimage.toPng(d)
                .then(function (dataUrl) {
                    //When the conversion is done set the source of the image modal to the image in Base64 returned by the function of the library
                    self.setState({source:dataUrl});
                })
                .catch(function (error) {
                    //Error on the conversion of the HMML table
                    console.error('HTML table was not converted , error :', error);
                });

            this.setState({showModal: true, social:social,show:false });

            //If the user wants to share a map or a chart
        }else{

            //Find the image by calling the API of DHIS with the id of the image where the user click.
            var source = "http://localhost:8082/api/" + this.props.type + "/" + this.props.id + "/data";
            //Set this new source to the image and set the showmodal to true and close the tooltip
            this.setState({source:source, showModal: true, social:social,show:false });
        }
        //Set the preference for the textArea if the user choose facebook or twitter
        if(social == 'fb'){
            //For facebook comment's limitation to 1000 characters
            this.setState({ maxlength:1000 , text:"Enter Your comment" });
        }
        if(social == 'tw'){
            //For twitter comment's limitation to 140 characters
            this.setState({ maxlength:140 , text:"Enter Your comment (Max 140 characters)" });
        }

    }
    _toggle() {
        this.setState({ show: !this.state.show });
    }
    /**
     *Method call when the comment is modified by the user
     * @param : event : the component which declenched the event
     */
    _handle_comment_change(event){
        //Set the state comment of our comment with the current content of the text area
        this.setState({comment: event.target.value});
    }
    /**
     *Method call when the image is loading to hide the loading image and active the publish button
     */
    _hideLoading(){
        //Set the state of our loading animation
        this.setState({nodisplay:"nodisplay"});
        //Enable the click on the publish button
        this.setState({disabled:""});
    }
    /**
     *Method call when the user click on the publish button
     * Catch the right action between upload on twitter or on facebook
     */
    _confirm_publish(){

        //Choose the right method to call
        if(this.state.social == 'fb'){
            console.log('Facebook Request');
            //Call upload facebook
            this._uploadFacebook();
        }
        if(this.state.social == 'tw'){
            console.log('Twitter Request');
            //Call upload twitter
            this._uploadTwitter();
        }
    }
    /**
     *Method call when the user click on the publish button and had selected twitter
     * Convert the image to base 64 and blob
     * Oauth with twitter and post the image with his comment
     */
    _uploadTwitter(){

        //Store the value of our component
        var comment = this.state.comment;
        var type = this.props.type;
        var self = this;


        //If the user want to share a report table the image is already a Base64
        if (this.props.type == "reportTables")
        {

            var image= this.state.source;
            image = image.replace(/^data:image\/(png|jpg);base64,/, "");

            //Else we have to convert the image get by the API in base 64
        }else {

            var image = self._getBase64Image(document.getElementById("sharedImgModal"));
        }



            // Initialize with your OAuth and twitter
            OAuth.initialize('SB6S4-dwB3azNlMTtoqSvhvLNv8');


            //Publish on twitter
            OAuth.popup("twitter").then(function(result) {

                var data = new FormData();
                data.append('status', comment);
                data.append('media[]', self._b64toBlob(image), 'logo.png');

                return result.post('/1.1/statuses/update_with_media.json', {
                    data: data,
                    cache:false,
                    processData: false,
                    contentType: false
                });
            }).done(function(data){
                //var str = JSON.stringify(data, null, 2);
                //console.log("Success\n" + str);
                //Close the modal
                self._close();
            }).fail(function(e){
                var errorTxt = JSON.stringify(e, null, 2)
                //$('#result').html("Error\n" + errorTxt).show()
                console.log("Error\n" + errorTxt);
            });



    }
    /**
     *Method call when the user click on the publish button and had selected facebook
     * Convert the image to base 64 and blob
     * Oauth with facebook and post the image with his comment
     */
            _uploadFacebook(){


        var self = this;
        var comment =  this.state.comment;
        const contentType = 'image/png';

        //If the user want to share a report table the image is already a Base64
        if (this.props.type == "reportTables")
        {

            var image= this.state.source;
            image = image.replace(/^data:image\/(png|jpg);base64,/, "");

            //Else we have to convert the image get by the API in base 64
        }else {

            var image = self._getBase64Image(document.getElementById("sharedImgModal"));
        }

            //convert the image to file
            var blob = self._b64toBlob(image, contentType);


        //Launch the facebook sign in
        FB.login(function () {

            //Get the access token of the actual connection, used for API call
            var access_token =   FB.getAuthResponse()['accessToken'];

            //Create the data to send to facebook thanks to his API
            var fd = new FormData();
            fd.append("access_token", access_token);
            fd.append("source", blob);
            fd.append("message",comment);
            //API call
            try {
                $.ajax({
                    url: "https://graph.facebook.com/me/photos?access_token=" + access_token,
                    type: "POST",
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false,

                    success: function (data) {
                        console.log("success " + data.id);
                        // Close the modal when the post is finished
                        self._close();
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

          //Add scope corresponds to permission use by the facebook user that use the application
                } ,  {scope: 'publish_actions,user_photos'});


    }
    /**
     *Method call to convert an image to base 64
     *@ param : img : the image (HTML tag) we want to convert
     */
    _getBase64Image(img) {

        // Create an empty canvas element
        var canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Get the data-URL formatted image
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    /**
     *Method call to convert an image to a file
     */
    _b64toBlob(b64Data, contentType, sliceSize) {
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

}

ShareButton.propTypes = {
    comment: React.PropTypes.string
};
