import React from "react";

import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import FormControl from "../../components/FormControl";


class NetworkServerForm extends FormComponent {
  constructor() {
    super();
    this.state = {
      tab: 0,
    };

    this.onChangeTab = this.onChangeTab.bind(this);
  }

  onChangeTab(event, value) {
    this.setState({
      tab: value,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return(null);
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
            <Tabs
              value={this.state.tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.onChangeTab}
            >
              <Tab label="基础" />
              <Tab label="网关发现" />
              <Tab label="TLS证书" />
            </Tabs>
          {this.state.tab === 0 && <div>
            <TextField
              id="name"
              label="网络服务器名称"
              fullWidth={true}
              margin="normal"
              value={this.state.object.name || ""}
              onChange={this.onChange}
              helperText="网络服务器的名称。"
              required={true}
            />
            <TextField
              id="server"
              label="网络服务器地址"
              fullWidth={true}
              margin="normal"
              value={this.state.object.server || ""}
              onChange={this.onChange}
              helperText="格式为 'hostname:port',比如，'localhost:8000'."
              required={true}
            />
          </div>}
          {this.state.tab === 1 && <div>
            <FormControl
              label="网关发现"
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="gatewayDiscoveryEnabled"
                      checked={!!this.state.object.gatewayDiscoveryEnabled}
                      onChange={this.onChange}
                      value="true"
                      color="primary"
                    />
                  }
                  label="开启网关发现"
                />
              </FormGroup>
              <FormHelperText>为该网络服务器启用网关发现功能。</FormHelperText>
            </FormControl>
            {this.state.object.gatewayDiscoveryEnabled && <TextField
              id="gatewayDiscoveryInterval"
              label="时间间隔 (每天)"
              type="number"
              fullWidth={true}
              margin="normal"
              value={this.state.object.gatewayDiscoveryInterval}
              onChange={this.onChange}
              helperText="应用程序服务器每天向每个网关发送的网关发现“ping”数。"
              required={true}
            />}
            {this.state.object.gatewayDiscoveryEnabled && <TextField
              id="gatewayDiscoveryTXFrequency"
              label="TX频率(Hz)"
              type="number"
              fullWidth={true}
              margin="normal"
              value={this.state.object.gatewayDiscoveryTXFrequency}
              onChange={this.onChange}
              helperText="用于传输网关发现“ping”的频率（Hz）。请查阅LoRaWAN区域参数规范，以获取每个区域有效的通道。"
              required={true}
            />}
            {this.state.object.gatewayDiscoveryEnabled && <TextField
              id="gatewayDiscoveryDR"
              label="TX消息速率"
              type="number"
              fullWidth={true}
              margin="normal"
              value={this.state.object.gatewayDiscoveryDR}
              onChange={this.onChange}
              helperText="用于传输网关发现“ping”的数据速率。请参阅LoRaWAN区域参数规范，以获取每个区域的有效数据速率。"
              required={true}
            />}
          </div>}
          {this.state.tab === 2 && <div>
            <FormControl
              label="应用程序服务器到网络服务器连接的证书"
            >
              <FormGroup>
                <TextField
                  id="caCert"
                  label="CA证书"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.caCert || ""}
                  onChange={this.onChange}
                  helperText="将CA证书（PEM）文件的内容粘贴到上面的文本框中。留空以禁用TLS。"
                  multiline
                  rows="4"
                />
                <TextField
                  id="tlsCert"
                  label="TLS证书"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.tlsCert || ""}
                  onChange={this.onChange}
                  helperText="将TLS证书（PEM）文件的内容粘贴到上面的文本框中。留空以禁用TLS。"
                  multiline
                  rows="4"
                />
                <TextField
                  id="tlsKey"
                  label="TLS秘钥"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.tlsKey || ""}
                  onChange={this.onChange}
                  helperText="在上面的文本框中粘贴TLS密钥（PEM）文件的内容。 留空以禁用TLS。 注意：出于安全原因，TLS密钥在提交后无法检索（该字段保留为空白）。 当重新提交带有空TLS密钥字段（但已填充TLS证书字段）的表单时，密钥不会被覆盖。"
                  multiline
                  rows="4"
                />
              </FormGroup>
            </FormControl>

            <FormControl
              label="网络服务器到应用程序服务器连接的证书"
            >
              <FormGroup>
                <TextField
                  id="routingProfileCACert"
                  label="CA证书"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.routingProfileCACert || ""}
                  onChange={this.onChange}
                  helperText="将CA证书（PEM）文件的内容粘贴到上面的文本框中。留空以禁用TLS。"
                  multiline
                  rows="4"
                />
                <TextField
                  id="routingProfileTLSCert"
                  label="TLS证书"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.routingProfileTLSCert || ""}
                  onChange={this.onChange}
                  helperText="将TLS证书（PEM）文件的内容粘贴到上面的文本框中。留空以禁用TLS。"
                  multiline
                  rows="4"
                />
                <TextField
                  id="routingProfileTLSKey"
                  label="TLS秘钥"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.routingProfileTLSKey || ""}
                  onChange={this.onChange}
                  helperText="在上面的文本框中粘贴TLS密钥（PEM）文件的内容。 留空以禁用TLS。 注意：出于安全原因，TLS密钥在提交后无法检索（该字段保留为空白）。 当重新提交带有空TLS密钥字段（但已填充TLS证书字段）的表单时，密钥不会被覆盖。"
                  multiline
                  rows="4"
                />
              </FormGroup>
            </FormControl>
          </div>}
      </Form>
    );
  }
}

export default NetworkServerForm;
