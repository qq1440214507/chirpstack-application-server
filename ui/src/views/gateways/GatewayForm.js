import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";

import { Map, Marker } from 'react-leaflet';

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import KVForm from "../../components/KVForm";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import NetworkServerStore from "../../stores/NetworkServerStore";
import GatewayProfileStore from "../../stores/GatewayProfileStore";
import LocationStore from "../../stores/LocationStore";
import MapTileLayer from "../../components/MapTileLayer";
import EUI64Field from "../../components/EUI64Field";
import AESKeyField from "../../components/AESKeyField";
import theme from "../../theme";


const boardStyles = {
  formLabel: {
    color: theme.palette.primary.main,
  },
  a: {
    color: theme.palette.primary.main,
  },
};


class GatewayBoardForm extends Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onChange(e) {
    let board = this.props.board;
    const field = e.target.id;

    board[field] = e.target.value;
    this.props.onChange(board);
  }

  onDelete(e) {
    e.preventDefault();
    this.props.onDelete();
  }

  render() {
    return(
      <FormControl fullWidth margin="normal">
        <FormLabel className={this.props.classes.formLabel}>Board #{this.props.i} configuration (<a href="#delete" onClick={this.onDelete} className={this.props.classes.a}>删除</a>)</FormLabel>
        <EUI64Field
          id="fpgaID"
          label="FPGA ID"
          margin="normal"
          value={this.props.board.fpgaID || ""}
          onChange={this.onChange}
          helperText="地理位置集中器板的FPGA ID。仅适用于具有地理位置功能的v2网关。（可选的）"
          fullWidth
        />
        <AESKeyField
          id="fineTimestampKey"
          label="精细时间戳解密密钥"
          margin="normal"
          value={this.props.board.fineTimestampKey || ""}
          onChange={this.onChange}
          helperText="精细时间戳AES解密密钥。设置后，网络服务器将解密精细时间戳。仅适用于具有地理位置功能的v2网关。（可选的）"
          fullWidth
        />
      </FormControl>
    );
  }
}

GatewayBoardForm = withStyles(boardStyles)(GatewayBoardForm);


const styles = {
  mapLabel: {
    marginBottom: theme.spacing(1),
  },
  link: {
    color: theme.palette.primary.main,
  },
  formLabel: {
    fontSize: 12,
  },
};

class GatewayForm extends FormComponent {
  constructor() {
    super();
    
    this.state = {
      mapZoom: 15,
      tab: 0,
      tags: [],
      metadata: [],
    };

    this.getNetworkServerOption = this.getNetworkServerOption.bind(this);
    this.getNetworkServerOptions = this.getNetworkServerOptions.bind(this);
    this.getGatewayProfileOption = this.getGatewayProfileOption.bind(this);
    this.getGatewayProfileOptions = this.getGatewayProfileOptions.bind(this);
    this.setCurrentPosition = this.setCurrentPosition.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.updateZoom = this.updateZoom.bind(this);
    this.addGatewayBoard = this.addGatewayBoard.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.setKVArrays(this.props.object || {});

    if (!this.props.update) {
      this.setCurrentPosition();
    }
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    if (prevProps.object !== this.props.object) {
      this.setKVArrays(this.props.object || {});
    }
  }

  onChange(e) {
    if (e.target.id === "networkServerID" && e.target.value !== this.state.object.networkServerID) {
      let object = this.state.object;
      object.gatewayProfileID = null;
      this.setState({
        object: object,
      });
    }

    super.onChange(e);
  }

