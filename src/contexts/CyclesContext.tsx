import { createContext, ReactNode, useReducer, useState } from "react";
import { ActionTypes, Cycle, cyclesReducer } from "../reducers/Cycles";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPast: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsPast, setAmountSecondsPast] = useState(0)
 
  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId
      }
    })
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPast(seconds)
  }

  
  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle
      }
    })

    setAmountSecondsPast(0)
  }


  function interruptCurrentCycle() {

    dispatch({
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
      payload: {
        activeCycleId
      }
    })
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle, 
        activeCycleId, 
        amountSecondsPast, 
        markCurrentCycleAsFinished, 
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}