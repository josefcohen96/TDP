import halls from './halls.config.json';

export interface SeatLayout {
  number: number;
}

export interface HallLayout {
  name: string;
  capacity: number;
  layout: SeatLayout[];
}

export const getHallLayout = (hallName: string): HallLayout | undefined => {
  return halls.find((h) => h.name === hallName);
};

export const getAllHalls = (): HallLayout[] => {
  return halls;
};
