import { EventEmitter } from "events";

import Swagger from "swagger-client";

import sessionStore from "./SessionStore";
import {checkStatus, errorHandler } from "./helpers";
import dispatcher from "../dispatcher";


class ServiceProfileStore extends EventEmitter {
  constructor() {
    super();
    this.swagger = new Swagger("/swagger/serviceProfile.swagger.json", sessionStore.getClientOpts());
  }

  create(serviceProfile, callbackFunc) {
    this.swagger.then(client => {
      client.apis.ServiceProfileService.Create({
        body: {
          serviceProfile: serviceProfile,
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
      client.apis.ServiceProfileService.Get({
        id: id,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  update(serviceProfile, callbackFunc) {
    this.swagger.then(client => {
      client.apis.ServiceProfileService.Update({
        "service_profile.id": serviceProfile.id,
        body: {
          serviceProfile: serviceProfile,
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
      client.apis.ServiceProfileService.Delete({
        id: id,
      })
      .then(checkStatus)
      .then(resp => {
        this.notify("删除");
        callbackFunc(resp.ojb);
      })
      .catch(errorHandler);
    });
  }

  list(organizationID, limit, offset, callbackFunc) {
    this.swagger.then(client => {
      client.apis.ServiceProfileService.List({
        organizationID: organizationID,
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
        message: "服务配置文件已" + action,
      },
    });
  }
}

const serviceProfileStore = new ServiceProfileStore();
export default serviceProfileStore;
