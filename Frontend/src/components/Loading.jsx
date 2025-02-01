import React from 'react'
import { ClipLoader } from 'react-spinners'

const Loading = ({loading}) => {
  return (
    <div className='h-full flex items-center justify-center'>
        <ClipLoader color='#10B981' loading={loading} size={65} />
    </div>
  )
}

export default Loading