
import  halls  from './halls.config.json';

export interface SeatRowLayout {
  row: string;
  length: number;
}

export interface HallLayout {
  name: string;
  capacity: number;
  layout: SeatRowLayout[];
}

export const getHallLayout = (hallName: string): HallLayout | undefined => {
  return (halls as HallLayout[]).find(h => h.name === hallName);
};

export const getAllHalls = (): HallLayout[] => {
  return halls as HallLayout[];
};