  setCurrentPosition(e) {
    if (e !== undefined) {
      e.preventDefault();
    }

    LocationStore.getLocation(position => {
      let object = this.state.object;
      object.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: this.state.object.location.altitude,
      }
      this.setState({
        object: object,
      });
    });
  }

  updatePosition() {
    const position = this.refs.marker.leafletElement.getLatLng();
    let object = this.state.object;
    object.location = {
      latitude: position.lat,
      longitude: position.lng,
      altitude: this.state.object.location.altitude,
    }
    this.setState({
      object: object,
    });
  }

  updateZoom(e) {
    this.setState({
      mapZoom: e.target.getZoom(),
    });
  }

  getNetworkServerOption(id, callbackFunc) {
    NetworkServerStore.get(id, resp => {
      callbackFunc({label: resp.networkServer.name, value: resp.networkServer.id});
    });
  }

  getNetworkServerOptions(search, callbackFunc) {
    NetworkServerStore.list(this.props.match.params.organizationID, 999, 0, resp => {
      const options = resp.result.map((ns, i) => {return {label: ns.name, value: ns.id}});
      callbackFunc(options);
    });
  }

  getGatewayProfileOption(id, callbackFunc) {
    GatewayProfileStore.get(id, resp => {
      callbackFunc({label: resp.gatewayProfile.name, value: resp.gatewayProfile.id});
    });
  }

  getGatewayProfileOptions(search, callbackFunc) {
    if (this.state.object === undefined || this.state.object.networkServerID === undefined) {
      callbackFunc([]);
      return;
    }

    GatewayProfileStore.list(this.state.object.networkServerID, 999, 0, resp => {
      const options = resp.result.map((gp, i) => {return {label: gp.name, value: gp.id}});
      callbackFunc(options);
    });
  }

  addGatewayBoard() {
    let object = this.state.object;
    if (object.boards === undefined) {
      object.boards = [{}];
    } else {
      object.boards.push({});
    }

    this.setState({
      object: object,
    });
  }

  deleteGatewayBoard(i) {
    let object = this.state.object;
    object.boards.splice(i, 1);
    this.setState({
      object: object,
    });
  }

  updateGatewayBoard(i, board) {
    let object = this.state.object;
    object.boards[i] = board;
    this.setState({
      object: object,
    });
  }

  onTabChange = (e, v) => {
    this.setState({
      tab: v,
    });
  }

  setKVArrays = (props) => {
    let tags = [];
    let metadata = [];

    if (props.tags !== undefined) {
      for (let key in props.tags) {
        tags.push({key: key, value: props.tags[key]});
      }
    }

    if (props.metadata !== undefined) {
      for (let key in props.metadata) {
        metadata.push({key: key, value: props.metadata[key]});
      }
    }

    this.setState({
      tags: tags,
      metadata: metadata,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    const style = {
      height: 400,
    };

    let position = [];
    if (this.state.object.location.latitude !== undefined && this.state.object.location.longitude !== undefined) {
      position = [this.state.object.location.latitude, this.state.object.location.longitude];
    } else {
      position = [0, 0];
    }

    let boards = [];
    if (this.state.object.boards !== undefined) {
      boards = this.state.object.boards.map((b, i) => <GatewayBoardForm key={i} i={i} board={b} onDelete={() => this.deleteGatewayBoard(i)} onChange={board => this.updateGatewayBoard(i, board)} />);
    }

    const tags = this.state.tags.map((obj, i) => <KVForm key={i} index={i} object={obj} onChange={this.onChangeKV("tags")} onDelete={this.onDeleteKV("tags")} />);
    const metadata = this.state.metadata.map((obj, i) => <KVForm disabled={true} key={i} index={i} object={obj} onChange={this.onChangeKV("metadata")} onDelete={this.onDeleteKV("metadata")} />);

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
        extraButtons={this.state.tab === 0 && <Button onClick={this.addGatewayBoard}>添加配置</Button>}
      >
        <Tabs value={this.state.tab} onChange={this.onTabChange} indicatorColor="primary">
          <Tab label="基础" />
          <Tab label="标签" />
          <Tab label="元数据" />
        </Tabs>

        {this.state.tab === 0 && <div>
          <TextField
            id="name"
            label="网关名称"
            margin="normal"
            value={this.state.object.name || ""}
            onChange={this.onChange}
            inputProps={{
              pattern: "[\\w-]+",
            }}
            helperText="名称只能包含英文，数字和破折号。"
            required
            fullWidth
          />
          <TextField
            id="description"
            label="网关描述"
            margin="normal"
            value={this.state.object.description || ""}
            onChange={this.onChange}
            rows={4}
            multiline
            required
            fullWidth
          />
          {!this.props.update && <EUI64Field
            id="id"
            label="网关ID"
            margin="normal"
            value={this.state.object.id || ""}
            onChange={this.onChange}
            required
            fullWidth
            random
          />}
          {!this.props.update && <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>网络服务器</FormLabel>
            <AutocompleteSelect
              id="networkServerID"
              label="选择网络服务器"
              value={this.state.object.networkServerID || ""}
              onChange={this.onChange}
              getOption={this.getNetworkServerOption}
              getOptions={this.getNetworkServerOptions}
              required
            />
            <FormHelperText>
              选择网关将连接到的网络服务器。 如果下拉列表中没有可用的网络服务器，请查看该组织的服务配置文件是否存在。
            </FormHelperText>
          </FormControl>}
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel}>网关配置文件</FormLabel>
            <AutocompleteSelect
              id="gatewayProfileID"
              label="选择网关配置文件"
              value={this.state.object.gatewayProfileID || ""}
              triggerReload={this.state.object.networkServerID || ""}
              onChange={this.onChange}
              getOption={this.getGatewayProfileOption}
              getOptions={this.getGatewayProfileOptions}
              clearable={true}
            />
            <FormHelperText>
             可选的。在为网关分配网关配置文件时，网络服务器将尝试根据网关配置文件更新网关。 请注意，这需要具有ChirpStack Concentratord组件的网关。
            </FormHelperText>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              label="网关发现"
              control={
                <Checkbox
                  id="discoveryEnabled"
                  checked={!!this.state.object.discoveryEnabled}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormHelperText>
                启用后（并且网络服务器配置了启用的网关发现功能），网关将定期发出ping命令以测试同一网络中其他网关的覆盖范围。
            </FormHelperText>
          </FormGroup>
          <TextField
            id="location.altitude"
            label="网关高度（米）"
            margin="normal"
            type="number"
            value={this.state.object.location.altitude || 0}
            onChange={this.onChange}
            helperText="网关具有GPS时，当网络从网关接收到统计信息时，将自动设置此值."
            required
            fullWidth
          />
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.mapLabel}>网关位置 (<a onClick={this.setCurrentPosition} href="#getlocation" className={this.props.classes.link}>设置为当前位置</a>)</FormLabel>
            <Map
              center={position}
              zoom={this.state.mapZoom}
              style={style}
              animate={true}
              scrollWheelZoom={false}
              onZoomend={this.updateZoom}
              >
              <MapTileLayer />
              <Marker position={position} draggable={true} onDragend={this.updatePosition} ref="marker" />
            </Map>
            <FormHelperText>
              将标记拖动到网关的位置。网关具有GPS时，当网络从网关接收统计信息时，将自动设置此值。
            </FormHelperText>
          </FormControl>
          {boards}
        </div>}
        {this.state.tab === 1 && <div>
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">
              标签可用于存储其他键/值数据。
            </Typography>
            {tags}
          </FormControl>
          <Button variant="outlined" onClick={this.addKV("tags")}>添加标签</Button>
        </div>}
        {this.state.tab === 2 && <div>
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">
              网关网桥可以使用元数据来推送有关网关的信息（例如ip /主机名，序列号，温度等）。当收到网关统计信息时，此信息将自动更新。
            </Typography>
            {metadata}
          </FormControl>
        </div>}
      </Form>
    );
  }
}

export default withStyles(styles)(GatewayForm);
