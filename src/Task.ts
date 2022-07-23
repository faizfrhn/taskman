export interface ITask {
  id: number;
  name: string;
  status: string;
  parentId?: number;
}
