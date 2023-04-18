import { WorkerInfo } from "../../database/component/WorkerInfo";

export interface AddWorkerButtonProps {
  minimumWage: string;
  handleAddWorker(name: string, wage: number): any;
  width?: any;
  height?: any;
  marginLeft?: any;
}

export interface EditWorkerButtonProps {
  minimumWage: string;
  currentName: string;
  currentWage: number;
  index: number;
  handleEditWorker(name: string, wage: number, index: number): any;
}

export interface DeleteWorkerButtonProps {
  index: number;
  handleDeleteWorker(index: number): any;
}

export interface InsertTimeButtonProps {
  timeString: string;
  workerIndex: number;
  timeIndex: number;
  handleInsertTime(
    hour: number,
    minute: number,
    workerIndex: number,
    timeIndex: number
  ): any;
}

export interface CalculateWageButtonProps {
  workers: WorkerInfo[];
  minimumWage: number;
  lateNightWorkMultiplier: number;
  holidayAllowanceMinimumWorkTime: number;
  weeklyWorkingDays: number;
}

export interface ResetScheduleButtonProps {
  handleResetSchedule(): any;
}
