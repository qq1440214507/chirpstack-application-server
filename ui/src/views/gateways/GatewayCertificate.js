import React, { Component } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import moment from "moment";

import GatewayStore from "../../stores/GatewayStore";


class GatewayCertificate extends Component {
  constructor() {
    super();

    this.state = {
      tlsCert: null,
      tlsKey: null,
      buttonDisabled: false,
    };
  }

  requestCertificate = () => {
    this.setState({
      buttonDisabled: true,
    });

    GatewayStore.generateClientCertificate(this.props.match.params.gatewayID, (resp => {
      this.setState({
        tlsKey: resp.tlsKey,
        tlsCert: resp.tlsCert,
        caCert: resp.caCert,
        expiresAt: moment(resp.expiresAt).format("lll"),
      });
    }));
  }

  render() {
    return(
      <Card>
        <CardContent>
          <Typography gutterBottom>
            When required by the network, the gateway needs a client certificate in order to connect to the network.
            This certificate must be configured on the gateway. After generating the certificate, the certificate
            can only be retrieved once.
          </Typography>
          {this.state.tlsCert == null && <Button onClick={this.requestCertificate} disabled={this.state.buttonDisabled}>Generate certificate</Button>}
          {this.state.tlsCert != null && <form>
            <TextField
              id="expiresAt"
              label="证书过期时间"
              margin="normal"
              value={this.state.expiresAt}
              helperText="证书在设置的日期过期。确保在此到期日期之前为网关生成并配置新证书。"
              disabled
              fullWidth
            />
            <TextField
              id="caCert"
              label="CA证书"
              margin="normal"
              value={this.state.caCert}
              rows={10}
              multiline
              fullWidth
              helperText="用于验证服务器的CA证书。将此文本存储在网关上，例如 名为“ca.pem”。"
            />
            <TextField
              id="tlsCert"
              label="TLS证书"
              margin="normal"
              value={this.state.tlsCert}
              rows={10}
              multiline
              fullWidth
              helperText="将此文本存储在网关上，例如 名为'cert.pem'。"
            />
            <TextField
              id="tlsKey"
              label="TLS秘钥"
              margin="normal"
              value={this.state.tlsKey}
              rows={10}
              multiline
              fullWidth
              helperText="将此文本存储在网关上,例如 名为 'key.pem'。"
            />
          </form>}
        </CardContent>
      </Card>
    );
  }
}

export default GatewayCertificate;
