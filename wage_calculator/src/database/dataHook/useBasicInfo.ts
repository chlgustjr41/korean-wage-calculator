import { useMutation, useQuery } from "react-query"
import { auth } from "../authentication/firebaseAuthentifcation"
import { pullBasicInfo, pushBasicInfo } from "../api/api"
import { BasicInfo } from "../component/BasicInfo"

const fetchBasicInfo = () => {
    if (!auth.currentUser) throw Error("There is no current user")
    return pullBasicInfo(auth.currentUser.uid)
}

export const useBasicInfo = () => {
    return useQuery<BasicInfo>(["basicInfo"], () => fetchBasicInfo());
};

const modifyBasicInfo = (info: BasicInfo) => {
    if (!auth.currentUser) throw Error("There is no current user")
    return pushBasicInfo(info, auth.currentUser.uid)
}
export const useModifyBasicInfo = () => {
    return useMutation(["basicInfo"], (info: BasicInfo) => modifyBasicInfo(info))
}