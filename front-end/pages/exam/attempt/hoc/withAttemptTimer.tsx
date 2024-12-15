import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AttemptTimerProps } from '../components/attempts/AttemptTimmer'
import { useSelector } from 'react-redux'
import { selectIncompleteDetailBySectionId } from '@/features/exam/attemptSelector'
import { toast } from 'react-hot-toast'
import { IStartStudentAttemptDetail } from '@/features/exam/type'

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
    const { id } = useParams<{ id: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const sectionId = Number(searchParams.get('sectionId'))
    const selectedDetail = useSelector(selectIncompleteDetailBySectionId)
    const [ready, setReady] = useState<IStartStudentAttemptDetail | undefined>(
      undefined,
    )
    useEffect(() => {
      if (sectionId !== 0 && attempt) {
        if (selectedDetail) {
          if (selectedDetail.sectionId === sectionId) {
            setReady(selectedDetail)
          } else {
            console.log('aaaaa', selectedDetail)
            onBack &&
              onBack(
                `/exam/${id}/attempts/start?sectionId=${selectedDetail.sectionId}`,
              )
          }
        } else {
          toast.error('Không tìm thấy quá trình thi')
          setTimeout(() => {
            navigate(`/exam/${id}/attempts`, { replace: true })
          }, 500)
        }
      }
    }, [sectionId, selectedDetail, attempt])
    const handleTimeUp = () => {}
    if (!ready) return <></>
    return (
      <WrappedComponent
        {...(props as P)}
        minutes={ready.duration}
        onTimeUp={handleTimeUp}
      />
    )
  }

  return TimerHOC
}

export default withAttemptTimer
