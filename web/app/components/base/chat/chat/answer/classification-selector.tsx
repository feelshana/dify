import type { FC } from 'react'
import { memo } from 'react'
import type { ChatItem } from '../../types'
import { useChatContext } from '../context'
import cn from '@/utils/classnames'

type ClassificationSelectorProps = {
  item: ChatItem
}

const getIconForOption = (text: string) => {
  if (!text) return '💡'
  if (text.includes('报表')) return '📊' // re: 报表查询 / 报表推荐
  if (text.includes('口径')) return '🎯' // in: 口径咨询
  if (text.includes('工具')) return '🔧' // gu: 分析云工具使用问题
  if (text.includes('业务')) return '📚' // bu: 业务知识咨询
  if (text.includes('数据')) return '📈' // da: 具体数据数值查询 / 数据分析报告请求
  if (text.includes('闲聊')) return '☕' // ot: 生活闲聊、常识科普
  return '💡'
}

const ClassificationSelector: FC<ClassificationSelectorProps> = ({
  item,
}) => {
  const { onSend } = useChatContext()

  const {
    classificationOptions,
  } = item

  // 只在有分类选项时显示
  if (!classificationOptions?.needSelection || !classificationOptions?.optionA || !classificationOptions?.optionB)
    return null

  const { optionA, optionB } = classificationOptions

  const handleSelect = (option: string) => {
    onSend?.(option)
  }

  const renderButton = (option: string) => (
    <button
      key={option}
      onClick={() => handleSelect(option)}
      className={cn(
        'group relative flex items-center gap-3 px-4 py-3',
        'rounded-2xl border border-gray-200', // Apple style border radius and color
        'bg-white', // Clean white background
        'shadow-sm transition-all duration-200 ease-in-out', // Subtle shadow
        'hover:border-gray-300 hover:bg-[#F5F5F7]', // Apple style hover background
        'active:scale-[0.98] active:bg-gray-100',
        'cursor-pointer',
      )}
    >
      <span className='text-2xl transition-transform duration-200 ease-in-out group-hover:scale-110'>
        {getIconForOption(option)}
      </span>
      <span className='system-md-medium text-gray-900'>
        {option}
      </span>
    </button>
  )

  return (
    <div className='mb-2 mt-3'>
      {/* 标题提示 */}
      <div className='system-sm-medium mb-3 text-text-secondary'>
        请问您希望了解以下哪个方面的问题？
      </div>

      {/* 分类选择按钮 */}
      <div className='flex flex-wrap gap-3'>
        {renderButton(optionA)}
        {renderButton(optionB)}
      </div>

      {/* 底部提示 */}
      <div className='system-xs-regular mt-2 text-text-tertiary'>
        💡 点击按钮后将继续回答您的问题
      </div>
    </div>
  )
}

export default memo(ClassificationSelector)
