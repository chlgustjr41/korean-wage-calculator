import "firebase/firestore";
import {
  getDatabase,
  ref,
  get,
  update,
  remove,
  set,
  child,
} from "firebase/database";
import { apidb, auth } from "../authentication/firebaseAuthentifcation";
import { BasicInfo } from "../component/BasicInfo";
import { WorkerInfo } from "../component/WorkerInfo";
import { BASIC_INFO_ROUTE, WORKER_INFO_ROUTE } from "./apiRoutes";

const dbRef = ref(getDatabase());

export async function pushBasicInfo(
  info: BasicInfo,
  uid: string
): Promise<boolean> {
  return new Promise(function (resolve, reject) {
    get(ref(apidb, BASIC_INFO_ROUTE.replace("{uid}", uid)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          updateBasicInfo(info);
        } else {
          addBasicInfo(info);
        }
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function pushWorkersInfo(
  workersInfo: WorkerInfo[],
  uid: string
): Promise<boolean> {
  return new Promise(function (resolve, reject) {
    get(ref(apidb, WORKER_INFO_ROUTE.replace("{uid}", uid)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          updateWorkersInfo(workersInfo);
        } else {
          addWorkersInfo(workersInfo);
        }
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function pullBasicInfo(uid: string): Promise<BasicInfo> {
  return new Promise(function (resolve, reject) {
    get(child(dbRef, BASIC_INFO_ROUTE.replace("{uid}", uid)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          reject("Basic information do not exist");
        }
      })
      .catch((err) => {
        reject(err.message);
      });
  });
}

export async function pullWorkersInfo(uid: string): Promise<Array<WorkerInfo>> {
  return new Promise(function (resolve, reject) {
    get(child(dbRef, WORKER_INFO_ROUTE.replace("{uid}", uid)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val()["workers"]);
        } else {
          reject("Workers information do not exist");
        }
      })
      .catch((err) => {
        reject(err.message);
      });
  });
}

async function updateBasicInfo(info: BasicInfo) {
  if (auth.currentUser) {
    set(ref(apidb, BASIC_INFO_ROUTE.replace("{uid}", auth.currentUser.uid)), {
      minimumWage: info.minimumWage,
      lateNightWorkMultiplier: info.lateNightWorkMultiplier,
      holidayAllowanceMinimumWorkTime: info.holidayAllowanceMinimumWorkTime,
      weeklyWorkingDays: info.weeklyWorkingDays,
    });
  }
}

async function updateWorkersInfo(info: WorkerInfo[]) {
  if (auth.currentUser) {
    set(ref(apidb, WORKER_INFO_ROUTE.replace("{uid}", auth.currentUser.uid)), {
      workers: JSON.parse(JSON.stringify(info)),
    });
  }
}

async function addBasicInfo(info: BasicInfo) {
  if (auth.currentUser) {
    const updates = {
      [BASIC_INFO_ROUTE.replace("{uid}", auth.currentUser.uid)]: info
    };

    update(ref(apidb), updates);
  }
}

async function addWorkersInfo(info: WorkerInfo[]) {
  if (auth.currentUser) {
    const workersInfo = {
      workers: JSON.parse(JSON.stringify(info)),
    };

    const updates = {
      [WORKER_INFO_ROUTE.replace("{uid}", auth.currentUser.uid)]: workersInfo
    };

    update(ref(apidb), updates);
  }
}
