/**
 * Created by ophelie on 07/11/2016.
 */



var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Row = ReactBootstrap.Row;
var Tooltip = ReactBootstrap.Tooltip;
var Overlay = ReactBootstrap.Overlay;
var FormControl = ReactBootstrap.FormControl;
var Image = ReactBootstrap.Image;



class ShareButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false, show: false, comment: 'Your comment'};
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

                        <a id="fbtooltip" className="fa fa-facebook fa-lg" onClick={this._open.bind(this)}/>
                        <a className="fa fa-twitter fa-lg" onClick={this._open.bind(this)}/>
                    </Tooltip>
                </Overlay>




                <Modal show={this.state.showModal} onHide={this._close.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Share your content</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Image id="sharedImgModal" src={"https://play.dhis2.org/demo/api/" + this.props.type + "/" + this.props.id +"/data?width=500 "} rounded  />
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
                        <Button onClick={this._uploadFacebook.bind(this)}>Publish</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
    _close(){
        this.setState({ showModal: false});
    }
    _open(){
        console.log("hi");
        this.setState({ showModal: true });
    }
    _toggle() {
        this.setState({ show: !this.state.show });
    }
    _handle_comment_change(event){
        this.setState({comment: event.target.value});
    }
    _uploadFacebook(){

        var comment = this.state.comment;
        var close = this._close();
        var url = "https://play.dhis2.org/demo/api/"+ this.props.type +"/" + this.props.id +"/data?width=800";



        FB.login(function () {

            var access_token =   FB.getAuthResponse()['accessToken'];
            console.log('Access Token = '+ access_token);
            console.log(tocard);
            FB.api(
                '/me/photos',
                'post',
                {
                    message: comment,

            status: 'success',
                access_token: access_token,
                    url:url
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
        }, {scope: 'publish_actions,user_photos'});

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
