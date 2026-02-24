import { CellStatus } from './cell-status.enum';

export interface Cell {
  id: number;
  status: CellStatus;
}
