import { Check } from '@/app/components/base/icons/src/vender/line/general'
import type { FC } from 'react'
import { memo, useState } from 'react'
import type { ChatItem } from '../../types'
import { useChatContext } from '../context'
import cn from '@/utils/classnames'

type ClassificationSelectorProps = {
  item: ChatItem
  isLast?: boolean
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
  isLast,
}) => {
  const { onSend } = useChatContext()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const {
    classificationOptions,
  } = item

  const isDisabled = (isLast === false) || isSubmitted

  // 只在有分类选项时显示（基础条件）
  if (!classificationOptions?.needSelection || !classificationOptions?.optionA || !classificationOptions?.optionB)
    return null

  const { optionA, optionB } = classificationOptions

  const handleSelect = (option: string) => {
    if (isDisabled) return
    setIsSubmitted(true)
    setSelectedOption(option)
    onSend?.(option)
  }

  const renderButton = (option: string) => {
    const isSelected = selectedOption === option

    return (
      <button
        key={option}
        onClick={() => handleSelect(option)}
        disabled={isDisabled}
        className={cn(
          'group relative flex items-center gap-3 px-4 py-3',
          'rounded-2xl border', // Apple style border radius
          isDisabled
            ? (isSelected
                ? 'cursor-default border-primary-600 bg-primary-50' // Selected & Disabled (History Highlight) - Blue
                : 'cursor-not-allowed border-gray-100 bg-gray-50' // Unselected & Disabled - Visible Outline
              )
            : 'cursor-pointer border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:bg-[#F5F5F7] active:scale-[0.98] active:bg-gray-100', // Normal state
          'transition-all duration-200 ease-in-out',
        )}
      >
        <span className={cn(
          'text-2xl transition-transform duration-200 ease-in-out',
          !isDisabled && 'group-hover:scale-110',
        )}>
          {getIconForOption(option)}
        </span>
        <span className={cn(
          'system-md-medium',
          isDisabled
            ? (isSelected ? 'text-primary-600' : 'text-gray-400')
            : 'text-gray-900',
        )}>
          {option}
        </span>
      </button>
    )
  }

  return (
    <div className='mb-2 mt-3'>
      {/* 标题提示 */}
      <div className={cn(
        'system-sm-medium mb-3',
        isDisabled ? 'text-text-tertiary' : 'text-text-secondary',
      )}>
        请问您希望了解以下哪个方面的问题？
      </div>

      {/* 分类选择按钮 */}
      <div className='flex flex-wrap gap-3'>
        {renderButton(optionA)}
        {renderButton(optionB)}
      </div>

      {/* 底部提示 */}
      {!isDisabled && (
        <div className='system-xs-regular mt-2 text-text-tertiary'>
          💡 点击按钮后将继续回答您的问题
        </div>
      )}

      {/* 历史记录已选提示 */}
      {isDisabled && selectedOption && (
        <div className='mt-2 flex items-center gap-1 text-primary-600'>
          <Check className='h-3.5 w-3.5' />
          <div className='system-xs-medium'>
            已选择 {selectedOption}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ClassificationSelector)
