import React from 'react'
import { AttemptTimerProps } from '../components/attempts/AttemptTimmer'

const withAttemptTimer = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const TimerHOC: React.FC<AttemptTimerProps & Omit<P, keyof P>> = ({
    minutes,
    onTimeUp,
    onBack,
    attempt,
    ...props
  }) => {
    const handleTimeUp = () => {}
    if (!attempt) return <></>
    return (
      <WrappedComponent
        {...(props as P)}
        startTime={attempt.startTime}
        minutes={attempt.duration}
        onTimeUp={handleTimeUp}
      />
    )
  }

  return TimerHOC
}

export default withAttemptTimer
