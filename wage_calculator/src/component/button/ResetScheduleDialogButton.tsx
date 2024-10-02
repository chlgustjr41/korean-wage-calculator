import * as React from "react";
import { ResetScheduleButtonProps } from "./interface";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

export interface ResetScheduleDialogButtonProps {
    handleResetSchedule(): any;
}


const ResetScheduleDialogButton: React.FC<ResetScheduleDialogButtonProps> = (
    { handleResetSchedule }: ResetScheduleButtonProps
) => {
    const [open, setOpen] = React.useState(false);

    const handleCancel = () => {
        setOpen(false);
    };

    const handleClose = () => {
        handleResetSchedule();
        setOpen(false);
    };

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
                <Button
                    variant="outline"
                >
                    초기화
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#dad7cd] w-auto p-5">
                <DialogHeader>
                    <DialogTitle>
                        알르바이트생들의 시간표를 초기화 하시겠습니까?
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    초기화된 정보는 회복이 불가합니다.
                </DialogDescription>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleCancel()}
                    >
                        취소
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => handleClose()}
                    >
                        초기화
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResetScheduleDialogButton;
