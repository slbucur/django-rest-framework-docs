var React = require('react');
var APIRequest = require('superagent');

var RequestUtils = require('../utils/request');
var Request = require('./request');
var Response = require('./response');

var LiveAPIEndpoints = React.createClass({

  getInitialState: function() {
    return {
      endpoint: this.props.endpoint,
      response: null
    };
  },

  getData: function () {
    var method = this.refs.request.state.selectedMethod;
    return RequestUtils.shouldIncludeData(method) ? (
      this.refs.request.state.data
    ) : null;
  },

  makeRequest: function (event) {
    event.preventDefault();

    var self = this;
    var request = this.refs.request.state;
    console.log('request')
    console.log(request)
    var headers = {};
    if (this.refs.request.state.headers.authorization) {
      headers['Authorization'] = this.refs.request.state.headers.authorization;
    };
    console.log('headers')
    console.log(headers)
    var data = this.getData();
    console.log('data')
    console.log(data)
    
    // Now Make the Request
    APIRequest(request.selectedMethod, request.endpoint.path)
      .set(headers)
      .send(data)
      .end(function (err, res) {
        self.setState({
          response: res
        });
      });
  },

  render: function () {
    return (
      <form className="form-horizontal" onSubmit={this.makeRequest}>
        <div className="modal-body">
          <div className="row">
            <div id="request" className="col-md-6 request">
              <Request endpoint={this.state.endpoint} ref='request' />
            console.log(this.state.endpoint)
           </div>
            <div id="response" className="col-md-6 response">
              <Response payload={this.state.response} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
          <button type="submit" className="btn btn-primary">Send</button>
        </div>
      </form>
    );
  }
});

module.exports = LiveAPIEndpoints;
