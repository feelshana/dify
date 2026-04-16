import type {
  FC,
  ReactNode,
} from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  ChatConfig,
  ChatItem,
} from '../../types'
import Operation from './operation'
import AgentContent from './agent-content'
import BasicContent from './basic-content'
import SuggestedQuestions from './suggested-questions'
import ClassificationSelector from './classification-selector'
import More from './more'
import WorkflowProcessItem from './workflow-process'
import LoadingAnim from '@/app/components/base/chat/chat/loading-anim'
import Citation from '@/app/components/base/chat/chat/citation'
import { EditTitle } from '@/app/components/app/annotation/edit-annotation-modal/edit-item'
import type { AppData } from '@/models/share'
import cn from '@/utils/classnames'
import { FileList } from '@/app/components/base/file-uploader'
import ContentSwitch from '../content-switch'
import { WorkflowRunningStatus } from '@/app/components/workflow/types'

type AnswerProps = {
  item: ChatItem
  question: string
  index: number
  config?: ChatConfig
  answerIcon?: ReactNode
  responding?: boolean
  showPromptLog?: boolean
  chatAnswerContainerInner?: string
  hideProcessDetail?: boolean
  appData?: AppData
  noChatInput?: boolean
  switchSibling?: (siblingMessageId: string) => void
  isLast?: boolean
}
const Answer: FC<AnswerProps> = ({
  item,
  question,
  index,
  config,
  answerIcon,
  responding,
  showPromptLog,
  chatAnswerContainerInner,
  hideProcessDetail,
  appData,
  noChatInput,
  switchSibling,
  isLast,
}) => {
  const { t } = useTranslation()
  const {
    content,
    citation,
    agent_thoughts,
    more,
    annotation,
    workflowProcess,
    allFiles,
    message_files,
    classificationOptions,
  } = item
  const hasAgentThoughts = !!agent_thoughts?.length
  const needClassificationSelection = classificationOptions?.needSelection
    && classificationOptions?.optionA
    && classificationOptions?.optionB
  const currentTracing = workflowProcess?.tracing?.slice().reverse().find(i => i.status === WorkflowRunningStatus.Running) || workflowProcess?.tracing?.[workflowProcess?.tracing?.length - 1]
  const currentTracingTitle = currentTracing?.title || ''
  const completedTracingTitles = (workflowProcess?.tracing || [])
    .filter(i => i.status === WorkflowRunningStatus.Succeeded)
    .map(i => i.title)
    .filter(Boolean)
    .slice(-3)

  const [containerWidth, setContainerWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const getContainerWidth = () => {
    if (containerRef.current)
      setContainerWidth(containerRef.current?.clientWidth + 16)
  }
  useEffect(() => {
    getContainerWidth()
  }, [])

  const getContentWidth = () => {
    if (contentRef.current)
      setContentWidth(contentRef.current?.clientWidth)
  }

  useEffect(() => {
    if (!responding)
      getContentWidth()
  }, [responding])

  // Recalculate contentWidth when content changes (e.g., SVG preview/source toggle)
  useEffect(() => {
    if (!containerRef.current)
      return
    const resizeObserver = new ResizeObserver(() => {
      getContentWidth()
    })
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const handleSwitchSibling = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev')
      item.prevSibling && switchSibling?.(item.prevSibling)
    else
      item.nextSibling && switchSibling?.(item.nextSibling)
  }, [switchSibling, item.prevSibling, item.nextSibling])

  const isWorkflowRunning = responding && !content && !hasAgentThoughts && !!workflowProcess
  return (
    <div className='mb-2 flex last:mb-0'>
      {/* <div className='relative h-10 w-10 shrink-0'>
        {answerIcon || <AnswerIcon />}
        {responding && (
          <div className='absolute left-[-3px] top-[-3px] flex h-4 w-4 items-center rounded-full border-[0.5px] border-divider-subtle bg-background-section-burn pl-[6px] shadow-xs'>
            <LoadingAnim type='avatar' />
          </div>
        )}
      </div> */}
      <div className='chat-answer-container group ml-4 w-0 grow pb-4' ref={containerRef}>
        <div className={cn('group relative', chatAnswerContainerInner)}>
          {/* {
            (item.inputs && item.inputs.reportName)
            ? (<div className='text-text-primary'>{`已选报表【${item.inputs && item.inputs.reportName}】`}</div>) : ''
          }
          {
            (item.inputs && item.inputs.dashboardName)
            ? (<div className='text-text-primary'>{`已选仪表盘【${item.inputs && item.inputs.dashboardName}】`}</div>) : ''
          } */}
          <div
            ref={contentRef}
            className={cn(
              'body-lg-regular relative inline-block w-full rounded-2xl text-text-primary',
              !isWorkflowRunning && 'bg-chat-bubble-bg px-4 py-3',
              workflowProcess && 'w-full',
              isWorkflowRunning && 'px-0 py-0',
            )}
            style={{
              backgroundColor: isWorkflowRunning ? 'transparent' : undefined,
              boxShadow: isWorkflowRunning ? 'none' : undefined,
            }}
          >
            {
              !responding && (
                <Operation
                  hasWorkflowProcess={!!workflowProcess}
                  maxSize={containerWidth - contentWidth - 4}
                  contentWidth={contentWidth}
                  item={item}
                  question={question}
                  index={index}
                  showPromptLog={showPromptLog}
                  noChatInput={noChatInput}
                />
              )
            }
            {/** Render the normal steps */}
            {
              workflowProcess && !hideProcessDetail && (
                <WorkflowProcessItem
                  data={workflowProcess}
                  item={item}
                  hideProcessDetail={hideProcessDetail}
                />
              )
            }
            {/** Hide workflow steps by it's settings in siteInfo */}
            {
              workflowProcess && hideProcessDetail && appData && (
                <WorkflowProcessItem
                  data={workflowProcess}
                  item={item}
                  hideProcessDetail={hideProcessDetail}
                  readonly={!appData.site.show_workflow_steps}
                />
              )
            }
            {
              responding && !content && !hasAgentThoughts && (
                workflowProcess
                  ? (
                    <div className='w-full space-y-1.5'>
                      <style>
                        {`
                          @keyframes shimmer {
                            0% { background-position: 100% 50%; }
                            100% { background-position: -100% 50%; }
                          }
                        `}
                      </style>
                      <div
                        className='inline-block text-base font-medium'
                        style={{
                          background: 'linear-gradient(90deg, var(--color-text-tertiary) 0%, var(--color-text-tertiary) 35%, var(--color-text-primary) 50%, var(--color-text-tertiary) 65%, var(--color-text-tertiary) 100%)',
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          animation: 'shimmer 1.5s infinite linear',
                        }}
                      >
                        {currentTracingTitle ? `${currentTracingTitle}…` : '正在处理中…'}
                      </div>
                      {/* {!!question && (
                        <div className='system-xs-regular break-all text-text-quaternary'>
                          {`“${question}”`}
                        </div>
                      )} */}
                      {/* {!!completedTracingTitles.length && (
                        <div className='system-xs-regular text-text-quaternary'>
                          {`已完成：${completedTracingTitles.join('、')}`}
                        </div>
                      )} */}
                    </div>
                  )
                  : (
                    <div className='flex h-5 w-6 items-center justify-center'>
                      <LoadingAnim type='text' />
                    </div>
                  )
              )
            }
            {/* 分类选择器：优先显示，替代正常内容 */}
            {
              content && !hasAgentThoughts && (
                <BasicContent item={item} />
              )
            }
            {
              (hasAgentThoughts) && (
                <AgentContent
                  item={item}
                  responding={responding}
                  content={content}
                />
              )
            }
            {
              needClassificationSelection && (
                <ClassificationSelector item={item} isLast={isLast} />
              )
            }
            {
              !!allFiles?.length && (
                <FileList
                  className='my-1'
                  files={allFiles}
                  showDeleteAction={false}
                  showDownloadAction
                  canPreview
                />
              )
            }
            {
              !!message_files?.length && (
                <FileList
                  className='my-1'
                  files={message_files}
                  showDeleteAction={false}
                  showDownloadAction
                  canPreview
                />
              )
            }
            {
              annotation?.id && annotation.authorName && (
                <EditTitle
                  className='mt-1'
                  title={t('appAnnotation.editBy', { author: annotation.authorName })}
                />
              )
            }
            <SuggestedQuestions item={item} />
            {
              !!citation?.length && !responding && (
                <Citation data={citation} showHitInfo={config?.supportCitationHitInfo} />
              )
            }
            {
              item.siblingCount && item.siblingCount > 1 && item.siblingIndex !== undefined && (
                <ContentSwitch
                  count={item.siblingCount}
                  currentIndex={item.siblingIndex}
                  prevDisabled={!item.prevSibling}
                  nextDisabled={!item.nextSibling}
                  switchSibling={handleSwitchSibling}
                />
              )
            }
          </div>
        </div>
        <More more={more} />
      </div>
    </div>
  )
}

export default memo(Answer)
