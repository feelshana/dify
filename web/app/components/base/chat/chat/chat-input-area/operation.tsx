import { memo } from 'react'
import {
  RiMicLine,
} from '@remixicon/react'
import type {
  EnableType,
} from '../../types'
import type { Theme } from '../../embedded-chatbot/theme/theme-context'
import Button from '@/app/components/base/button'
import ActionButton from '@/app/components/base/action-button'
import { FileUploaderInChatInput } from '@/app/components/base/file-uploader'
import type { FileUpload } from '@/app/components/base/features/types'
import cn from '@/utils/classnames'
import sendBtnImg from '@/assets/ic_send@2x.png'

type OperationProps = {
  fileConfig?: FileUpload
  speechToTextConfig?: EnableType
  onShowVoiceInput?: () => void
  onSend: () => void
  theme?: Theme | null
}
const Operation = (
  {
    ref,
    fileConfig,
    speechToTextConfig,
    onShowVoiceInput,
    onSend,
    theme,
  }: OperationProps & {
    ref: React.RefObject<HTMLDivElement>;
  },
) => {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-end',
      )}
    >
      <div
        className='flex items-center pl-1'
        ref={ref}
      >
        <div className='flex items-center space-x-1'>
          {fileConfig?.enabled && <FileUploaderInChatInput fileConfig={fileConfig} />}
          {
            speechToTextConfig?.enabled && (
              <ActionButton
                size='l'
                onClick={onShowVoiceInput}
              >
                <RiMicLine className='h-5 w-5' />
              </ActionButton>
            )
          }
        </div>
        <Button
          className='ml-3 w-8 px-0'
          variant='primary'
          onClick={onSend}
          style={
            /* eslint-disable-next-line sonarjs/no-all-duplicated-branches */
            theme
              ? {
                // backgroundColor: theme.primaryColor,
                backgroundImage: `url(${sendBtnImg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
              : {
                backgroundImage: `url(${sendBtnImg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
          }
        >
          {/* <RiSendPlane2Fill className='h-4 w-4' /> */}
        </Button>
      </div>
    </div>
  )
}
Operation.displayName = 'Operation'

export default memo(Operation)
