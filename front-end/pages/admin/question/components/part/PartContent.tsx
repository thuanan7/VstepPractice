import { useSearchParams } from 'react-router-dom'
import PartEmpty from './PartEmpty'

const PartContent = () => {
  const [searchParams] = useSearchParams() // Lấy searchParams từ URL
  const partId = searchParams.get('part')
  console.log('aaaa', partId)
  if (!partId) {
    return <PartEmpty />
  }
  return <div>dsaa</div>
}
export default PartContent
