import { elementPropsInterface } from '@/interfaces/share/elementProps'
import { useRef } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

export default function ZoomPan({ children }: elementPropsInterface) {
  const transformWrapperRef = useRef(null)

  return (
    <div style={{
      width: '100%',
      height: '100%',
    }}>
      <TransformWrapper
        doubleClick={{ disabled: true }}
        ref={transformWrapperRef}
      >
        <TransformComponent 
          contentStyle={{
            width: '100%',
            height: '100%',
          }}
          wrapperStyle={{
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
