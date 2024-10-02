import { QueryClient, useMutation, useQuery } from "react-query"
import { auth } from "../authentication/firebaseAuthentifcation"
import { pullWorkersInfo, pushWorkersInfo } from "../api/api"
import { WorkerInfo } from "../component/WorkerInfo"

const fetchWorkerInfo = () => {
    if (!auth.currentUser) throw Error("There is no current user")
    return pullWorkersInfo(auth.currentUser.uid)
}
export const useWorkerInfo = () => {
    return useQuery<WorkerInfo[]>(["workerInfo"], () => fetchWorkerInfo());
};

const modifyWorkerInfo = (info: WorkerInfo[]) => {
    if (!auth.currentUser) throw Error("There is no current user")
    return pushWorkersInfo(info, auth.currentUser.uid)
}
export const useModifyWorkerInfo = () => {
    return useMutation(["workerInfo"], (info: WorkerInfo[]) => modifyWorkerInfo(info))
}