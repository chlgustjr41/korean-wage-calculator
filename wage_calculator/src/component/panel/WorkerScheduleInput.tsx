import { useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { CircleAlert, CircleCheck } from "lucide-react";
import InsertTimeDialogButton from "../button/InsertTimeDialogButton";
import { useModifyWorkerInfo, useWorkerInfo } from "../../database/dataHook/useWorkerInfo";
import ResetScheduleDialogButton from "../button/ResetScheduleDialogButton";
import CalculateWageButton from "../button/CalculateWageButton";
import { useBasicInfo } from "../../database/dataHook/useBasicInfo";

export const WorkerScheduleInput: React.FC = () => {
    const TIME_DELTA = 0.25;

    const { data: basicInfo } = useBasicInfo()
    const { data: workers, isLoading: isWorkersLoading } = useWorkerInfo()
    const { mutate: modifyWorkerInfo } = useModifyWorkerInfo()

    const handleInsertWeeklyTime = useCallback((
        hour: number,
        minute: number,
        workerIndex: number,
        timeIndex: number
    ) => {
        if (!workers) return undefined;

        const hoursArray: string[] = workers[workerIndex].weeklyHours;
        const [hourStr, minuteStr] = [hour.toString().padStart(2, "0"), minute.toString().padStart(2, "0")]
        hoursArray[timeIndex] = `${hourStr}:${minuteStr}`;
        const workersArray = workers
        workersArray[workerIndex].weeklyHours = hoursArray;
        modifyWorkerInfo(workersArray)
    }, [workers]);

    const handleInsertDayNightTime = (
        hour: number,
        minute: number,
        workerIndex: number,
        timeIndex: number
    ) => {
        if (!workers) return undefined;

        let hoursArray: string[] = workers[workerIndex].dayNightHours;
        const [hourStr, minuteStr] = [hour.toString().padStart(2, "0"), minute.toString().padStart(2, "0")]
        hoursArray[timeIndex] = `${hourStr}:${minuteStr}`;
        const workersArray = workers
        workersArray[workerIndex].dayNightHours = hoursArray;
        modifyWorkerInfo(workersArray)
    };

    const handleInsertHolidayTime = (
        hour: number,
        minute: number,
        workerIndex: number,
    ) => {
        if (!workers) return undefined;

        const [hourStr, minuteStr] = [hour.toString().padStart(2, "0"), minute.toString().padStart(2, "0")]
        const workersArray = workers
        workersArray[workerIndex].holidayHour = [`${hourStr}:${minuteStr}`];
        modifyWorkerInfo(workersArray)
    };


    const getTotalWeeklyHours = useCallback((workerIndex: number) => {
        if (!workers) return undefined

        let totalTime: number = 0;
        workers[workerIndex].weeklyHours.forEach((time) => {
            if (time) {
                const [hour, minute] = time.split(":")
                totalTime += +hour;
                totalTime += +minute / 60.0;
            }
        })
        return totalTime.toFixed(2);
    }, [workers])

    const getTotalDayNightHours = useCallback((workerIndex: number) => {
        if (!workers) return undefined

        let totalTime: number = 0;
        workers[workerIndex].dayNightHours.forEach((time) => {
            if (time) {
                const [hour, minute] = time.split(":")
                totalTime += +hour;
                totalTime += +minute / 60.0;
            }
        })
        return totalTime.toFixed(2);
    }, [workers])

    const isDeltaTimeValid = useCallback((workerIndex: number) => {
        const totalWeeklyHour = getTotalWeeklyHours(workerIndex)
        const totalDayNightHour = getTotalDayNightHours(workerIndex)
        if (!totalWeeklyHour || !totalDayNightHour) return undefined

        const deltaTime = +totalWeeklyHour - +totalDayNightHour
        return Math.abs(deltaTime) < TIME_DELTA
    }, [TIME_DELTA, workers])

    const handleResetSchedule = () => {
        if (!workers) return undefined

        workers.map((worker, i) => {
            worker.weeklyHours = ["", "", "", "", "", ""];
            worker.dayNightHours = ["", ""];
            worker.holidayHour = [""]
            return worker
        });
        modifyWorkerInfo(workers);
    };

    return (
        <div className="flex flex-col p-10 bg-[#dad7cd]">
            <Label className="font-bold text-lg">
                아르바이트생 근무표 입력
            </Label>
            {!isWorkersLoading &&
                <Card className="bg-inherit border-transparent">
                    <Table className="mt-5">
                        <TableHeader>
                            <TableRow className="border-black">
                                <TableHead className="text-center font-bold">#</TableHead>
                                <TableHead className="text-center font-bold">이름</TableHead>
                                <TableHead className="text-center font-bold">1주</TableHead>
                                <TableHead className="text-center font-bold">2주</TableHead>
                                <TableHead className="text-center font-bold">3주</TableHead>
                                <TableHead className="text-center font-bold">4주</TableHead>
                                <TableHead className="text-center font-bold">5주</TableHead>
                                <TableHead className="text-center font-bold">6주</TableHead>
                                <TableHead className="text-center font-bold">총합 근무 시간 1</TableHead>
                                <TableHead className="text-center font-bold">낮 근무 시간</TableHead>
                                <TableHead className="text-center font-bold">야간 근무 시간</TableHead>
                                <TableHead className="text-center font-bold">총합 근무 시간 2</TableHead>
                                <TableHead className="text-center font-bold">공휴일 근무 시간</TableHead>
                                <TableHead className="text-center font-bold">검산</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workers?.map((worker, i) => (
                                <TableRow
                                    className="border-slate-400"
                                    key={`${worker.name}-${i}`}
                                >
                                    <TableCell className="text-center">{i + 1}</TableCell>
                                    <TableCell className="text-center text-nowrap">{worker.name}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="Weekly"
                                                workerTimeInfo={[...worker.weeklyHours]}
                                                workerIndex={i}
                                                timeIndex={0}
                                                handleInsertTime={handleInsertWeeklyTime}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="Weekly"
                                                workerTimeInfo={[...worker.weeklyHours]}
                                                workerIndex={i}
                                                timeIndex={1}
                                                handleInsertTime={handleInsertWeeklyTime}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="Weekly"
                                                workerTimeInfo={[...worker.weeklyHours]}
                                                workerIndex={i}
                                                timeIndex={2}
                                                handleInsertTime={handleInsertWeeklyTime}
                                            />
                                        </div>

                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="Weekly"
                                                workerTimeInfo={[...worker.weeklyHours]}
                                                workerIndex={i}
                                                timeIndex={3}
                                                handleInsertTime={handleInsertWeeklyTime}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="Weekly"
                                                workerTimeInfo={[...worker.weeklyHours]}
                                                workerIndex={i}
                                                timeIndex={4}
                                                handleInsertTime={handleInsertWeeklyTime}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="Weekly"
                                                workerTimeInfo={[...worker.weeklyHours]}
                                                workerIndex={i}
                                                timeIndex={5}
                                                handleInsertTime={handleInsertWeeklyTime}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {getTotalWeeklyHours(i)} <span className="text-nowrap">시간</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="DayNight"
                                                workerTimeInfo={[...worker.dayNightHours]}
                                                workerIndex={i}
                                                timeIndex={0}
                                                handleInsertTime={handleInsertDayNightTime}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="DayNight"
                                                workerTimeInfo={[...worker.dayNightHours]}
                                                workerIndex={i}
                                                timeIndex={1}
                                                handleInsertTime={handleInsertDayNightTime}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {getTotalDayNightHours(i)} <span className="text-nowrap">시간</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <InsertTimeDialogButton
                                                type="Holiday"
                                                workerTimeInfo={worker.holidayHour ? [...worker.holidayHour] : [""]}
                                                workerIndex={i}
                                                timeIndex={0}
                                                handleInsertTime={handleInsertHolidayTime}
                                            />
                                        </div>
                                    </TableCell>
                                    {isDeltaTimeValid(i) !== undefined ?
                                        <TableCell className="justify-center align-middle">
                                            {isDeltaTimeValid(i) ? <CircleCheck /> : <CircleAlert color="red" />}
                                        </TableCell> :
                                        <div className="flex justify-center">-</div>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table >
                </Card>}
            <div className="flex justify-end mt-5 gap-x-2">
                <ResetScheduleDialogButton handleResetSchedule={handleResetSchedule} />
                {basicInfo && !isWorkersLoading &&
                    <CalculateWageButton
                        workers={workers ?? []}
                        minimumWage={basicInfo.minimumWage}
                        lateNightWorkMultiplier={basicInfo.lateNightWorkMultiplier}
                        holidayAllowanceMinimumWorkTime={basicInfo.holidayAllowanceMinimumWorkTime}
                        weeklyWorkingDays={basicInfo.weeklyWorkingDays}
                    />
                }
            </div>
        </div >
    )
};
