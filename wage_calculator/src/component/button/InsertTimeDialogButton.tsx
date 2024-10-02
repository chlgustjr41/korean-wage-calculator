import * as React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { pullBasicInfo } from "../../database/api/api";
import { auth } from "../../database/authentication/firebaseAuthentifcation";
import { KeyboardEvent } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Clock4 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

const InsertTimeFormValue = z.object({
    hour: z.number().min(0),
    minute: z.number().min(0).max(60)
})

interface InsertTimeButtonProps {
    type: "Weekly" | "DayNight" | "Holiday";
    workerTimeInfo: string[];
    workerIndex: number;
    timeIndex: number;
    handleInsertTime(
        hour: number,
        minute: number,
        workerIndex: number,
        timeIndex: number
    ): any;
}

const InsertTimeDialogButton: React.FC<InsertTimeButtonProps> = ({
    type,
    workerTimeInfo,
    workerIndex,
    timeIndex,
    handleInsertTime
}: InsertTimeButtonProps) => {
    // Each line of schedules needs to track the "index" of the timeslots.
    // Requires only SINGLE worker information
    // May require additional "type" of the schedule slot for detecting the last index of the schedule slots
    // Instead of having timeString, have workers[i] so the weeklyHours array is accessible. Track with slots with timeIndex
    const [slotIndex, setSlotIndex] = useState(timeIndex);
    const [open, setOpen] = useState(false);

    const currentTimeString = useMemo(() => workerTimeInfo[timeIndex], [workerTimeInfo, timeIndex])

    const timeString = useMemo(() => workerTimeInfo[slotIndex], [workerTimeInfo, slotIndex])
    const hourValue = useMemo(() =>
        timeString && timeString !== "" ? +timeString.split(":")[0] : 0
        , [timeString])
    const minuteValue = useMemo(() =>
        timeString && timeString !== "" ? +timeString.split(":")[1] : 0
        , [timeString])

    const form = useForm<z.infer<typeof InsertTimeFormValue>>({
        mode: "onChange",
        resolver: zodResolver(InsertTimeFormValue),
        values: {
            hour: hourValue,
            minute: minuteValue
        }
    })
    const { control, handleSubmit, getValues, reset, resetField } = form

    useEffect(() => {
        if (slotIndex !== timeIndex) {
            resetField("hour", { defaultValue: hourValue })
            resetField("minute", { defaultValue: minuteValue })
        }
    }, [slotIndex]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = useCallback(() => {
        console.log({ timeString })
        reset();
        setSlotIndex(timeIndex)
        setOpen(false);
    }, [timeIndex, timeString, reset, setSlotIndex]);

    const handleNext = useCallback(() => {
        handleInsertTime(getValues("hour"), getValues("minute"), workerIndex, slotIndex);
        setSlotIndex(slotIndex + 1);
    }, [slotIndex, workerIndex, getValues]);

    const handlePrev = useCallback(() => {
        handleInsertTime(getValues("hour"), getValues("minute"), workerIndex, slotIndex);
        setSlotIndex(slotIndex - 1);
    }, [slotIndex, workerIndex, getValues]);

    const handleKeyPress = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        console.log(e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            handleInsertTime(getValues("hour"), getValues("minute"), workerIndex, slotIndex);
            handleClose();
        } else if (e.shiftKey && e.key === " ") {
            e.preventDefault();
            if (slotIndex > 0) handlePrev();
        }
        else if (e.key === " ") {
            e.preventDefault();
            if (slotIndex < workerTimeInfo.length - 1) handleNext();
        }
    }, [slotIndex, workerTimeInfo, handleClose, handleNext, getValues, handleInsertTime]);

    const onSubmit = useCallback((values: z.infer<typeof InsertTimeFormValue>) => {
        handleInsertTime(values.hour, values.minute, workerIndex, slotIndex);
        handleClose();
    }, [slotIndex, handleInsertTime, handleClose])

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!open)
                    handleClose();
                else
                    setOpen(open)
            }}
        >
            <DialogTrigger asChild className="flex flex-col justify-center">
                {timeString === "" ? (
                    <Button
                        className="text-green-700 hover:text-green-900 hover:bg-green-900 hover:bg-opacity-10"
                        variant="ghost"
                        size="icon"
                    >
                        <Clock4 />
                    </Button>
                ) : (
                    <Button
                        className="text-green-700 hover:text-green-900 hover:bg-green-900 hover:bg-opacity-10"
                        variant="ghost"
                    >
                        {currentTimeString}
                    </Button>
                )}
            </DialogTrigger>

            <Form {...form}>
                <DialogContent
                    className="bg-[#dad7cd] w-auto p-5 pb-0"
                    onKeyDown={handleKeyPress}
                >
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>
                                {type === "Weekly" && <>{slotIndex + 1}째주 근무 시간</>}
                                {type === "DayNight" && slotIndex === 0 && <>낮 근무 시간</>}
                                {type === "DayNight" && slotIndex === 1 && <>야간 근무 시간</>}
                                {type === "Holiday" && <>공휴일 근무 시간</>}

                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-between w-full gap-2">
                            {type !== "Holiday" && <Button
                                className="self-center hover:bg-slate-900 hover:bg-opacity-10"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (slotIndex !== 0) handlePrev()
                                }}
                                disabled={slotIndex == 0}
                            >
                                <ChevronLeft />
                            </Button>}

                            <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2">
                                <FormField
                                    control={control}
                                    name="hour"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>시간</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="border-slate-400 focus:border-slate-500 w-20"
                                                    type="number"
                                                    min={0}
                                                    {...field}
                                                    onChange={(e) => field.onChange(+e.target.value)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="minute"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>분</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="border-slate-400 focus:border-slate-500 w-20"
                                                    type="number"
                                                    min={0}
                                                    max={60}
                                                    {...field}
                                                    onChange={(e) => field.onChange(+e.target.value)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {type !== "Holiday" && <Button
                                className="self-center hover:bg-slate-900 hover:bg-opacity-10"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if ((type === "Weekly" && slotIndex !== 5) ||
                                        (type === "DayNight" && slotIndex !== 1))
                                        handleNext()
                                }}
                                disabled={
                                    (type === "Weekly" && slotIndex === 5) ||
                                    (type === "DayNight" && slotIndex === 1)
                                }
                            >
                                <ChevronRight />
                            </Button>}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => handleClose()}
                            >
                                취소
                            </Button>
                            <Button
                                variant="default"
                                type="submit"
                            >
                                추가
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Form>
        </Dialog>
    );
};

export default InsertTimeDialogButton;
