import { COLUMNS_ENUM } from "../enums";

export interface ListenEventsMap {
  receiver: (elements: Record<COLUMNS_ENUM, { id:string, value: string, focused: boolean }[]> | Record<string, never>) => void
  connect: () => void
  disconnect: () => void
}

export interface EmitEventsMap {
  update: (elements: Record<COLUMNS_ENUM, { id:string, value: string }[]> | Record<string, never>) => void
  room: (roomId: string) => void
}