var React = require('react');

var JSONpp = require('../utils/jsonpp');

var Response = React.createClass({

  getInitialState: function () {
    return {
      payload: this.props.payload,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      payload: nextProps.payload
    });
  },
  
  componentDidUpdate: function() {
	var requestHeight = window.getComputedStyle(document.querySelector('#request')).height
	console.log('requestHeight '+requestHeight)
	var response = document.querySelector('#response')
	var responseBody = document.querySelector('#responseBody')
	var responseResponseHeight = parseInt(window.getComputedStyle(document.querySelector('#responseResponse')).height)
	console.log(responseResponseHeight)
	var responseStatusHeight = parseInt(window.getComputedStyle(document.querySelector('#responseStatus')).height)
	console.log(responseStatusHeight)
	response.style.height = parseInt(requestHeight)
	responseBody.style.height = (parseInt(requestHeight) - responseResponseHeight - responseStatusHeight) + 'px'
	console.log(responseBody.style.height)
  },

  saveToken: function () {
    window.token = 'Token ' + this.state.payload.body.token;
  },

  render: function () {
    if (!this.state.payload) {
      return (
        <div>
          <h3>Response</h3>
          <p className='lead text-center'>Awaiting request...</p>
        </div>
      );
    }

    var responseJSON = JSONpp.prettyPrint(this.state.payload.body);
    var hasToken = this.state.payload.body ? this.state.payload.body.hasOwnProperty('token') : false;
    var statusText = this.state.payload.statusText.toLowerCase();
    var statusCodeFirstChar = String(this.state.payload.status).charAt(0);
    var statusCodeClass = 'label status-code pull-right status-code-' + statusCodeFirstChar;

    return (
      <div>
        <h3 id="responseResponse">Response <span className={statusCodeClass}>{this.props.payload.status}</span></h3>

        <div id="responseStatus"><strong>Status</strong>: <span className='status-text'>{statusText}</span></div>
        <pre id="responseBody" style={{overflowY:"scroll"}}><code dangerouslySetInnerHTML={{__html: responseJSON}}></code></pre>

        {hasToken ? (
          <div className='well well-default text-center'>
            <button className='btn btn-sm btn-info' onClick={this.saveToken}>
              <i className='fa fa-key' /> Save Token
          </button>
            <h6>Your token will be lost when you refresh the page.</h6>
          </div>
        ) : null}
      </div>
    );
  }
});

module.exports = Response;
