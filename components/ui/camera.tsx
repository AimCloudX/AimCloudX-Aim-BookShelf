import React, { useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

function CameraApp(props: { onReadCode: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const codeReader = new BrowserMultiFormatReader()

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }

        requestAnimationFrame(scanLoop)
      } catch (err) {
        console.error(err)
      }
    }

    const scanLoop = () => {
      requestAnimationFrame(scanLoop)

      if (
        videoRef.current &&
        canvasRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
      ) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight

        ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

        try {
          const result = codeReader.decodeFromCanvas(canvas)
          props.onReadCode(result.getText())
        } catch (error) {}
      }
    }

    startCamera()

    return () => {
      // アンマウント時にカメラ停止などのクリーンアップ
      if (videoRef.current?.srcObject) {
        ;(videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ border: '1px solid #333' }} />
    </div>
  )
}

export default CameraApp
