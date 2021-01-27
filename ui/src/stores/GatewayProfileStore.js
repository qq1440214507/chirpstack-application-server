import { EventEmitter } from "events";

import Swagger from "swagger-client";

import sessionStore from "./SessionStore";
import {checkStatus, errorHandler } from "./helpers";
import dispatcher from "../dispatcher";


class GatewayProfileStore extends EventEmitter {
  constructor() {
    super();
    this.swagger = new Swagger("/swagger/gatewayProfile.swagger.json", sessionStore.getClientOpts());
  }

  create(gatewayProfile, callbackFunc) {
    this.swagger.then(client => {
      client.apis.GatewayProfileService.Create({
        body: {
          gatewayProfile: gatewayProfile,
        },
      })
      .then(checkStatus)
      .then(resp => {
        this.notify("创建");
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  get(id, callbackFunc) {
    this.swagger.then(client => {
      client.apis.GatewayProfileService.Get({
        id: id,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  update(gatewayProfile, callbackFunc) {
    this.swagger.then(client => {
      client.apis.GatewayProfileService.Update({
        "gateway_profile.id": gatewayProfile.id,
        body: {
          gatewayProfile: gatewayProfile,
        },
      })
      .then(checkStatus)
      .then(resp => {
        this.notify("更新");
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  delete(id, callbackFunc) {
    this.swagger.then(client => {
      client.apis.GatewayProfileService.Delete({
        id: id,
      })
      .then(checkStatus)
      .then(resp => {
        this.notify("删除");
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  list(networkServerID, limit, offset, callbackFunc) {
    this.swagger.then((client) => {
      client.apis.GatewayProfileService.List({
        networkServerID: networkServerID,
        limit: limit,
        offset: offset,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  notify(action) {
    dispatcher.dispatch({
      type: "CREATE_NOTIFICATION",
      notification: {
        type: "成功",
        message: "设备配置文件已" + action,
      },
    });
  }
}

const gatewayProfileStore = new GatewayProfileStore();
export default gatewayProfileStore;
