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

const dbRef = ref(getDatabase());

export async function pushBasicInfo(
  info: BasicInfo,
  uid: string
): Promise<boolean> {
  return new Promise(function (resolve, reject) {
    get(ref(apidb, "users/" + uid + "/basicInfo/"))
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
    get(ref(apidb, "users/" + uid + "/workersInfo/"))
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
    get(child(dbRef, "users/" + uid + "/basicInfo/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          let basicInfo: BasicInfo = {
            minimumWage: data["minimumWage"],
            lateNightWorkMultiplier: data["lateNightWorkMultiplier"],
            holidayAllowanceMinimumWorkTime:
              data["holidayAllowanceMinimumWorkTime"],
            weeklyWorkingDays: data["weeklyWorkingDays"],
          };
          resolve(basicInfo);
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
    get(child(dbRef, "users/" + uid + "/workersInfo/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data: WorkerInfo[] = snapshot.val()["workers"];
          resolve(data);
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
  set(ref(apidb, "users/" + auth.currentUser?.uid + "/basicInfo/"), {
    minimumWage: info.minimumWage,
    lateNightWorkMultiplier: info.lateNightWorkMultiplier,
    holidayAllowanceMinimumWorkTime: info.holidayAllowanceMinimumWorkTime,
    weeklyWorkingDays: info.weeklyWorkingDays,
  });
}

async function updateWorkersInfo(info: WorkerInfo[]) {
  set(ref(apidb, "users/" + auth.currentUser?.uid + "/workersInfo/"), {
    workers: JSON.parse(JSON.stringify(info)),
  });
}

async function addBasicInfo(info: BasicInfo) {
  const basicInfo = {
    minimumWage: info.minimumWage,
    lateNightWorkMultiplier: info.lateNightWorkMultiplier,
    holidayAllowanceMinimumWorkTime: info.holidayAllowanceMinimumWorkTime,
    weeklyWorkingDays: info.weeklyWorkingDays,
  };

  const updates = {};
  (updates as any)["users/" + auth.currentUser?.uid + "/basicInfo/"] =
    basicInfo;

  update(ref(apidb), updates);
}

async function addWorkersInfo(info: WorkerInfo[]) {
  const workersInfo = {
    workers: JSON.parse(JSON.stringify(info)),
  };

  const updates = {};
  (updates as any)["users/" + auth.currentUser?.uid + "/workersInfo/"] =
    workersInfo;

  update(ref(apidb), updates);
}
