import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AttemptTimerProps } from '../components/attempts/AttemptTimmer'
import { useDispatch, useSelector } from 'react-redux'
import { selectIncompleteDetailBySectionId } from '@/features/exam/attemptSelector'
import { toast } from 'react-hot-toast'
import { IStartStudentAttemptDetail } from '@/features/exam/type'
import { submitAttemptPart, resetAnswer } from '@/features/exam/attemptSlice'

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
    const dispatch = useDispatch()
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const sectionId = Number(searchParams.get('sectionId'))
    const selectedDetail = useSelector(selectIncompleteDetailBySectionId)
    const [ready, setReady] = useState<IStartStudentAttemptDetail | undefined>(
      undefined,
    )
    useEffect(() => {
      if (sectionId !== 0 && attempt) {
        if (selectedDetail) {
          console.log('aaa', selectedDetail)
          // if (selectedDetail.sectionId === sectionId) {
          //   setReady(selectedDetail)
          // } else {
          //   onBack &&
          //     onBack(
          //       `/exam/${id}/attempts/start?sectionId=${selectedDetail.sectionId}`,
          //     )
          // }
        } else {
          toast.error('Không tìm thấy quá trình thi')
          setTimeout(() => {
            navigate(`/exam/${id}/attempts`, { replace: true })
          }, 500)
        }
      }
    }, [sectionId, selectedDetail, attempt])
    const handleTimeUp = async () => {
      // @ts-ignore
      const resultAction = await dispatch(submitAttemptPart())
      // @ts-ignore
      if (resultAction?.payload?.success) {
        if (!resultAction?.payload.isFinish) {
          const details = resultAction.payload.details.filter(
            (x: any) => x.endTime === null,
          )
          if (details.length > 0) {
            // dispatch(resetAnswer())
            // navigate(
            //   `/exam/${id}/attempts/start?sectionId=${details[0].sectionId}`,
            //   { replace: true },
            // )
          }
        } else {
          toast.success('kết thúc bài thi')
        }
      } else {
        toast.error('Không tìm thấy quá trình thi')
        navigate(`/exam/${id}/attempts`, { replace: true })
      }
    }
    if (!ready) return <></>
    return (
      <WrappedComponent
        {...(props as P)}
        startTime={ready.startTime}
        minutes={ready.duration}
        onTimeUp={handleTimeUp}
      />
    )
  }

  return TimerHOC
}

export default withAttemptTimer
