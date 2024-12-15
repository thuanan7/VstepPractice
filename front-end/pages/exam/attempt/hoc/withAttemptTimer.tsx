import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AttemptTimerProps } from '../components/attempts/AttemptTimmer'
import { useSelector } from 'react-redux'
import { selectDetailBySectionId } from '@/features/exam/attemptSelector'
import { AttemptStatusType } from '@/features/exam/configs'
import { toast } from 'react-hot-toast'
import { IStartStudentAttemptDetail } from '@/features/exam/type'

const withAttemptTimer = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const TimerHOC: React.FC<AttemptTimerProps & Omit<P, keyof P>> = ({
    minutes,
    onTimeUp,
    ...props
  }) => {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const sectionId = Number(searchParams.get('sectionId'))
    const selectedDetail = useSelector(selectDetailBySectionId(sectionId))
    const [ready, setReady] = useState<IStartStudentAttemptDetail | undefined>(
      undefined,
    )
    useEffect(() => {
      if (sectionId !== 0) {
        if (selectedDetail) {
          if (selectedDetail.status === AttemptStatusType.InProgress) {
            setReady(selectedDetail)
          } else {
            console.log('aaaa', id)
            console.log('aaaaa', selectedDetail)
          }
        } else {
          toast.error('Không tìm thấy quá trình thi')
          setTimeout(() => {
            navigate(`/exam/${id}/attempts`)
          }, 500)
        }
      }
    }, [sectionId, selectedDetail])
    const handleTimeUp = () => {
      console.log('aaaa')
    }
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
